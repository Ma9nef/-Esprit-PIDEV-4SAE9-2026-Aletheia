import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FlashSaleService } from '../../../../core/services/flash-sale.service';
import { OfferService } from '../../../../core/services/offer.service';
import { FlashSale } from '../../../../core/models/flash-sale.model';
import { OfferResponseDTO } from '../../../../core/models/offer.model';

@Component({
  selector: 'app-flash-sale-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="flash-sale-form-page">
      <div class="form-card">
        <h1 class="form-title">{{ isEdit ? 'Modifier la Flash Sale' : 'Nouvelle Flash Sale' }}</h1>
        <p class="form-description">La date de début doit être dans le futur. Nombre max d'utilisateurs : 1 à 10 000.</p>

        <div *ngIf="successMessage" class="message-success" role="alert">{{ successMessage }}</div>
        <div *ngIf="error" class="message-error" role="alert">{{ error }}</div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label class="form-label" for="fs-name">Nom *</label>
            <input id="fs-name" formControlName="name" type="text" class="form-input" placeholder="Ex: Flash 24h" />
            <p *ngIf="getErrorMessage('name')" class="field-error">{{ getErrorMessage('name') }}</p>
          </div>
          <div class="form-group">
            <label class="form-label" for="fs-desc">Description *</label>
            <textarea id="fs-desc" formControlName="description" rows="3" class="form-textarea" placeholder="Description de la flash sale"></textarea>
            <p *ngIf="getErrorMessage('description')" class="field-error">{{ getErrorMessage('description') }}</p>
          </div>
          <div class="form-group">
            <label class="form-label" for="fs-offer">Offre associée *</label>
            <select id="fs-offer" formControlName="offerId" class="form-select">
              <option value="">-- Sélectionner une offre --</option>
              <option *ngFor="let o of offers" [value]="o.id">{{ o.name }}</option>
            </select>
            <p *ngIf="getErrorMessage('offerId')" class="field-error">{{ getErrorMessage('offerId') }}</p>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="fs-start">Début *</label>
              <input id="fs-start" formControlName="startTime" type="datetime-local" class="form-input" />
              <p *ngIf="getErrorMessage('startTime')" class="field-error">{{ getErrorMessage('startTime') }}</p>
            </div>
            <div class="form-group">
              <label class="form-label" for="fs-end">Fin *</label>
              <input id="fs-end" formControlName="endTime" type="datetime-local" class="form-input" />
              <p *ngIf="getErrorMessage('endTime')" class="field-error">{{ getErrorMessage('endTime') }}</p>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label" for="fs-max">Nombre max d'utilisateurs *</label>
            <input id="fs-max" formControlName="maxUsers" type="number" class="form-input" min="1" />
            <p *ngIf="getErrorMessage('maxUsers')" class="field-error">{{ getErrorMessage('maxUsers') }}</p>
          </div>
          <div class="form-group checkbox-wrap">
            <label>
              <input formControlName="isActive" type="checkbox" />
              Active
            </label>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn-primary" [disabled]="form.invalid || saving">
              {{ saving ? 'Enregistrement...' : 'Enregistrer' }}
            </button>
            <a routerLink="/admin/flash-sales" class="btn-cancel">Annuler</a>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .flash-sale-form-page { max-width: 640px; }
    .form-card { padding: 1.5rem 2rem; border-radius: 12px; border: 1px solid rgba(99, 102, 241, 0.2); box-shadow: 0 4px 24px rgba(15, 23, 42, 0.08); }
    .form-group { margin-bottom: 1.25rem; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
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
export class FlashSaleFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  flashSaleId = '';
  offers: OfferResponseDTO[] = [];
  saving = false;
  error = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private flashSaleService: FlashSaleService,
    private offerService: OfferService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'] || '';
    this.isEdit = !!id && id !== 'new';
    this.flashSaleId = this.isEdit ? id : '';

    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      offerId: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      maxUsers: [100, [Validators.required, Validators.min(1), Validators.max(10000)]],
      isActive: [true]
    });

    this.offerService.getAllOffers().subscribe(o => this.offers = o);

    if (this.isEdit) {
      this.flashSaleService.getFlashSaleById(this.flashSaleId).subscribe({
        next: (fs) => {
          this.form.patchValue({
            name: fs.name,
            description: fs.description,
            offerId: fs.offerId,
            startTime: this.toDateTimeLocal(fs.startTime),
            endTime: this.toDateTimeLocal(fs.endTime),
            maxUsers: fs.maxUsers,
            isActive: fs.isActive ?? true
          });
        }
      });
    }
  }

  getErrorMessage(controlName: string): string {
    const c = this.form.get(controlName);
    if (!c?.touched || !c.errors) return '';
    const err = c.errors;
    if (err['required']) return 'Champ obligatoire.';
    if (err['minlength']) return `Minimum ${err['minlength'].requiredLength} caractères.`;
    if (err['maxlength']) return `Maximum ${err['maxlength'].requiredLength} caractères.`;
    if (err['min']) return `La valeur minimale est ${err['min'].min}.`;
    if (err['max']) return `La valeur maximale est ${err['max'].max}.`;
    return 'Valeur invalide.';
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
      name: v.name,
      description: v.description,
      offerId: v.offerId,
      startTime: this.toBackendDateTime(v.startTime),
      endTime: this.toBackendDateTime(v.endTime),
      maxUsers: +v.maxUsers,
      currentUsers: 0,
      isActive: v.isActive ?? true
    };

    const req = this.isEdit
      ? this.flashSaleService.updateFlashSale(this.flashSaleId, body as unknown as Partial<FlashSale>)
      : this.flashSaleService.createFlashSale(body as unknown as Partial<FlashSale>);

    req.subscribe({
      next: () => {
        this.successMessage = this.isEdit ? 'Flash Sale mise à jour avec succès.' : 'Flash Sale créée avec succès.';
        this.saving = false;
        setTimeout(() => this.router.navigate(['/admin/flash-sales']), 1500);
      },
      error: (e) => {
        this.error = e?.error?.message || 'Erreur lors de l\'enregistrement.';
        this.saving = false;
      }
    });
  }
}
