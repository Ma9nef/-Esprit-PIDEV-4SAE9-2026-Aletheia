import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { CartService, Order } from '../../core/services/cart.service';
import { CatalogMenuService } from '../../core/services/catalog-menu.service'; // ✅ ADD

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  // ===== EXISTING =====
  activeSection = 'dashboard';
  orders: Order[] = [];
  ordersLoading = false;
  userId: number | null = null;
  userName = '';
  expandedOrderId: number | null = null;

  // ===== EXPLORE (NEW) =====
  menu: any[] = [];
  topCourses: any[] = [];

  isExploreOpen = false;
  selectedCategory: any = null;
  selectedSubCategory: string | null = null;

  private exploreTimeout: any; // prevents flicker

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private catalogMenuService: CatalogMenuService // ✅ ADD
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUserFromToken();
    if (user) {
      this.userId = user.id;
      this.userName = user.email.split('@')[0];
      this.loadOrders();
    }
  }

  // ===== EXISTING METHODS =====

  setActiveSection(section: string): void {
    this.activeSection = section;
    if (section === 'purchases' && this.orders.length === 0) {
      this.loadOrders();
    }
  }

  loadOrders(): void {
    if (!this.userId) return;
    this.ordersLoading = true;

    this.cartService.getOrdersByUser(this.userId).subscribe({
      next: (orders) => {
        this.orders = orders;
        this.ordersLoading = false;
      },
      error: () => {
        this.ordersLoading = false;
      }
    });
  }

  toggleOrder(orderId: number): void {
    this.expandedOrderId = this.expandedOrderId === orderId ? null : orderId;
  }

  downloadItem(fileUrl: string | undefined): void {
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    }
  }

  getTotalItems(): number {
    return this.orders.reduce((sum, o) => sum + o.items.length, 0);
  }

  // ===== EXPLORE METHODS =====

  openExplore(): void {
    clearTimeout(this.exploreTimeout);
    this.isExploreOpen = true;

    // load menu only once
    if (this.menu.length === 0) {
      this.catalogMenuService.getMenu().subscribe(data => {
        this.menu = data;

        if (data.length > 0) {
          this.selectCategory(data[0]);
        }
      });
    }
  }

  closeExplore(): void {
    // delay prevents flicker when moving mouse
    this.exploreTimeout = setTimeout(() => {
      this.isExploreOpen = false;
    }, 200);
  }

  selectCategory(cat: any): void {
    this.selectedCategory = cat;
    this.selectedSubCategory = null;

    this.loadTopCourses(cat.category);
  }

  selectSubCategory(sub: string): void {
    this.selectedSubCategory = sub;

    this.loadTopCourses(this.selectedCategory.category, sub);
  }

  loadTopCourses(category: string, subCategory?: string): void {
    this.catalogMenuService.getTop(category, subCategory)
      .subscribe(data => {
        this.topCourses = data;
      });
  }
}