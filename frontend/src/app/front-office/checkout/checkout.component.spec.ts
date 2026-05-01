import { ComponentFixture, TestBed } from '@angular/core/testing';
import { convertToParamMap, ActivatedRoute } from '@angular/router';
import { of, Subject, throwError } from 'rxjs';
import { CheckoutComponent } from './checkout.component';
import { CouponService } from '../../core/services/coupon.service';
import { SubscriptionPlanService } from '../../core/services/subscription-plan.service';
import { SubscriptionService } from '../../core/services/subscription.service';
import { AuthService } from '../../core/services/auth.service';
import { AppliedOfferDTO } from '../../core/models/offer.model';
import { SubscriptionCheckoutResponse } from '../../core/models/subscription.model';
import { SubscriptionPlanResponse } from '../../core/models/subscription-plan.model';

describe('CheckoutComponent', () => {
  let component: CheckoutComponent;
  let fixture: ComponentFixture<CheckoutComponent>;
  let couponServiceSpy: jasmine.SpyObj<CouponService>;
  let planServiceSpy: jasmine.SpyObj<SubscriptionPlanService>;
  let subscriptionServiceSpy: jasmine.SpyObj<SubscriptionService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let queryParamMap$: Subject<any>;
  let paramMap$: Subject<any>;

  beforeEach(async () => {
    couponServiceSpy = jasmine.createSpyObj<CouponService>('CouponService', ['applyCoupon']);
    planServiceSpy = jasmine.createSpyObj<SubscriptionPlanService>('SubscriptionPlanService', ['getPlanById']);
    subscriptionServiceSpy = jasmine.createSpyObj<SubscriptionService>('SubscriptionService', ['createCheckoutSession']);
    authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', ['getUserFromToken']);

    queryParamMap$ = new Subject();
    paramMap$ = new Subject();

    couponServiceSpy.applyCoupon.and.returnValue(of(successfulPromo()));
    planServiceSpy.getPlanById.and.returnValue(of(selectedPlan()));
    subscriptionServiceSpy.createCheckoutSession.and.returnValue(of(checkoutResponse('https://stripe.test')));
    authServiceSpy.getUserFromToken.and.returnValue({ id: 5, email: 'user@test.com', role: 'USER' });

    await TestBed.configureTestingModule({
      imports: [CheckoutComponent],
      providers: [
        { provide: CouponService, useValue: couponServiceSpy },
        { provide: SubscriptionPlanService, useValue: planServiceSpy },
        { provide: SubscriptionService, useValue: subscriptionServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParamMap: queryParamMap$.asObservable(),
            paramMap: paramMap$.asObservable(),
            snapshot: { paramMap: convertToParamMap({}) }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CheckoutComponent);
    component = fixture.componentInstance;
  });

  it('should apply promo and update final price', () => {
    fixture.detectChanges();
    component.promoCode = 'PROMO20';

    component.applyPromo();

    expect(couponServiceSpy.applyCoupon).toHaveBeenCalledWith('PROMO20', 99.99, '5');
    expect(component.appliedResult?.success).toBeTrue();
    expect(component.finalPrice).toBe(79.99);
    expect(component.promoError).toBe('');
  });

  it('should expose promo error when backend rejects code', () => {
    couponServiceSpy.applyCoupon.and.returnValue(of({
      ...successfulPromo(),
      success: false,
      messages: ['Coupon expired']
    }));
    fixture.detectChanges();
    component.promoCode = 'BADCODE';

    component.applyPromo();

    expect(component.promoError).toBe('Coupon expired');
    expect(component.appliedResult?.success).toBeFalse();
  });

  it('should load subscription plan from route query params', () => {
    fixture.detectChanges();
    queryParamMap$.next(convertToParamMap({ planId: 'plan-1' }));

    expect(component.isSubscriptionMode).toBeTrue();
    expect(planServiceSpy.getPlanById).toHaveBeenCalledWith('plan-1');
    expect(component.selectedPlan?.planId).toBe('plan-1');
  });

  it('should show payment error when selected plan cannot be loaded', () => {
    planServiceSpy.getPlanById.and.returnValue(throwError(() => ({
      error: { message: 'Plan unavailable' }
    })));
    fixture.detectChanges();

    queryParamMap$.next(convertToParamMap({ planId: 'plan-1' }));

    expect(component.paymentError).toBe('Plan unavailable');
    expect(component.loadingPlan).toBeFalse();
  });

  it('should show backend message when Stripe response has no checkout url', () => {
    subscriptionServiceSpy.createCheckoutSession.and.returnValue(of(checkoutResponse(undefined, 'Cannot create session')));
    fixture.detectChanges();
    component.selectedPlan = selectedPlan();

    component.paySubscription();

    expect(component.paymentError).toBe('Cannot create session');
    expect(component.paymentLoading).toBeFalse();
  });

  it('should show subscription mode success message from query params', () => {
    fixture.detectChanges();

    queryParamMap$.next(convertToParamMap({ planId: 'plan-1', payment: 'success' }));

    expect(component.paymentSuccess).toContain('Payment confirmed');
  });

  function successfulPromo(): AppliedOfferDTO {
    return {
      originalPrice: 99.99,
      finalPrice: 79.99,
      totalDiscount: 20,
      discountPercentage: 20,
      success: true,
      messages: ['ok']
    };
  }

  function selectedPlan(): SubscriptionPlanResponse {
    return {
      success: true,
      message: 'ok',
      planId: 'plan-1',
      name: 'Premium',
      durationDays: 30,
      maxCourses: 12,
      certificationIncluded: true,
      price: 99
    };
  }

  function checkoutResponse(checkoutUrl?: string, message = 'Session created'): SubscriptionCheckoutResponse {
    return {
      success: !!checkoutUrl,
      message,
      checkoutUrl,
      sessionId: 'cs_test',
      paymentId: 'payment-1',
      subscriptionId: 'sub-1'
    };
  }
});
