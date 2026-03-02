import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CouponService } from '../../../../core/services/coupon.service';
import { Coupon, CouponHelper } from '../../../../core/models/coupon.model';

@Component({
  selector: 'app-admin-coupons',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="admin-coupons">
      <div class="page-header">
        <h1>Coupon Management</h1>
        <a routerLink="/admin/coupons/new" class="btn-primary">+ New Coupon</a>
      </div>

      <p *ngIf="loading">Loading...</p>
      <div class="table-container" *ngIf="!loading && coupons.length > 0">
        <table class="data-table">
          <thead>
          <tr>
            <th>Code</th>
            <th>Offer</th>
            <th>Type</th>
            <th>Validity</th>
            <th>Status</th>
            <th>Remaining</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr *ngFor="let c of coupons">
            <td><code>{{ c.code }}</code></td>
            <td>{{ c.offerId }}</td>
            <td>{{ c.isUnique ? 'Unique' : 'Shared' }}</td>
            <td>{{ formatDate(c.validFrom) }} - {{ formatDate(c.validUntil) }}</td>
            <td><span [class]="'status-' + getStatus(c).class">{{ getStatus(c).text }}</span></td>
            <td>{{ getRemaining(c) }}</td>
            <td>
              <a [routerLink]="['/admin/coupons', c.id]" class="btn-edit">Edit</a>
              <button (click)="onDelete(c.id)" class="btn-delete">Delete</button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
      <p *ngIf="!loading && coupons.length === 0" class="empty">No coupons found.</p>
      <p *ngIf="error" class="error">{{ error }}</p>
    </div>
  `,
  styles: [`
    .admin-coupons { max-width: 100%; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .btn-primary {
      padding: 0.5rem 1rem;
      background: #3182ce;
      color: #fff;
      border-radius: 6px;
      text-decoration: none;
    }
    .table-container { overflow-x: auto; }
    .data-table { width: 100%; border-collapse: collapse; }
    .data-table th, .data-table td { padding: 0.75rem; text-align: left; border-bottom: 1px solid #e2e8f0; }
    .data-table th { background: #edf2f7; }
    code { background: #edf2f7; padding: 0.2rem 0.4rem; border-radius: 4px; font-size: 0.9em; }
    .status-active { color: #38a169; }
    .status-expired { color: #e53e3e; }
    .btn-edit { margin-right: 0.5rem; color: #3182ce; }
    .btn-delete { padding: 0.25rem 0.5rem; color: #e53e3e; border: 1px solid #e53e3e; background: #fff; border-radius: 4px; cursor: pointer; }
    .btn-delete:hover { background: #fff5f5; }
    .empty, .error { padding: 1rem; }
    .error { color: #e53e3e; }
  `]
})
export class AdminCouponsComponent implements OnInit {
  coupons: Coupon[] = [];
  loading = true;
  error = '';

  constructor(private couponService: CouponService) {}

  ngOnInit(): void {
    this.loadCoupons();
  }

  loadCoupons(): void {
    this.loading = true;
    this.couponService.getAllCoupons().subscribe({
      next: (c) => {
        this.coupons = c;
        this.loading = false;
      },
      error: (e) => {
        this.error = e?.error?.message || 'Error loading coupons';
        this.loading = false;
      }
    });
  }

  getStatus(c: Coupon) {
    return CouponHelper.getDisplayStatus(c);
  }

  getRemaining(c: Coupon) {
    return CouponHelper.getRemainingUses(c);
  }

  formatDate(d: Date): string {
    return new Date(d).toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  onDelete(id: string): void {
    if (confirm('Delete this coupon?')) {
      this.couponService.deleteCoupon(id).subscribe({
        next: () => this.loadCoupons(),
        error: (e) => this.error = e?.error?.message || 'Error deleting coupon'
      });
    }
  }
}
