import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { CartService, Order, OrderItem } from '../../core/services/cart.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  activeSection = 'dashboard';
  orders: Order[] = [];
  ordersLoading = false;
  userId: number | null = null;
  userName = '';
  expandedOrderId: number | null = null;

  // Digital product viewer
  viewerOpen = false;
  viewerItem: OrderItem | null = null;
  viewerUrl: SafeResourceUrl | null = null;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUserFromToken();
    if (user) {
      this.userId = user.id;
      this.userName = user.email.split('@')[0];
      this.loadOrders();
    }
  }

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

  /** Check if a product type is digital (viewable/downloadable) */
  isDigitalProduct(item: OrderItem): boolean {
    const type = item.productType?.toUpperCase();
    return type === 'PDF' || type === 'EXAM';
  }

  /** Get a user-friendly label for the product type */
  getProductTypeLabel(item: OrderItem): string {
    switch (item.productType?.toUpperCase()) {
      case 'PDF': return 'PDF Document';
      case 'EXAM': return 'Exam Paper';
      case 'BOOK': return 'Physical Book';
      case 'CHILDREN_MATERIAL': return 'Children Material';
      default: return 'Resource';
    }
  }

  /** Download a digital product file */
  downloadItem(item: OrderItem): void {
    if (!item.fileUrl) return;
    const link = document.createElement('a');
    link.href = item.fileUrl;
    link.download = item.productTitle || 'download';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /** Open the in-browser viewer for digital products (PDF/EXAM) */
  viewItem(item: OrderItem): void {
    if (!item.fileUrl) return;
    this.viewerItem = item;

    // Use Google Docs viewer for PDF files as a fallback, or embed directly
    const url = item.fileUrl;
    if (url.toLowerCase().endsWith('.pdf')) {
      this.viewerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    } else {
      // For other digital files, try direct embed
      this.viewerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
    this.viewerOpen = true;
  }

  /** Close the viewer modal */
  closeViewer(): void {
    this.viewerOpen = false;
    this.viewerItem = null;
    this.viewerUrl = null;
  }

  getTotalItems(): number {
    return this.orders.reduce((sum, o) => sum + o.items.length, 0);
  }

  getDigitalItemsCount(): number {
    return this.orders.reduce((sum, o) =>
      sum + o.items.filter(i => this.isDigitalProduct(i)).length, 0);
  }
}
