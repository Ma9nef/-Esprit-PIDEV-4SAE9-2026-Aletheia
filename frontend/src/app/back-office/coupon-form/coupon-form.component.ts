import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CouponService } from '../../core/services/coupon.service';
import { OfferService } from '../../core/services/offer.service';
import { OfferResponseDTO } from '../../core/models/offer.model';

const CODE_PATTERN = /^[A-Za-z0-9_-]+$/;

@Component({
  selector: 'app-coupon-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="coupon-form-page">
      <div class="form-card">
        <h1 class="form-title">{{ isEdit ? 'Edit Coupon' : 'New Coupon' }}</h1>
        <p class="form-description">Code: letters, numbers, hyphens and underscores only. Choose an existing offer.</p>

        <div *ngIf="successMessage" class="message-success" role="alert">{{ successMessage }}</div>
        <div *ngIf="error" class="message-error" role="alert">{{ error }}</div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label class="form-label" for="coupon-code">Code *</label>
            <input id="coupon-code" formControlName="code" type="text" class="form-input" placeholder="e.g: PROMO20" [readonly]="isEdit" />
            <p *ngIf="getErrorMessage('code')" class="field-error">{{ getErrorMessage('code') }}</p>
          </div>
          <div class="form-group">
            <label class="form-label" for="coupon-offer">Associated Offer *</label>
            <select id="coupon-offer" formControlName="offerId" class="form-select">
              <option value="">-- Select an offer --</option>
              <option *ngFor="let o of offers" [value]="o.id">{{ o.name }}</option>
            </select>
            <p *ngIf="getErrorMessage('offerId')" class="field-error">{{ getErrorMessage('offerId') }}</p>
          </div>
          <div class="form-group">
            <label class="form-label" for="coupon-desc">Description *</label>
            <textarea id="coupon-desc" formControlName="description" rows="2" class="form-textarea" placeholder="Coupon description"></textarea>
            <p *ngIf="getErrorMessage('description')" class="field-error">{{ getErrorMessage('description') }}</p>
          </div>
          <div class="form-group checkbox-wrap">
            <label>
              <input formControlName="isUnique" type="checkbox" />
              Unique code (single use)
            </label>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="coupon-from">Valid from *</label>
              <input id="coupon-from" formControlName="validFrom" type="datetime-local" class="form-input" />
              <p *ngIf="getErrorMessage('validFrom')" class="field-error">{{ getErrorMessage('validFrom') }}</p>
            </div>
            <div class="form-group">
              <label class="form-label" for="coupon-until">Valid until *</label>
              <input id="coupon-until" formControlName="validUntil" type="datetime-local" class="form-input" />
              <p *ngIf="getErrorMessage('validUntil')" class="field-error">{{ getErrorMessage('validUntil') }}</p>
            </div>
          </div>
          <div class="form-group" *ngIf="!form.get('isUnique')?.value">
            <label class="form-label" for="coupon-max">Max uses</label>
            <input id="coupon-max" formControlName="maxUses" type="number" class="form-input" min="1" />
            <p *ngIf="getErrorMessage('maxUses')" class="field-error">{{ getErrorMessage('maxUses') }}</p>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn-primary" [disabled]="form.invalid || saving">
              {{ saving ? 'Saving...' : 'Save' }}
            </button>
            <a routerLink="/back-office/admin/coupons" class="btn-cancel">Cancel</a>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .coupon-form-page { max-width: 640px; }
    .form-card { padding: 1.5rem 2rem; border-radius: 12px; border: 1px solid rgba(99, 102, 241, 0.2); box-shadow: 0 4px 24px rgba(15, 23, 42, 0.08); }
    .form-group { margin-bottom: 1.25rem; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .checkbox-wrap { display: flex; align-items: center; }
    .checkbox-wrap label { display: flex; align-items: center; gap: 0.5rem; cursor: pointer; }
    .form-actions { display: flex; gap: 0.75rem; margin-top: 1.5rem; flex-wrap: wrap; }
    .btn-primary {
      padding: 0.6rem 1.25rem;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: #fff;
      border: none;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
    }
    .btn-primary:hover:not(:disabled) { opacity: 0.95; }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
    .btn-cancel { padding: 0.6rem 1.25rem; color: #64748b; text-decoration: none; border-radius: 8px; }
    .btn-cancel:hover { color: #6366f1; }
  `]
})
export class CouponFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  couponId = '';
  offers: OfferResponseDTO[] = [];
  saving = false;
  error = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private couponService: CouponService,
    private offerService: OfferService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'] || '';
    this.isEdit = !!id && id !== 'new';
    this.couponId = this.isEdit ? id : '';

    this.form = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern(CODE_PATTERN)]],
      offerId: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      isUnique: [false],
      validFrom: ['', Validators.required],
      validUntil: ['', Validators.required],
      maxUses: [1, [Validators.min(1), Validators.max(999999)]]
    });

    this.offerService.getAllOffers().subscribe(o => this.offers = o);

    if (this.isEdit) {
      this.couponService.getCouponById(this.couponId).subscribe({
        next: (c) => {
          this.form.patchValue({
            code: c.code,
            offerId: c.offerId,
            description: c.description,
            isUnique: c.isUnique ?? false,
            validFrom: this.toDateTimeLocal(c.validFrom),
            validUntil: this.toDateTimeLocal(c.validUntil),
            maxUses: c.maxUses ?? 1
          });
        }
      });
    }
  }

  getErrorMessage(controlName: string): string {
    const c = this.form.get(controlName);
    if (!c?.touched || !c.errors) return '';
    const err = c.errors;
    if (err['required']) return 'This field is required.';
    if (err['minlength']) return `Minimum ${err['minlength'].requiredLength} characters.`;
    if (err['maxlength']) return `Maximum ${err['maxlength'].requiredLength} characters.`;
    if (err['min']) return `Minimum value is ${err['min'].min}.`;
    if (err['max']) return `Maximum value is ${err['max'].max}.`;
    if (err['pattern']) return 'Letters, numbers, hyphens and underscores only.';
    return 'Invalid value.';
  }

  toDateTimeLocal(d: Date | string): string {
    const date = new Date(d);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  toBackendDateTime(s: string): string {
    if (!s) return s;
    return s.length === 16 ? `${s}:00` : s;
  }

  onSubmit(): void {
    if (this.form.invalid || this.saving) return;
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.saving = true;
    this.error = '';
    this.successMessage = '';

    const v = this.form.value;
    const body = {
      code: v.code.trim(),
      offerId: v.offerId,
      description: v.description.trim(),
      isUnique: v.isUnique ?? false,
      validFrom: this.toBackendDateTime(v.validFrom),
      validUntil: this.toBackendDateTime(v.validUntil),
      maxUses: v.maxUses ? +v.maxUses : null
    };

    const req = this.isEdit
      ? this.couponService.updateCoupon(this.couponId, body)
      : this.couponService.createCoupon(body);

    req.subscribe({
      next: () => {
        this.successMessage = this.isEdit ? 'Coupon updated successfully.' : 'Coupon created successfully.';
        this.saving = false;
        setTimeout(() => this.router.navigate(['/admin/coupons']), 1500);
      },
      error: (e) => {
        this.error = e?.error?.message || 'Error saving coupon.';
        this.saving = false;
      }
    });
  }
}
