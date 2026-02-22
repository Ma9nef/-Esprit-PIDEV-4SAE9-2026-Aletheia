import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CouponService } from '../../../../core/services/coupon.service';
import { AppliedOfferDTO } from '../../../../core/models/offer.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="checkout-page">
      <header class="page-header">
        <h1 class="form-title">Finaliser votre achat</h1>
        <a routerLink="/offers" class="back-link">← Retour aux offres</a>
      </header>

      <div class="checkout-content form-card">
        <section class="order-summary">
          <h2 class="section-title">Récapitulatif</h2>
          <div class="summary-row">
            <span>Sous-total (formation)</span>
            <span>{{ originalPrice | number:'1.2-2' }} €</span>
          </div>
          <div class="promo-section">
            <label class="form-label">Code promo</label>
            <div class="promo-input-group">
              <input
                type="text"
                class="form-input"
                [(ngModel)]="promoCode"
                placeholder="Entrez votre code (ex: PROMO20)"
                [disabled]="!!appliedResult?.success"
                (keyup.enter)="applyPromo()"
              />
              <button
                type="button"
                class="btn-apply"
                (click)="applyPromo()"
                [disabled]="!promoCode.trim() || applying"
              >
                {{ applying ? 'Application...' : (appliedResult?.success ? 'Code appliqué' : 'Appliquer') }}
              </button>
            </div>
            <div *ngIf="promoError" class="message-error" role="alert">{{ promoError }}</div>
            <div *ngIf="appliedResult?.success" class="message-success" role="alert">
              Réduction de {{ (appliedResult?.totalDiscount ?? 0) | number:'1.2-2' }} € appliquée !
            </div>
          </div>
          <div class="summary-row total" *ngIf="appliedResult">
            <span>Prix final</span>
            <span class="final-price">{{ finalPrice | number:'1.2-2' }} €</span>
          </div>
        </section>

        <section class="checkout-actions">
          <p class="form-description">
            Utilisez un code promo créé depuis le backoffice. Test avec userId = "user1".
          </p>
          <button type="button" class="btn-pay" [disabled]="!appliedResult?.success" (click)="onPay()">
            Payer {{ finalPrice | number:'1.2-2' }} €
          </button>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .checkout-page { max-width: 600px; margin: 0 auto; padding: 2rem; }
    .page-header { margin-bottom: 2rem; }
    .back-link { color: #6366f1; text-decoration: none; font-size: 0.9rem; }
    .back-link:hover { text-decoration: underline; }
    .checkout-content { padding: 1.5rem 2rem; border-radius: 12px; border: 1px solid rgba(99, 102, 241, 0.2); box-shadow: 0 4px 24px rgba(15, 23, 42, 0.08); }
    .order-summary h2 { margin: 0 0 1rem 0; font-size: 1.1rem; }
    .summary-row { display: flex; justify-content: space-between; padding: 0.5rem 0; }
    .summary-row.total { border-top: 1px solid #e2e8f0; margin-top: 1rem; padding-top: 1rem; }
    .final-price { font-weight: bold; color: #16a34a; }
    .promo-section { margin: 1rem 0; }
    .promo-input-group { display: flex; gap: 0.5rem; }
    .promo-input-group .form-input { flex: 1; }
    .btn-apply {
      padding: 0.6rem 1.25rem;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: #fff;
      border: none;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
    }
    .btn-apply:hover:not(:disabled) { opacity: 0.95; }
    .btn-apply:disabled { opacity: 0.6; cursor: not-allowed; }
    .checkout-actions { margin-top: 1.5rem; }
    .btn-pay {
      width: 100%;
      padding: 0.75rem;
      background: linear-gradient(135deg, #16a34a, #15803d);
      color: #fff;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
    }
    .btn-pay:hover:not(:disabled) { opacity: 0.95; }
    .btn-pay:disabled { background: #94a3b8; cursor: not-allowed; opacity: 0.8; }
  `]
})
export class CheckoutComponent {
  promoCode = '';
  originalPrice = 99.99;
  appliedResult: AppliedOfferDTO | null = null;
  promoError = '';
  applying = false;

  private readonly testUserId = 'user1';

  constructor(private couponService: CouponService) {}

  get finalPrice(): number {
    return this.appliedResult?.success ? (this.appliedResult.finalPrice ?? this.originalPrice) : this.originalPrice;
  }

  applyPromo(): void {
    const code = this.promoCode?.trim() ?? '';
    if (!code || this.applying) return;
    this.applying = true;
    this.promoError = '';
    this.appliedResult = null;

    this.couponService.applyCoupon(
      code,
      this.originalPrice,
      this.testUserId
    ).subscribe({
      next: (result) => {
        this.appliedResult = result;
        if (!result.success && result.messages?.length) {
          this.promoError = result.messages.join(', ');
        }
        this.applying = false;
      },
      error: (err) => {
        this.promoError = err?.error?.message || 'Erreur lors de l\'application du code.';
        this.applying = false;
      }
    });
  }

  onPay(): void {
    if (!this.appliedResult?.success) return;
    alert('Paiement simulé avec succès. Merci pour votre achat !');
  }
}
