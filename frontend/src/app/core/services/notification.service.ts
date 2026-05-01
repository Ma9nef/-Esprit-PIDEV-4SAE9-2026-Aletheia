import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, interval, of, Subscription } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

export type NotificationType = 'INFO' | 'WARNING' | 'SUCCESS' | 'ERROR';

export interface AppNotification {
  id: number;
  recipient_id: number;
  recipient_role: string;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  read_at: string | null;
}

@Injectable({ providedIn: 'root' })
export class NotificationService implements OnDestroy {
  private readonly base = '/api/notifications';

  private _notifications$ = new BehaviorSubject<AppNotification[]>([]);
  private _unreadCount$ = new BehaviorSubject<number>(0);

  readonly notifications$ = this._notifications$.asObservable();
  readonly unreadCount$ = this._unreadCount$.asObservable();

  private pollSub?: Subscription;

  constructor(private http: HttpClient) {}

  startPolling(): void {
    this.refreshUnreadCount();
    this.pollSub = interval(30_000)
      .pipe(
        switchMap(() =>
          this.http
            .get<{ count: number }>(`${this.base}/mine/unread-count`)
            .pipe(catchError(() => of({ count: this._unreadCount$.getValue() })))
        )
      )
      .subscribe({ next: (res) => this._unreadCount$.next(res.count) });
  }

  stopPolling(): void {
    this.pollSub?.unsubscribe();
  }

  refreshUnreadCount(): void {
    this.http
      .get<{ count: number }>(`${this.base}/mine/unread-count`)
      .pipe(catchError(() => of({ count: this._unreadCount$.getValue() })))
      .subscribe({ next: (res) => this._unreadCount$.next(res.count) });
  }

  loadNotifications(skip = 0, limit = 20): void {
    this.http
      .get<AppNotification[]>(`${this.base}/mine`, { params: { skip: String(skip), limit: String(limit) } })
      .subscribe({
        next: items => this._notifications$.next(items),
        error: () => {}
      });
  }

  markAsRead(id: number): void {
    this.http.patch<AppNotification>(`${this.base}/${id}/read`, {}).subscribe({
      next: updated => {
        const current = this._notifications$.getValue();
        this._notifications$.next(current.map(n => (n.id === id ? updated : n)));
        this._unreadCount$.next(Math.max(0, this._unreadCount$.getValue() - 1));
      },
      error: () => {}
    });
  }

  markAllAsRead(): void {
    this.http.patch<{ updated: number }>(`${this.base}/mine/read-all`, {}).subscribe({
      next: () => {
        const current = this._notifications$.getValue();
        this._notifications$.next(current.map(n => ({ ...n, is_read: true })));
        this._unreadCount$.next(0);
      },
      error: () => {}
    });
  }

  deleteNotification(id: number): void {
    this.http.delete(`${this.base}/${id}`).subscribe({
      next: () => {
        const current = this._notifications$.getValue();
        const removed = current.find(n => n.id === id);
        this._notifications$.next(current.filter(n => n.id !== id));
        if (removed && !removed.is_read) {
          this._unreadCount$.next(Math.max(0, this._unreadCount$.getValue() - 1));
        }
      },
      error: () => {}
    });
  }

  ngOnDestroy(): void {
    this.stopPolling();
  }
}
