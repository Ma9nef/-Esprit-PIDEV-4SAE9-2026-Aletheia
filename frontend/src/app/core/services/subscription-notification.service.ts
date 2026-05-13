import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SubscriptionNotification, UnreadNotificationCount } from '../models/subscription.model';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionNotificationService {
  private apiUrl = '/api/subscriptions/notifications';

  constructor(private http: HttpClient) {}

  getUserNotifications(userId: string): Observable<SubscriptionNotification[]> {
    return this.http.get<SubscriptionNotification[]>(`${this.apiUrl}/user/${userId}`);
  }

  getUserUnreadCount(userId: string): Observable<UnreadNotificationCount> {
    return this.http.get<UnreadNotificationCount>(`${this.apiUrl}/user/${userId}/unread-count`);
  }

  markAllUserNotificationsAsRead(userId: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/user/${userId}/read-all`, {});
  }

  getAdminNotifications(): Observable<SubscriptionNotification[]> {
    return this.http.get<SubscriptionNotification[]>(`${this.apiUrl}/admin`);
  }

  getAdminUnreadCount(): Observable<UnreadNotificationCount> {
    return this.http.get<UnreadNotificationCount>(`${this.apiUrl}/admin/unread-count`);
  }

  markAllAdminNotificationsAsRead(): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/admin/read-all`, {});
  }

  markNotificationAsRead(notificationId: string): Observable<SubscriptionNotification> {
    return this.http.patch<SubscriptionNotification>(`${this.apiUrl}/${notificationId}/read`, {});
  }
}
