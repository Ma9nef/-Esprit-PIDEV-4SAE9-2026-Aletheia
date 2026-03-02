import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SubscriptionPlanService } from '../../../../core/services/subscription-plan.service';
import { SubscriptionPlanResponse } from '../../../../core/models/subscription-plan.model';

@Component({
  selector: 'app-subscription-plans-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="plans-container">
      <h1>Our Subscription Plans</h1>
      <p *ngIf="loading">Loading plans...</p>
      <p *ngIf="error" class="error">{{ error }}</p>

      <div class="plans-grid" *ngIf="!loading && plans.length > 0">
        <div class="plan-card" *ngFor="let plan of plans">
          <h2>{{ plan.name }}</h2>
          <p class="description">{{ plan.description || 'No description' }}</p>
          <p class="price">{{ plan.price | currency:'EUR' }}</p>
          <p class="duration">{{ plan.durationDays }} days</p>
          <p *ngIf="plan.maxCourses" class="feature">📚 {{ plan.maxCourses }} courses max</p>
          <p *ngIf="!plan.maxCourses" class="feature">📚 Unlimited courses</p>
          <p class="feature">🎓 Certification included? {{ plan.certificationIncluded ? 'Yes' : 'No' }}</p>
          <a [routerLink]="['/checkout', plan.planId]" class="btn-subscribe">Choose this plan</a>
        </div>
      </div>

      <p *ngIf="!loading && plans.length === 0" class="empty">No plans available at the moment.</p>
    </div>
  `,
  styles: [`
    .plans-container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
    h1 { text-align: center; margin-bottom: 2rem; }
    .plans-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
    .plan-card {
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 1.5rem;
      text-align: center;
      background: #fff;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .plan-card h2 { margin-top: 0; color: #2d3748; }
    .description { color: #718096; min-height: 60px; }
    .price { font-size: 2rem; font-weight: bold; color: #3182ce; margin: 0.5rem 0; }
    .duration { color: #4a5568; margin-bottom: 1rem; }
    .feature { margin: 0.25rem 0; }
    .btn-subscribe {
      display: inline-block;
      margin-top: 1.5rem;
      padding: 0.75rem 1.5rem;
      background: #3182ce;
      color: #fff;
      text-decoration: none;
      border-radius: 6px;
      transition: background 0.2s;
    }
    .btn-subscribe:hover { background: #2c5282; }
    .error { color: #e53e3e; text-align: center; }
    .empty { text-align: center; color: #718096; }
  `]
})
export class SubscriptionPlansListComponent implements OnInit {
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
    this.planService.getActivePlans().subscribe({
      next: (data) => {
        this.plans = data;
        this.loading = false;
        this.cdr.detectChanges(); // Force template update
      },
      error: (err) => {
        this.error = err?.error?.message || 'Error loading plans';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
