import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SubscriptionNotificationService } from '../../core/services/subscription-notification.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  showDashboardContent = true;
  showDashboardWidgets = true;   // ✅ ADD THIS LINE
  adminUnreadNotificationCount = 0;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private notificationService: SubscriptionNotificationService
  ) {}

  ngOnInit(): void {
    // Listen for child route changes
    this.activatedRoute.firstChild?.url.subscribe(() => {
      // If there's a child route active (like manage-library or manage-users), hide dashboard content
      this.showDashboardContent = !this.activatedRoute.firstChild;
    });
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.showDashboardContent = !this.activatedRoute.firstChild;
        this.loadAdminUnreadCount();
      });

    this.loadAdminUnreadCount();
  }

  markAdminNotificationsAsRead(): void {
    this.notificationService.markAllAdminNotificationsAsRead().subscribe({
      next: () => {
        this.adminUnreadNotificationCount = 0;
      }
    });
  }

  private loadAdminUnreadCount(): void {
    this.notificationService.getAdminUnreadCount().subscribe({
      next: (response) => {
        this.adminUnreadNotificationCount = response.unreadCount ?? 0;
      },
      error: () => {
        this.adminUnreadNotificationCount = 0;
      }
    });
  }
}
