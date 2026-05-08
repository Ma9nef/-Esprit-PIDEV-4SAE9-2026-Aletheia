import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { SubscriptionNotificationService } from '../../core/services/subscription-notification.service';
import { SubscriptionNotification } from '../../core/models/subscription.model';

@Component({
  selector: 'app-subscription-notifications',
  templateUrl: './subscription-notifications.component.html',
  styleUrls: ['./subscription-notifications.component.css']
})
export class SubscriptionNotificationsComponent implements OnInit {
  notifications: SubscriptionNotification[] = [];
  loading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private notificationService: SubscriptionNotificationService
  ) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  markAllAsRead(): void {
    const currentUser = this.authService.getUserFromToken();
    if (!currentUser) {
      return;
    }

    this.notificationService.markAllUserNotificationsAsRead(String(currentUser.id)).subscribe({
      next: () => this.loadNotifications(),
      error: () => {
        this.error = 'Unable to mark notifications as read.';
      }
    });
  }

  markAsRead(notification: SubscriptionNotification): void {
    if (notification.read) {
      return;
    }

    this.notificationService.markNotificationAsRead(notification.notificationId).subscribe({
      next: () => {
        notification.read = true;
      },
      error: () => {
        this.error = 'Unable to update this notification.';
      }
    });
  }

  private loadNotifications(): void {
    const currentUser = this.authService.getUserFromToken();
    if (!currentUser) {
      this.notifications = [];
      return;
    }

    this.loading = true;
    this.error = '';

    this.notificationService.getUserNotifications(String(currentUser.id)).subscribe({
      next: (notifications) => {
        this.notifications = notifications;
        this.loading = false;
      },
      error: () => {
        this.error = 'Unable to load your subscription notifications.';
        this.loading = false;
      }
    });
  }
}
