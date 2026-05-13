import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SubscriptionPlanService } from '../../core/services/subscription-plan.service';
import { SubscriptionPlanResponse } from '../../core/models/subscription-plan.model';

@Component({
  selector: 'app-admin-subscription-plans',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="admin-plans">
      <div class="page-header">
        <h1>Subscription Plans Management</h1>
        <a routerLink="/back-office/admin/subscription-plans/new" class="btn-primary">+ New Plan</a>
      </div>

      <p *ngIf="loading">Loading...</p>

      <div class="table-container" *ngIf="!loading && plans.length > 0">
        <table class="data-table">
          <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Duration (days)</th>
            <th>Max Courses</th>
            <th>Certification</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr *ngFor="let plan of plans">
            <td>{{ plan.name }}</td>
            <td>{{ plan.description || '-' }}</td>
            <td>{{ plan.price | currency:'EUR' }}</td>
            <td>{{ plan.durationDays }}</td>
            <td>{{ plan.maxCourses ?? 'Unlimited' }}</td>
            <td>
                <span class="badge" [class.badge-success]="plan.certificationIncluded" [class.badge-secondary]="!plan.certificationIncluded">
                  {{ plan.certificationIncluded ? 'Yes' : 'No' }}
                </span>
            </td>
            <td>
                <span class="badge" [class.badge-success]="plan.isActive" [class.badge-danger]="!plan.isActive">
                  {{ plan.isActive ? 'Active' : 'Inactive' }}
                </span>
            </td>
            <td>
              <a [routerLink]="['/back-office/admin/subscription-plans/edit', plan.planId]" class="btn-edit">Edit</a>
              <button (click)="onToggleStatus(plan)" class="btn-toggle" [class.btn-activate]="!plan.isActive" [class.btn-deactivate]="plan.isActive">
                {{ plan.isActive ? 'Deactivate' : 'Activate' }}
              </button>
              <button (click)="onDelete(plan.planId)" class="btn-delete">Delete</button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <p *ngIf="!loading && plans.length === 0" class="empty">No plans found.</p>
      <p *ngIf="error" class="error">{{ error }}</p>
    </div>
  `,
  styles: [`
    .admin-plans { max-width: 100%; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .btn-primary {
      padding: 0.5rem 1rem;
      background: #3182ce;
      color: #fff;
      border-radius: 6px;
      text-decoration: none;
    }
    .btn-primary:hover { background: #2c5282; }
    .table-container { overflow-x: auto; }
    .data-table { width: 100%; border-collapse: collapse; }
    .data-table th, .data-table td { padding: 0.75rem; text-align: left; border-bottom: 1px solid #e2e8f0; }
    .data-table th { background: #edf2f7; }
    .badge {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.85rem;
      font-weight: 500;
    }
    .badge-success { background: #c6f6d5; color: #22543d; }
    .badge-danger { background: #fed7d7; color: #742a2a; }
    .badge-secondary { background: #e2e8f0; color: #2d3748; }
    .btn-edit { margin-right: 0.5rem; color: #3182ce; text-decoration: none; }
    .btn-edit:hover { text-decoration: underline; }
    .btn-toggle {
      margin-right: 0.5rem;
      padding: 0.25rem 0.5rem;
      border: 1px solid;
      border-radius: 4px;
      background: #fff;
      cursor: pointer;
    }
    .btn-deactivate { border-color: #e53e3e; color: #e53e3e; }
    .btn-deactivate:hover { background: #fff5f5; }
    .btn-activate { border-color: #38a169; color: #38a169; }
    .btn-activate:hover { background: #f0fff4; }
    .btn-delete {
      padding: 0.25rem 0.5rem;
      color: #e53e3e;
      border: 1px solid #e53e3e;
      background: #fff;
      border-radius: 4px;
      cursor: pointer;
    }
    .btn-delete:hover { background: #fff5f5; }
    .empty, .error { padding: 1rem; }
    .error { color: #e53e3e; }
  `]
})
export class AdminSubscriptionPlansComponent implements OnInit {
  plans: SubscriptionPlanResponse[] = [];
  loading = true;
  error = '';

  constructor(
    private planService: SubscriptionPlanService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadPlans();
  }

  loadPlans(): void {
    this.loading = true;
    this.planService.getAllPlans().subscribe({
      next: (data) => {
        this.plans = data;
        this.loading = false;
        this.cdr.detectChanges(); // FORCER LA MISE À JOUR
      },
      error: (err) => {
        this.error = err?.error?.message || 'Error loading plans';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onToggleStatus(plan: SubscriptionPlanResponse): void {
    const action = plan.isActive ? 'deactivate' : 'activate';
    if (confirm(`Do you want to ${action} the plan "${plan.name}"?`)) {
      this.planService.togglePlanStatus(plan.planId).subscribe({
        next: (updated) => {
          // Update locally to avoid a full reload
          plan.isActive = updated.isActive;
        },
        error: (err) => {
          this.error = err?.error?.message || 'Error updating plan status';
        }
      });
    }
  }

  onDelete(id: string): void {
    if (confirm('Permanently delete this plan? This action is irreversible.')) {
      this.planService.deletePlan(id).subscribe({
        next: () => this.loadPlans(),
        error: (err) => this.error = err?.error?.message || 'Error deleting plan'
      });
    }
  }
}
