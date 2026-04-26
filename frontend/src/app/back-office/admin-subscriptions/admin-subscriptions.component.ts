import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionService } from '../../../../core/services/subscription.service';
import { SubscriptionResponse } from '../../../../core/models/subscription.model';

@Component({
  selector: 'app-admin-subscriptions',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-subscriptions">
      <div class="page-header">
        <h1>Subscriptions Management</h1>
      </div>

      <p *ngIf="loading">Loading...</p>

      <div class="table-container" *ngIf="!loading && subscriptions.length > 0">
        <table class="data-table">
          <thead>
          <tr>
            <th>Subscription #</th>
            <th>User ID</th>
            <th>Plan</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr *ngFor="let sub of subscriptions">
            <td><code>{{ sub.subscriptionNumber }}</code></td>
            <td>{{ sub.userId }}</td>
            <td>{{ sub.planName }}</td>
            <td>{{ formatDate(sub.startDate) }}</td>
            <td>{{ formatDate(sub.endDate) }}</td>
            <td>
                <span class="badge" [ngClass]="{
                  'badge-success': sub.status === 'ACTIVE',
                  'badge-danger': sub.status === 'EXPIRED',
                  'badge-warning': sub.status === 'CANCELED',
                  'badge-secondary': sub.status === 'PENDING'
                }">
                  {{ sub.status }}
                </span>
            </td>
            <td>
              <button *ngIf="sub.status === 'ACTIVE' && sub.subscriptionId"
                      (click)="onCancel(sub.subscriptionId)"
                      class="btn-cancel"
                      [disabled]="cancelInProgress[sub.subscriptionId]">
                {{ cancelInProgress[sub.subscriptionId] ? 'Canceling...' : 'Cancel' }}
              </button>
              <span *ngIf="sub.status !== 'ACTIVE'" class="text-muted">—</span>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <p *ngIf="!loading && subscriptions.length === 0" class="empty">No subscriptions found.</p>
      <p *ngIf="error" class="error">{{ error }}</p>
    </div>
  `,
  styles: [`
    .admin-subscriptions { max-width: 100%; }
    .page-header { margin-bottom: 1.5rem; }
    .table-container { overflow-x: auto; }
    .data-table { width: 100%; border-collapse: collapse; }
    .data-table th, .data-table td { padding: 0.75rem; text-align: left; border-bottom: 1px solid #e2e8f0; }
    .data-table th { background: #edf2f7; }
    code { background: #edf2f7; padding: 0.2rem 0.4rem; border-radius: 4px; font-size: 0.9em; }
    .badge {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.85rem;
      font-weight: 500;
    }
    .badge-success { background: #c6f6d5; color: #22543d; }
    .badge-danger { background: #fed7d7; color: #742a2a; }
    .badge-warning { background: #feebc8; color: #744210; }
    .badge-secondary { background: #e2e8f0; color: #2d3748; }
    .btn-cancel {
      padding: 0.25rem 0.5rem;
      color: #e53e3e;
      border: 1px solid #e53e3e;
      background: #fff;
      border-radius: 4px;
      cursor: pointer;
    }
    .btn-cancel:hover:not(:disabled) { background: #fff5f5; }
    .btn-cancel:disabled { opacity: 0.5; cursor: not-allowed; }
    .text-muted { color: #a0aec0; }
    .empty, .error { padding: 1rem; }
    .error { color: #e53e3e; }
  `]
})
export class AdminSubscriptionsComponent implements OnInit {
  subscriptions: SubscriptionResponse[] = [];
  loading = true;
  error = '';
  cancelInProgress: { [key: string]: boolean } = {};

  constructor(private subscriptionService: SubscriptionService) {}

  ngOnInit(): void {
    this.loadSubscriptions();
  }

  loadSubscriptions(): void {
    this.loading = true;
    this.subscriptionService.getAllSubscriptions().subscribe({
      next: (data) => {
        this.subscriptions = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Error loading subscriptions';
        this.loading = false;
      }
    });
  }

  formatDate(date: Date | undefined): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  onCancel(id: string): void {
    if (!id) return;
    if (confirm('Cancel this subscription?')) {
      this.cancelInProgress[id] = true;
      this.subscriptionService.cancelSubscription(id).subscribe({
        next: () => {
          this.loadSubscriptions(); // reload the list
          delete this.cancelInProgress[id];
        },
        error: (err) => {
          this.error = err?.error?.message || 'Error canceling subscription';
          delete this.cancelInProgress[id];
        }
      });
    }
  }
}
