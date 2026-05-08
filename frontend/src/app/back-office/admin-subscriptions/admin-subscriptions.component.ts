import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Gardez UNE SEULE version de ces imports selon le bon chemin dans votre projet
import { SubscriptionService } from '../../core/services/subscription.service';
import {
  SubscriptionPaymentHistory,
  SubscriptionResponse
} from '../../core/models/subscription.model';

@Component({
  selector: 'app-admin-subscriptions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-subscriptions">
      <div class="page-header">
        <div>
          <h1>Subscription Plan History</h1>
          <p class="page-subtitle">
            Complete backoffice tracking for subscription lifecycle, plan details, and Stripe payment activity.
          </p>
        </div>
        <button
          type="button"
          class="btn-refresh"
          (click)="refreshAll()"
          [disabled]="loading || paymentsLoading"
        >
          Refresh
        </button>
      </div>

      <section class="metrics-grid">
        <article class="metric-card">
          <span class="metric-label">Total subscriptions</span>
          <strong class="metric-value">{{ filteredSubscriptions.length }}</strong>
        </article>
        <article class="metric-card">
          <span class="metric-label">Active</span>
          <strong class="metric-value">{{ activeSubscriptionsCount }}</strong>
        </article>
        <article class="metric-card">
          <span class="metric-label">Expiring soon</span>
          <strong class="metric-value">{{ expiringSoonCount }}</strong>
        </article>
        <article class="metric-card">
          <span class="metric-label">Successful payments</span>
          <strong class="metric-value">{{ successfulPaymentsCount }}</strong>
        </article>
        <article class="metric-card">
          <span class="metric-label">Revenue</span>
          <strong class="metric-value">{{ totalRevenue | number:'1.2-2' }} EUR</strong>
        </article>
        <article class="metric-card">
          <span class="metric-label">Pending payments</span>
          <strong class="metric-value">{{ pendingPaymentsCount }}</strong>
        </article>
      </section>

      <section class="panel">
        <div class="section-header">
          <div>
            <h2>Subscription History</h2>
            <p class="section-description">
              Track each subscription from creation to expiration or cancellation.
            </p>
          </div>
        </div>

        <div class="toolbar">
          <input
            type="text"
            class="toolbar-input"
            [(ngModel)]="subscriptionSearch"
            placeholder="Search by user, subscription number, or plan"
          />
          <select class="toolbar-select" [(ngModel)]="subscriptionStatusFilter">
            <option value="ALL">All statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="PENDING">Pending</option>
            <option value="EXPIRED">Expired</option>
            <option value="CANCELED">Canceled</option>
          </select>
        </div>

        <p *ngIf="loading">Loading subscriptions...</p>

        <div class="table-container" *ngIf="!loading && filteredSubscriptions.length > 0">
          <table class="data-table">
            <thead>
              <tr>
                <th>Created</th>
                <th>User ID</th>
                <th>Subscription #</th>
                <th>Plan</th>
                <th>Cycle</th>
                <th>Price</th>
                <th>Days Left</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let sub of filteredSubscriptions; trackBy: trackBySubscription">
                <td>{{ formatDateTime(sub.createdAt) }}</td>
                <td>{{ sub.userId }}</td>
                <td><code>{{ sub.subscriptionNumber }}</code></td>
                <td>
                  <div class="cell-title">{{ sub.planName || 'Unknown plan' }}</div>
                  <div class="cell-subtitle">{{ sub.planDescription || 'No description' }}</div>
                  <div class="cell-subtitle">Plan ID: <code>{{ sub.planId || '-' }}</code></div>
                </td>
                <td>
                  <div>{{ sub.durationDays || 0 }} days</div>
                  <div class="cell-subtitle">Courses: {{ sub.maxCourses ?? 'Unlimited' }}</div>
                  <div class="cell-subtitle">
                    Certification: {{ sub.certificationIncluded ? 'Yes' : 'No' }}
                  </div>
                </td>
                <td>{{ (sub.planPrice || 0) | number:'1.2-2' }} EUR</td>
                <td>{{ formatDaysRemaining(sub.daysRemaining, sub.status) }}</td>
                <td>{{ formatDate(sub.startDate) }}</td>
                <td>{{ formatDate(sub.endDate) }}</td>
                <td>
                  <span class="badge" [ngClass]="statusClass(sub.status)">
                    {{ sub.status }}
                  </span>
                  <div class="cell-subtitle">Updated: {{ formatDateTime(sub.updatedAt) }}</div>
                </td>
                <td>
                  <button
                    *ngIf="sub.status === 'ACTIVE' && sub.subscriptionId"
                    (click)="onCancel(sub.subscriptionId)"
                    class="btn-cancel"
                    [disabled]="cancelInProgress[sub.subscriptionId]"
                  >
                    {{ cancelInProgress[sub.subscriptionId] ? 'Canceling...' : 'Cancel' }}
                  </button>
                  <span *ngIf="sub.status !== 'ACTIVE'" class="text-muted">—</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p *ngIf="!loading && filteredSubscriptions.length === 0" class="empty">
          No subscriptions found for the selected filters.
        </p>
        <p *ngIf="error" class="error">{{ error }}</p>
      </section>

      <section class="panel">
        <div class="section-header">
          <div>
            <h2>Payment History</h2>
            <p class="section-description">
              Full payment trail for subscription plans, including pending and failed attempts.
            </p>
          </div>
        </div>

        <div class="toolbar">
          <input
            type="text"
            class="toolbar-input"
            [(ngModel)]="paymentSearch"
            placeholder="Search by user, plan, subscription, or reference"
          />
          <select class="toolbar-select" [(ngModel)]="paymentStatusFilter">
            <option value="ALL">All payment statuses</option>
            <option value="SUCCESS">Success</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
            <option value="CANCELED">Canceled</option>
          </select>
        </div>

        <p *ngIf="paymentsLoading">Loading payment history...</p>

        <div class="table-container" *ngIf="!paymentsLoading && filteredPayments.length > 0">
          <table class="data-table">
            <thead>
              <tr>
                <th>Created At</th>
                <th>User ID</th>
                <th>Plan</th>
                <th>Subscription</th>
                <th>Amount</th>
                <th>Provider</th>
                <th>Status</th>
                <th>Reference</th>
                <th>Paid At</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let payment of filteredPayments; trackBy: trackByPayment">
                <td>{{ formatDateTime(payment.createdAt) }}</td>
                <td>{{ payment.userId }}</td>
                <td>
                  <div class="cell-title">{{ payment.planName || 'Unknown plan' }}</div>
                  <div class="cell-subtitle">Plan ID: <code>{{ payment.planId || '-' }}</code></div>
                </td>
                <td>
                  <div>{{ payment.subscriptionNumber || '-' }}</div>
                  <div class="cell-subtitle">
                    Subscription ID: <code>{{ payment.subscriptionId || '-' }}</code>
                  </div>
                </td>
                <td>{{ (payment.amount || 0) | number:'1.2-2' }} {{ payment.currency || 'EUR' }}</td>
                <td>{{ payment.provider }}</td>
                <td>
                  <span class="badge" [ngClass]="statusClass(payment.status)">
                    {{ payment.status }}
                  </span>
                  <div class="cell-subtitle">Updated: {{ formatDateTime(payment.updatedAt) }}</div>
                </td>
                <td>
                  <span *ngIf="payment.transactionReference; else fallbackReference">
                    <code>{{ payment.transactionReference }}</code>
                  </span>
                  <ng-template #fallbackReference>
                    <span class="text-muted">
                      {{ payment.failureReason || 'Pending Stripe confirmation' }}
                    </span>
                  </ng-template>
                </td>
                <td>{{ formatDateTime(payment.paidAt) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p *ngIf="!paymentsLoading && filteredPayments.length === 0" class="empty">
          No payments found for the selected filters.
        </p>
        <p *ngIf="paymentsError" class="error">{{ paymentsError }}</p>
      </section>
    </div>
  `,
  styles: [`
    .admin-subscriptions { max-width: 100%; }
    .page-header {
      margin-bottom: 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1rem;
    }
    .page-header h1 { margin: 0 0 0.35rem; }
    .page-subtitle { margin: 0; color: #64748b; }
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    .metric-card {
      background: linear-gradient(180deg, #ffffff, #f8fafc);
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 1rem;
    }
    .metric-label {
      display: block;
      color: #64748b;
      font-size: 0.9rem;
      margin-bottom: 0.35rem;
    }
    .metric-value { font-size: 1.45rem; color: #0f172a; }
    .panel {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 1.25rem;
      margin-bottom: 1.5rem;
    }
    .section-header {
      margin-bottom: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1rem;
    }
    .section-header h2 { margin: 0; }
    .section-description { margin: 0.35rem 0 0; color: #64748b; }
    .toolbar { display: flex; gap: 0.75rem; margin-bottom: 1rem; flex-wrap: wrap; }
    .toolbar-input,
    .toolbar-select {
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 0.65rem 0.8rem;
      background: #fff;
      min-width: 220px;
    }
    .toolbar-input { flex: 1; }
    .btn-refresh {
      border: 1px solid #cbd5e1;
      background: #fff;
      border-radius: 8px;
      padding: 0.7rem 1rem;
      cursor: pointer;
      font-weight: 600;
    }
    .table-container { overflow-x: auto; }
    .data-table { width: 100%; border-collapse: collapse; }
    .data-table th,
    .data-table td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid #e2e8f0;
      vertical-align: top;
    }
    .data-table th { background: #edf2f7; }
    code {
      background: #edf2f7;
      padding: 0.2rem 0.4rem;
      border-radius: 4px;
      font-size: 0.9em;
    }
    .cell-title { font-weight: 600; color: #0f172a; }
    .cell-subtitle { color: #64748b; font-size: 0.85rem; margin-top: 0.2rem; }
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
    .empty,
    .error { padding: 1rem; }
    .error { color: #e53e3e; }
  `]
})
export class AdminSubscriptionsComponent implements OnInit {
  subscriptions: SubscriptionResponse[] = [];
  payments: SubscriptionPaymentHistory[] = [];
  loading = true;
  paymentsLoading = true;
  error = '';
  paymentsError = '';
  cancelInProgress: { [key: string]: boolean } = {};
  subscriptionSearch = '';
  subscriptionStatusFilter = 'ALL';
  paymentSearch = '';
  paymentStatusFilter = 'ALL';

  constructor(private subscriptionService: SubscriptionService) {}

  ngOnInit(): void {
    this.loadSubscriptions();
    this.loadPayments();
  }

  get filteredSubscriptions(): SubscriptionResponse[] {
    const search = this.subscriptionSearch.trim().toLowerCase();

    return this.subscriptions.filter((subscription) => {
      const matchesStatus =
        this.subscriptionStatusFilter === 'ALL' ||
        subscription.status === this.subscriptionStatusFilter;

      const matchesSearch =
        !search ||
        [
          subscription.userId,
          subscription.subscriptionNumber,
          subscription.planName,
          subscription.planId
        ].some((value) => (value || '').toLowerCase().includes(search));

      return matchesStatus && matchesSearch;
    });
  }

  get filteredPayments(): SubscriptionPaymentHistory[] {
    const search = this.paymentSearch.trim().toLowerCase();

    return this.payments.filter((payment) => {
      const matchesStatus =
        this.paymentStatusFilter === 'ALL' ||
        payment.status === this.paymentStatusFilter;

      const matchesSearch =
        !search ||
        [
          payment.userId,
          payment.planName,
          payment.planId,
          payment.subscriptionNumber,
          payment.transactionReference
        ].some((value) => (value || '').toLowerCase().includes(search));

      return matchesStatus && matchesSearch;
    });
  }

  get activeSubscriptionsCount(): number {
    return this.filteredSubscriptions.filter(
      (subscription) => subscription.status === 'ACTIVE'
    ).length;
  }

  get expiringSoonCount(): number {
    return this.filteredSubscriptions.filter(
      (subscription) =>
        subscription.status === 'ACTIVE' &&
        typeof subscription.daysRemaining === 'number' &&
        subscription.daysRemaining >= 0 &&
        subscription.daysRemaining <= 7
    ).length;
  }

  get successfulPaymentsCount(): number {
    return this.filteredPayments.filter((payment) => payment.status === 'SUCCESS').length;
  }

  get pendingPaymentsCount(): number {
    return this.filteredPayments.filter((payment) => payment.status === 'PENDING').length;
  }

  get totalRevenue(): number {
    return this.filteredPayments
      .filter((payment) => payment.status === 'SUCCESS')
      .reduce((total, payment) => total + (payment.amount || 0), 0);
  }

  loadSubscriptions(): void {
    this.loading = true;
    this.error = '';

    this.subscriptionService.getAllSubscriptions().subscribe({
      next: (data: SubscriptionResponse[]) => {
        this.subscriptions = data;
        this.loading = false;
      },
      error: (err: any) => {
        this.error = err?.error?.message || 'Error loading subscriptions';
        this.loading = false;
      }
    });
  }

  loadPayments(): void {
    this.paymentsLoading = true;
    this.paymentsError = '';

    this.subscriptionService.getPaymentHistory().subscribe({
      next: (data: SubscriptionPaymentHistory[]) => {
        this.payments = data;
        this.paymentsLoading = false;
      },
      error: (err: any) => {
        this.paymentsError = err?.error?.message || 'Error loading payment history';
        this.paymentsLoading = false;
      }
    });
  }

  refreshAll(): void {
    this.loadSubscriptions();
    this.loadPayments();
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return '-';

    return new Date(date).toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  formatDateTime(date: Date | string | undefined): string {
    if (!date) return '-';
    return new Date(date).toLocaleString('en-US');
  }

  formatDaysRemaining(daysRemaining: number | undefined, status: string | undefined): string {
    if (status === 'PENDING') return 'Awaiting activation';
    if (status === 'CANCELED') return 'Canceled';
    if (status === 'EXPIRED') return 'Expired';
    if (typeof daysRemaining !== 'number') return '-';
    if (daysRemaining < 0) return 'Expired';
    return `${daysRemaining} day(s)`;
  }

  statusClass(status: string | undefined): string {
    switch (status) {
      case 'ACTIVE':
      case 'SUCCESS':
        return 'badge-success';
      case 'EXPIRED':
      case 'FAILED':
        return 'badge-danger';
      case 'CANCELED':
        return 'badge-warning';
      default:
        return 'badge-secondary';
    }
  }

  trackBySubscription(index: number, subscription: SubscriptionResponse): string {
    return subscription.subscriptionId || subscription.subscriptionNumber || String(index);
  }

  trackByPayment(index: number, payment: SubscriptionPaymentHistory): string {
    return payment.paymentId || String(index);
  }

  onCancel(id: string): void {
    if (!id) return;

    if (confirm('Cancel this subscription?')) {
      this.cancelInProgress[id] = true;

      this.subscriptionService.cancelSubscription(id).subscribe({
        next: () => {
          this.loadSubscriptions();
          this.loadPayments();
          delete this.cancelInProgress[id];
        },
        error: (err: any) => {
          this.error = err?.error?.message || 'Error canceling subscription';
          delete this.cancelInProgress[id];
        }
      });
    }
  }
}
