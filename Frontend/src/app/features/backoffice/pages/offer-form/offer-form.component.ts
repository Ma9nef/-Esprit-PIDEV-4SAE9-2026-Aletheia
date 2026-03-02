import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { OfferService } from '../../../../core/services/offer.service';
import { OfferRequestDTO, OfferType } from '../../../../core/models/offer.model';

@Component({
  selector: 'app-offer-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="offer-form-page">
      <div class="form-card">
        <h1 class="form-title">{{ isEdit ? 'Edit Offer' : 'New Offer' }}</h1>
        <p class="form-description">Fill in the required fields (*). Dates must be consistent.</p>

        <div *ngIf="successMessage" class="message-success" role="alert">{{ successMessage }}</div>
        <div *ngIf="error" class="message-error" role="alert">{{ error }}</div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label class="form-label" for="offer-name">Name *</label>
            <input id="offer-name" formControlName="name" type="text" class="form-input" placeholder="e.g: Summer Sale" />
            <p *ngIf="getErrorMessage('name')" class="field-error">{{ getErrorMessage('name') }}</p>
          </div>
          <div class="form-group">
            <label class="form-label" for="offer-desc">Description *</label>
            <textarea id="offer-desc" formControlName="description" rows="3" class="form-textarea" placeholder="Describe the offer"></textarea>
            <p *ngIf="getErrorMessage('description')" class="field-error">{{ getErrorMessage('description') }}</p>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="offer-type">Type *</label>
              <select id="offer-type" formControlName="type" class="form-select">
                <option value="PERCENTAGE">Percentage</option>
                <option value="FIXED_AMOUNT">Fixed amount</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label" for="offer-value">Value *</label>
              <input id="offer-value" formControlName="value" type="number" step="0.01" class="form-input" min="0" />
              <p *ngIf="getErrorMessage('value')" class="field-error">{{ getErrorMessage('value') }}</p>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="offer-start">Start Date *</label>
              <input id="offer-start" formControlName="startDate" type="datetime-local" class="form-input" />
              <p *ngIf="getErrorMessage('startDate')" class="field-error">{{ getErrorMessage('startDate') }}</p>
            </div>
            <div class="form-group">
              <label class="form-label" for="offer-end">End Date *</label>
              <input id="offer-end" formControlName="endDate" type="datetime-local" class="form-input" />
              <p *ngIf="getErrorMessage('endDate')" class="field-error">{{ getErrorMessage('endDate') }}</p>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="offer-max">Max uses</label>
              <input id="offer-max" formControlName="maxUses" type="number" class="form-input" min="0" placeholder="Unlimited" />
              <p *ngIf="getErrorMessage('maxUses')" class="field-error">{{ getErrorMessage('maxUses') }}</p>
            </div>
            <div class="form-group">
              <label class="form-label" for="offer-max-user">Max per user</label>
              <input id="offer-max-user" formControlName="maxUsesPerUser" type="number" class="form-input" min="0" placeholder="Unlimited" />
              <p *ngIf="getErrorMessage('maxUsesPerUser')" class="field-error">{{ getErrorMessage('maxUsesPerUser') }}</p>
            </div>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn-primary" [disabled]="form.invalid || saving">
              {{ saving ? 'Saving...' : 'Save' }}
            </button>
            <a routerLink="/admin/offers" class="btn-cancel">Cancel</a>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .offer-form-page { max-width: 640px; }
    .form-card { padding: 1.5rem 2rem; border-radius: 12px; border: 1px solid rgba(99, 102, 241, 0.2); box-shadow: 0 4px 24px rgba(15, 23, 42, 0.08); }
    .form-group { margin-bottom: 1.25rem; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
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
export class OfferFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  offerId = '';
  saving = false;
  error = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private offerService: OfferService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'] || '';
    this.isEdit = !!id && id !== 'new';
    this.offerId = this.isEdit ? id : '';

    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(500)]],
      type: [OfferType.PERCENTAGE, Validators.required],
      value: [10, [Validators.required, Validators.min(0), Validators.max(99999)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      maxUses: [null as number | null, [Validators.min(0)]],
      maxUsesPerUser: [null as number | null, [Validators.min(0)]]
    });

    if (this.isEdit) {
      this.offerService.getOfferById(this.offerId).subscribe({
        next: (o) => {
          this.form.patchValue({
            name: o.name,
            description: o.description,
            type: o.type,
            value: o.value,
            startDate: this.toDateTimeLocal(o.startDate),
            endDate: this.toDateTimeLocal(o.endDate),
            maxUses: o.maxUses ?? null,
            maxUsesPerUser: o.maxUsesPerUser ?? null
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
    return 'Invalid value.';
  }

  toDateTimeLocal(d: Date | string): string {
    const date = new Date(d);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  fromDateTimeLocal(s: string): Date {
    return new Date(s);
  }

  onSubmit(): void {
    if (this.form.invalid || this.saving) return;
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.saving = true;
    this.error = '';
    this.successMessage = '';

    const v = this.form.value;
    const dto: OfferRequestDTO = {
      name: v.name,
      description: v.description,
      type: v.type,
      value: +v.value,
      startDate: this.fromDateTimeLocal(v.startDate),
      endDate: this.fromDateTimeLocal(v.endDate),
      maxUses: v.maxUses ? +v.maxUses : undefined,
      maxUsesPerUser: v.maxUsesPerUser ? +v.maxUsesPerUser : undefined
    };

    const req = this.isEdit
      ? this.offerService.updateOffer(this.offerId, dto)
      : this.offerService.createOffer(dto);

    req.subscribe({
      next: () => {
        this.successMessage = this.isEdit ? 'Offer updated successfully.' : 'Offer created successfully.';
        this.saving = false;
        setTimeout(() => this.router.navigate(['/admin/offers']), 1500);
      },
      error: (e) => {
        this.error = e?.error?.message || 'Error saving offer.';
        this.saving = false;
      }
    });
  }
}
