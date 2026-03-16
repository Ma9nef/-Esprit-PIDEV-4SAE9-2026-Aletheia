import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { CartService, Order } from '../../core/services/cart.service';

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

  constructor(
    private authService: AuthService,
    private cartService: CartService
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

  downloadItem(fileUrl: string | undefined): void {
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    }
  }

  getTotalItems(): number {
    return this.orders.reduce((sum, o) => sum + o.items.length, 0);
  }
}
