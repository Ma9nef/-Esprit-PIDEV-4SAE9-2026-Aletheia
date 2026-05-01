import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';
import { CartService, Cart } from '../../core/services/cart.service';
import { LoanService } from '../../core/services/loan.service';
import { NotificationService } from '../../core/services/notification.service';

interface Product {
  id: number;
  title: string;
  description: string;
  author?: string;
  type: string;
  price?: number;
  fileUrl?: string;
  coverImageUrl?: string;
  available?: boolean;
  stockQuantity?: number;
  stockThreshold?: number;
  lowStock?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface LibraryResource {
  id: number;
  title: string;
  description: string;
  category: string;
  resourceType: string;
  downloadUrl?: string;
  imageUrl?: string;
  createdDate?: string;
  stockQuantity?: number;
  lowStock?: boolean;
  price?: number;
}

@Component({
  standalone: false,
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent implements OnInit {
  libraryResources: LibraryResource[] = [];
  filteredResources: LibraryResource[] = [];
  loading = true;
  error: string | null = null;
  searchQuery = '';
  selectedCategory = 'all';
  selectedResourceType = 'all';

  // Cart state
  cart: Cart | null = null;
  cartOpen = false;
  cartLoading = false;
  checkoutLoading = false;
  checkoutSuccess = false;
  userId: number | null = null;

  // Borrow state
  borrowedProductIds = new Set<number>();
  borrowingProductId: number | null = null;
  borrowToast: { message: string; type: 'success' | 'error' } | null = null;

  categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'book', name: 'Book' },
    { id: 'pdf', name: 'PDF' },
    { id: 'children_material', name: 'Children Material' },
    { id: 'exam', name: 'Exam' }
  ];

  resourceTypes = [
    { id: 'all', name: 'All Types' },
    { id: 'book', name: 'Book' },
    { id: 'pdf', name: 'PDF' },
    { id: 'children_material', name: 'Children Material' },
    { id: 'exam', name: 'Exam' }
  ];

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private cartService: CartService,
    private loanService: LoanService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUserFromToken();
    if (user) {
      this.userId = user.id;
      this.loadCart();
      this.loadActiveLoans();
    }
    this.loadLibraryResources();
  }

  loadActiveLoans(): void {
    if (!this.userId) return;
    this.loanService.getActiveLoansByUser(this.userId).subscribe({
      next: (loans) => {
        this.borrowedProductIds = new Set(loans.map(l => l.productId));
      },
      error: () => { /* non-blocking — borrow button still shows */ }
    });
  }

  isAlreadyBorrowed(resourceId: number): boolean {
    return this.borrowedProductIds.has(resourceId);
  }

  borrowProduct(resource: LibraryResource): void {
    if (!this.userId) {
      this.showBorrowToast('Please log in to borrow books.', 'error');
      return;
    }
    this.borrowingProductId = resource.id;
    this.loanService.borrow(this.userId, resource.id).subscribe({
      next: (loan) => {
        this.borrowedProductIds.add(resource.id);
        // Reflect stock decrement locally
        if (resource.stockQuantity != null && resource.stockQuantity > 0) {
          resource.stockQuantity--;
        }
        this.borrowingProductId = null;
        this.showBorrowToast(
          `"${resource.title}" borrowed! Due back on ${loan.dueDate}.`,
          'success'
        );
      },
      error: (err) => {
        this.borrowingProductId = null;
        const msg = err?.error?.message || 'Failed to borrow. Please try again.';
        this.showBorrowToast(msg, 'error');
      }
    });
  }

  showBorrowToast(message: string, type: 'success' | 'error'): void {
    this.borrowToast = { message, type };
    setTimeout(() => this.borrowToast = null, 5000);
  }

  loadCart(): void {
    if (!this.userId) return;
    this.cartLoading = true;
    this.cartService.getCart(this.userId).subscribe({
      next: (cart) => {
        this.cart = cart;
        this.cartLoading = false;
      },
      error: () => {
        this.cartLoading = false;
      }
    });
  }

  loadLibraryResources(): void {
    this.loading = true;
    this.error = null;
    this.http.get<Product[]>('/api/products')
      .subscribe({
        next: (data) => {
          this.libraryResources = data.map(product => ({
            id: product.id,
            title: product.title,
            description: product.description || '',
            category: product.type.toLowerCase(),
            resourceType: product.type.toLowerCase(),
            downloadUrl: product.fileUrl,
            imageUrl: product.coverImageUrl,
            createdDate: product.createdAt || product.updatedAt,
            stockQuantity: product.stockQuantity ?? 0,
            lowStock: product.lowStock ?? false,
            price: product.price ?? 0
          }));
          this.filterResources();
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading library resources:', err);
          this.error = 'Failed to load resources. Using mock data.';
          this.libraryResources = this.getMockData();
          this.filterResources();
          this.loading = false;
        }
      });
  }

