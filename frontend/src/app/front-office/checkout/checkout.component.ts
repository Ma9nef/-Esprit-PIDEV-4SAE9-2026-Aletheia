import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { CouponService } from '../../core/services/coupon.service';
import { AppliedOfferDTO } from '../../core/models/offer.model';
import { SubscriptionPlanResponse } from '../../core/models/subscription-plan.model';
import { SubscriptionPlanService } from '../../core/services/subscription-plan.service';
import { SubscriptionService } from '../../core/services/subscription.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="checkout-page">
      <header class="page-header">
        <h1 class="form-title">
          {{ isSubscriptionMode ? 'Complete Your Subscription' : 'Complete Your Purchase' }}
        </h1>
        <a [routerLink]="isSubscriptionMode ? '/plans' : '/offers'" class="back-link">
          ← Back to {{ isSubscriptionMode ? 'Plans' : 'Offers' }}
        </a>
      </header>

      <div class="checkout-content form-card" *ngIf="!isSubscriptionMode">
        <section class="order-summary">
          <h2 class="section-title">Order Summary</h2>

          <div class="summary-row">
            <span>Subtotal (training)</span>
            <span>{{ originalPrice | number:'1.2-2' }} €</span>
          </div>

          <div class="promo-section">
            <label class="form-label">Promo Code</label>
            <div class="promo-input-group">
              <input
                type="text"
                class="form-input"
                [(ngModel)]="promoCode"
                placeholder="Enter your code (e.g: PROMO20)"
                [disabled]="!!appliedResult?.success"
                (keyup.enter)="applyPromo()"
              />
              <button
                type="button"
                class="btn-apply"
                (click)="applyPromo()"
                [disabled]="!promoCode.trim() || applying"
              >
                {{ applying ? 'Applying...' : (appliedResult?.success ? 'Code applied' : 'Apply') }}
              </button>
            </div>

            <div *ngIf="promoError" class="message-error" role="alert">
              {{ promoError }}
            </div>

            <div *ngIf="appliedResult?.success" class="message-success" role="alert">
              Discount of {{ (appliedResult?.totalDiscount ?? 0) | number:'1.2-2' }} € applied!
            </div>
          </div>

          <div class="summary-row total" *ngIf="appliedResult">
            <span>Final Price</span>
            <span class="final-price">{{ finalPrice | number:'1.2-2' }} €</span>
          </div>
        </section>

        <section class="checkout-actions">
          <p class="form-description">
            Use a promo code created from the backoffice.
          </p>
          <button
            type="button"
            class="btn-pay"
            [disabled]="!appliedResult?.success"
            (click)="onPay()"
          >
            Pay {{ finalPrice | number:'1.2-2' }} €
          </button>
        </section>
      </div>

      <div class="checkout-content form-card" *ngIf="isSubscriptionMode">
        <p *ngIf="loadingPlan">Loading selected plan...</p>
        <p *ngIf="paymentError" class="message-error" role="alert">{{ paymentError }}</p>
        <p *ngIf="paymentSuccess" class="message-success" role="alert">{{ paymentSuccess }}</p>

        <ng-container *ngIf="!loadingPlan && selectedPlan">
          <section class="order-summary">
            <h2 class="section-title">Subscription Summary</h2>

            <div class="summary-row">
              <span>Plan</span>
              <span>{{ selectedPlan.name }}</span>
            </div>

            <div class="summary-row">
              <span>Duration</span>
              <span>{{ selectedPlan.durationDays }} days</span>
            </div>

            <div class="summary-row">
              <span>Courses</span>
              <span>{{ selectedPlan.maxCourses || 'Unlimited' }}</span>
            </div>

            <div class="summary-row">
              <span>Certification</span>
              <span>{{ selectedPlan.certificationIncluded ? 'Included' : 'Not included' }}</span>
            </div>

            <div class="summary-row total">
              <span>Total</span>
              <span class="final-price">{{ (selectedPlan.price || 0) | number:'1.2-2' }} €</span>
            </div>
          </section>

          <section class="checkout-actions">
            <p class="form-description">
              Secure card payment powered by Stripe. Your subscription will be activated after Stripe confirms the payment.
            </p>

            <button
              type="button"
              class="btn-pay"
              [disabled]="paymentLoading || !currentUserId"
              (click)="paySubscription()"
            >
              {{ paymentLoading ? 'Redirecting to Stripe...' : 'Pay by card with Stripe' }}
            </button>

            <p *ngIf="!currentUserId" class="message-error">
              Please log in before purchasing a subscription.
            </p>
          </section>
        </ng-container>
      </div>
    </div>
  `,
  styles: [`
    .checkout-page { max-width: 600px; margin: 0 auto; padding: 2rem; }
    .page-header { margin-bottom: 2rem; }
    .back-link { color: #6366f1; text-decoration: none; font-size: 0.9rem; }
    .back-link:hover { text-decoration: underline; }
    .checkout-content {
      padding: 1.5rem 2rem;
      border-radius: 12px;
      border: 1px solid rgba(99, 102, 241, 0.2);
      box-shadow: 0 4px 24px rgba(15, 23, 42, 0.08);
    }
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
    .message-error { color: #dc2626; margin-top: 1rem; }
    .message-success { color: #15803d; margin-top: 1rem; }
  `]
})
export class CheckoutComponent implements OnInit {
  isSubscriptionMode = false;
  selectedPlan: SubscriptionPlanResponse | null = null;
  loadingPlan = false;
  paymentLoading = false;
  paymentError = '';
  paymentSuccess = '';
  planId: string | null = null;

  promoCode = '';
  originalPrice = 99.99;
  appliedResult: AppliedOfferDTO | null = null;
  promoError = '';
  applying = false;

  constructor(
    private couponService: CouponService,
    private route: ActivatedRoute,
    private planService: SubscriptionPlanService,
    private subscriptionService: SubscriptionService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const queryPlanId = params.get('planId');
      const paymentState = params.get('payment');

      this.planId = queryPlanId || this.route.snapshot.paramMap.get('planId');
      this.isSubscriptionMode = !!this.planId;

      if (this.planId) {
        this.loadPlan(this.planId);
      }

      this.paymentSuccess =
        paymentState === 'success'
          ? 'Payment confirmed. Your subscription will appear in your history after the Stripe webhook is processed.'
          : '';

      this.paymentError =
        paymentState === 'cancelled'
          ? 'Payment was cancelled before confirmation.'
          : '';
    });

    this.route.paramMap.subscribe((params) => {
      const routePlanId = params.get('planId');
      if (!this.planId && routePlanId) {
        this.planId = routePlanId;
        this.isSubscriptionMode = true;
        this.loadPlan(routePlanId);
      }
    });
  }

  get currentUserId(): string {
    const user = this.authService.getUserFromToken();
    return user?.id ? String(user.id) : '';
  }

  get finalPrice(): number {
    return this.appliedResult?.success
      ? (this.appliedResult.finalPrice ?? this.originalPrice)
      : this.originalPrice;
  }

  applyPromo(): void {
    const code = this.promoCode?.trim() ?? '';
    if (!code || this.applying) return;

    this.applying = true;
    this.promoError = '';
    this.appliedResult = null;

    this.couponService
      .applyCoupon(code, this.originalPrice, this.currentUserId || 'anonymous-user')
      .subscribe({
        next: (result) => {
          this.appliedResult = result;
          if (!result.success && result.messages?.length) {
            this.promoError = result.messages.join(', ');
          }
          this.applying = false;
        },
        error: (err) => {
          this.promoError = err?.error?.message || 'Error applying promo code.';
          this.applying = false;
        }
      });
  }

  onPay(): void {
    if (!this.appliedResult?.success) return;
    alert('Payment simulated successfully. Thank you for your purchase!');
  }

  paySubscription(): void {
    if (!this.selectedPlan?.planId || !this.currentUserId || this.paymentLoading) return;

    this.paymentLoading = true;
    this.paymentError = '';

    const baseUrl = window.location.origin;

    this.subscriptionService.createCheckoutSession({
      userId: this.currentUserId,
      planId: this.selectedPlan.planId,
      successUrl: `${baseUrl}/checkout?planId=${this.selectedPlan.planId}&payment=success`,
      cancelUrl: `${baseUrl}/checkout?planId=${this.selectedPlan.planId}&payment=cancelled`
    }).subscribe({
      next: (response) => {
        if (response.checkoutUrl) {
          window.location.href = response.checkoutUrl;
          return;
        }

        this.paymentError = response.message || 'Unable to start Stripe payment.';
        this.paymentLoading = false;
      },
      error: (err) => {
        this.paymentError = err?.error?.message || 'Error while creating the Stripe checkout session.';
        this.paymentLoading = false;
      }
    });
  }

  private loadPlan(planId: string): void {
    this.loadingPlan = true;
    this.paymentError = '';

    this.planService.getPlanById(planId).subscribe({
      next: (plan) => {
        this.selectedPlan = plan;
        this.loadingPlan = false;
      },
      error: (err) => {
        this.paymentError = err?.error?.message || 'Unable to load the selected plan.';
        this.loadingPlan = false;
      }
    });
  }
}
