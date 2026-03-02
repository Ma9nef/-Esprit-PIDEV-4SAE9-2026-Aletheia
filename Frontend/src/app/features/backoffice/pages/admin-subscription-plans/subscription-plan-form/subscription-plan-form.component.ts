import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SubscriptionPlanService } from '../../../../../core/services/subscription-plan.service';
import { SubscriptionPlanRequest, SubscriptionPlanResponse } from '../../../../../core/models/subscription-plan.model';

@Component({
  selector: 'app-subscription-plan-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="plan-form">
      <div class="page-header">
        <h1>{{ isEditMode ? 'Edit' : 'New' }} Subscription Plan</h1>
        <button class="btn-secondary" (click)="onCancel()">Back</button>
      </div>

      <p *ngIf="loading">Loading...</p>

      <form [formGroup]="planForm" (ngSubmit)="onSubmit()" *ngIf="!loading">
        <div class="form-group">
          <label for="name">Plan Name *</label>
          <input type="text" id="name" formControlName="name" class="form-control" [class.is-invalid]="planForm.get('name')?.invalid && planForm.get('name')?.touched">
          <div class="invalid-feedback" *ngIf="planForm.get('name')?.invalid && planForm.get('name')?.touched">Name is required</div>
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <textarea id="description" formControlName="description" rows="3" class="form-control"></textarea>
        </div>

        <div class="form-row">
          <div class="form-group col">
            <label for="price">Price (€) *</label>
            <input type="number" id="price" formControlName="price" step="0.01" class="form-control" [class.is-invalid]="planForm.get('price')?.invalid && planForm.get('price')?.touched">
            <div class="invalid-feedback" *ngIf="planForm.get('price')?.invalid && planForm.get('price')?.touched">Price must be a positive number</div>
          </div>

          <div class="form-group col">
            <label for="durationDays">Duration (days) *</label>
            <input type="number" id="durationDays" formControlName="durationDays" min="1" class="form-control" [class.is-invalid]="planForm.get('durationDays')?.invalid && planForm.get('durationDays')?.touched">
            <div class="invalid-feedback" *ngIf="planForm.get('durationDays')?.invalid && planForm.get('durationDays')?.touched">Duration must be at least 1 day</div>
          </div>
        </div>

        <div class="form-group">
          <label for="maxCourses">Max courses (leave empty for unlimited)</label>
          <input type="number" id="maxCourses" formControlName="maxCourses" min="0" class="form-control">
        </div>

        <div class="form-check">
          <input type="checkbox" id="certificationIncluded" formControlName="certificationIncluded" class="form-check-input">
          <label for="certificationIncluded" class="form-check-label">Certification included</label>
        </div>

        <div class="form-check">
          <input type="checkbox" id="isActive" formControlName="isActive" class="form-check-input">
          <label for="isActive" class="form-check-label">Active plan (visible to users)</label>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-primary" [disabled]="planForm.invalid || loading">
            {{ isEditMode ? 'Update' : 'Create' }}
          </button>
          <button type="button" class="btn-secondary" (click)="onCancel()">Cancel</button>
        </div>
      </form>

      <p *ngIf="error" class="error">{{ error }}</p>
    </div>
  `,
  styles: [`
    .plan-form { max-width: 600px; margin: 0 auto; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .btn-secondary {
      padding: 0.5rem 1rem;
      background: #e2e8f0;
      color: #2d3748;
      border: none;
      border-radius: 6px;
      cursor: pointer;
    }
    .btn-secondary:hover { background: #cbd5e0; }
    .btn-primary {
      padding: 0.5rem 1rem;
      background: #3182ce;
      color: #fff;
      border: none;
      border-radius: 6px;
      cursor: pointer;
    }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-primary:hover:not(:disabled) { background: #2c5282; }
    .form-group { margin-bottom: 1rem; }
    .form-row { display: flex; gap: 1rem; }
    .col { flex: 1; }
    label { display: block; margin-bottom: 0.25rem; font-weight: 500; }
    .form-control {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #cbd5e0;
      border-radius: 4px;
      box-sizing: border-box;
    }
    .form-control.is-invalid { border-color: #e53e3e; }
    .invalid-feedback { color: #e53e3e; font-size: 0.85rem; margin-top: 0.25rem; }
    .form-check { margin-bottom: 0.5rem; }
    .form-check-input { margin-right: 0.5rem; }
    .form-actions { margin-top: 2rem; display: flex; gap: 0.5rem; }
    .error { color: #e53e3e; margin-top: 1rem; }
  `]
})
export class SubscriptionPlanFormComponent implements OnInit {
  planForm: FormGroup;
  isEditMode = false;
  planId: string | null = null;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private planService: SubscriptionPlanService,
    private cdr: ChangeDetectorRef
  ) {
    this.planForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      durationDays: [30, [Validators.required, Validators.min(1)]],
      maxCourses: [null],
      certificationIncluded: [false],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    this.planId = this.route.snapshot.paramMap.get('id');
    if (this.planId) {
      this.isEditMode = true;
      this.loadPlan();
    }
  }

  loadPlan(): void {
    this.loading = true;
    this.planService.getPlanById(this.planId!).subscribe({
      next: (plan: SubscriptionPlanResponse) => {
        this.planForm.patchValue({
          name: plan.name,
          description: plan.description,
          price: plan.price,
          durationDays: plan.durationDays,
          maxCourses: plan.maxCourses,
          certificationIncluded: plan.certificationIncluded,
          isActive: plan.isActive
        });
        this.loading = false;
        this.cdr.detectChanges(); // Force update
      },
      error: (err: any) => {
        this.error = err?.error?.message || 'Error loading plan';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSubmit(): void {
    if (this.planForm.invalid) return;

    const request: SubscriptionPlanRequest = this.planForm.value;
    this.loading = true;

    const handleError = (err: any) => {
      console.error('Backend error:', err);
      let errorMessage = 'Unknown error';

      // If the response is JSON with a message field
      if (err.error && typeof err.error === 'object' && err.error.message) {
        errorMessage = err.error.message;
      }
      // If the response is text (HTML or plain text)
      else if (err.error && typeof err.error === 'string') {
        // Try to extract the exception message from HTML
        const match = err.error.match(/A plan with this name already exists/);
        if (match) {
          errorMessage = 'A plan with this name already exists';
        } else {
          // Otherwise, take a snippet of the HTML (limited)
          errorMessage = 'Server error: ' + err.error.substring(0, 100) + '...';
        }
      }
      // If the message is in err.message
      else if (err.message) {
        errorMessage = err.message;
      }

      this.error = errorMessage;
      this.loading = false;
    };

    if (this.isEditMode && this.planId) {
      this.planService.updatePlan(this.planId, request).subscribe({
        next: () => this.router.navigate(['/admin/subscription-plans']),
        error: handleError
      });
    } else {
      this.planService.createPlan(request).subscribe({
        next: () => this.router.navigate(['/admin/subscription-plans']),
        error: handleError
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/admin/subscription-plans']);
  }
}