  filterResources(): void {
    this.filteredResources = this.libraryResources.filter(resource => {
      const matchesSearch = resource.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                           resource.description.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesCategory = this.selectedCategory === 'all' || resource.category === this.selectedCategory;
      const matchesType = this.selectedResourceType === 'all' || resource.resourceType === this.selectedResourceType;

      return matchesSearch && matchesCategory && matchesType;
    });
  }

  countForCategory(catId: string): number {
    if (catId === 'all') return this.libraryResources.length;
    return this.libraryResources.filter(r => r.category === catId).length;
  }

  onSearchChange(query: string): void {
    this.searchQuery = query;
    this.filterResources();
  }

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
    this.filterResources();
  }

  onResourceTypeChange(type: string): void {
    this.selectedResourceType = type;
    this.filterResources();
  }

  // Cart methods
  isInCart(resourceId: number): boolean {
    if (!this.cart) return false;
    return this.cart.items.some(item => item.product.id === resourceId);
  }

  getCartItemCount(): number {
    if (!this.cart) return 0;
    return this.cart.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  getCartTotal(): number {
    if (!this.cart) return 0;
    return this.cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  }

  addToCart(resource: LibraryResource): void {
    if (!this.userId) {
      alert('Please log in to add items to your cart.');
      return;
    }
    this.cartService.addToCart(this.userId, resource.id).subscribe({
      next: (cart) => {
        this.cart = cart;
      },
      error: (err) => {
        console.error('Error adding to cart:', err);
        const msg = err?.error?.message || err?.message || 'Unknown error';
        alert('Failed to add item to cart: ' + msg);
      }
    });
  }

  removeFromCart(cartItemId: number): void {
    if (!this.userId) return;
    this.cartService.removeItem(this.userId, cartItemId).subscribe({
      next: (cart) => {
        this.cart = cart;
      },
      error: (err) => {
        console.error('Error removing item:', err);
      }
    });
  }

  clearCart(): void {
    if (!this.userId) return;
    this.cartService.clearCart(this.userId).subscribe({
      next: () => {
        this.cart = null;
        this.loadCart();
      },
      error: (err) => {
        console.error('Error clearing cart:', err);
      }
    });
  }

  toggleCart(): void {
    this.cartOpen = !this.cartOpen;
    this.checkoutSuccess = false;
  }

  checkout(): void {
    if (!this.userId) return;
    this.checkoutLoading = true;
    this.cartService.checkout(this.userId).subscribe({
      next: () => {
        this.checkoutLoading = false;
        this.checkoutSuccess = true;
        this.cart = null;
        this.loadCart();
        this.notificationService.refreshUnreadCount();
        this.notificationService.loadNotifications();
      },
      error: (err) => {
        console.error('Error during checkout:', err);
        this.checkoutLoading = false;
        alert('Checkout failed. Please try again.');
      }
    });
  }

  downloadResource(resource: LibraryResource): void {
    if (resource.downloadUrl) {
      window.open(resource.downloadUrl, '_blank');
    }
  }

  getMockData(): LibraryResource[] {
    return [
      {
        id: 1,
        title: 'Spring Boot Complete Guide',
        description: 'Comprehensive guide to building microservices with Spring Boot and Spring Cloud.',
        category: 'pdf',
        resourceType: 'pdf',
        imageUrl: 'assets/library/spring-boot.png',
        price: 29.99
      },
      {
        id: 2,
        title: 'Angular Best Practices',
        description: 'Learn modern Angular patterns, dependency injection, and reactive programming.',
        category: 'pdf',
        resourceType: 'pdf',
        imageUrl: 'assets/library/angular-best-practices.png',
        price: 24.99
      },
      {
        id: 3,
        title: 'Python Data Science Tutorial',
        description: 'Master data manipulation, analysis, and visualization with Python.',
        category: 'book',
        resourceType: 'book',
        imageUrl: 'assets/library/python-ds.png',
        price: 34.99
      },
      {
        id: 4,
        title: 'Docker & Kubernetes Essentials',
        description: 'Complete guide to containerization and orchestration technologies.',
        category: 'book',
        resourceType: 'book',
        imageUrl: 'assets/library/docker-k8s.png',
        price: 39.99
      },
      {
        id: 5,
        title: 'Machine Learning Algorithms',
        description: 'Understanding ML algorithms: supervised, unsupervised, and deep learning.',
        category: 'pdf',
        resourceType: 'pdf',
        imageUrl: 'assets/library/ml-algorithms.png',
        price: 19.99
      },
      {
        id: 6,
        title: 'RESTful API Design',
        description: 'Best practices for designing and building RESTful APIs.',
        category: 'pdf',
        resourceType: 'pdf',
        imageUrl: 'assets/library/api-design.png',
        price: 14.99
      }
    ];
  }
}

