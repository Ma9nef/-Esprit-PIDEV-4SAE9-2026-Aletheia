import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AdminSubscriptionsComponent } from './admin-subscriptions.component';
import { SubscriptionService } from '../../core/services/subscription.service';
import { SubscriptionPaymentHistory, SubscriptionResponse } from '../../core/models/subscription.model';

describe('AdminSubscriptionsComponent', () => {
  let component: AdminSubscriptionsComponent;
  let fixture: ComponentFixture<AdminSubscriptionsComponent>;
  let subscriptionServiceSpy: jasmine.SpyObj<SubscriptionService>;

  beforeEach(async () => {
    subscriptionServiceSpy = jasmine.createSpyObj<SubscriptionService>('SubscriptionService', [
      'getAllSubscriptions',
      'getPaymentHistory',
      'cancelSubscription'
    ]);

    subscriptionServiceSpy.getAllSubscriptions.and.returnValue(of(sampleSubscriptions()));
    subscriptionServiceSpy.getPaymentHistory.and.returnValue(of(samplePayments()));
    subscriptionServiceSpy.cancelSubscription.and.returnValue(of({ success: true, message: 'ok' } as SubscriptionResponse));

    await TestBed.configureTestingModule({
      imports: [AdminSubscriptionsComponent],
      providers: [
        { provide: SubscriptionService, useValue: subscriptionServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminSubscriptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compute filtered metrics from loaded data', () => {
    expect(component.filteredSubscriptions.length).toBe(3);
    expect(component.activeSubscriptionsCount).toBe(2);
    expect(component.expiringSoonCount).toBe(1);
    expect(component.successfulPaymentsCount).toBe(1);
    expect(component.pendingPaymentsCount).toBe(1);
    expect(component.totalRevenue).toBe(99);
  });

  it('should filter subscriptions by search and status', () => {
    component.subscriptionSearch = 'premium';
    component.subscriptionStatusFilter = 'ACTIVE';

    expect(component.filteredSubscriptions.length).toBe(1);
    expect(component.filteredSubscriptions[0].planName).toBe('Premium');
  });

  it('should format special day remaining states', () => {
    expect(component.formatDaysRemaining(undefined, 'PENDING')).toBe('Awaiting activation');
    expect(component.formatDaysRemaining(undefined, 'CANCELED')).toBe('Canceled');
    expect(component.formatDaysRemaining(-1, 'ACTIVE')).toBe('Expired');
    expect(component.formatDaysRemaining(5, 'ACTIVE')).toBe('5 day(s)');
  });

  it('should cancel subscription after confirmation and refresh data', () => {
    spyOn(window, 'confirm').and.returnValue(true);

    component.onCancel('sub-1');

    expect(subscriptionServiceSpy.cancelSubscription).toHaveBeenCalledWith('sub-1');
    expect(subscriptionServiceSpy.getAllSubscriptions).toHaveBeenCalledTimes(2);
    expect(subscriptionServiceSpy.getPaymentHistory).toHaveBeenCalledTimes(2);
    expect(component.cancelInProgress['sub-1']).toBeUndefined();
  });

  it('should expose backend error when subscription loading fails', () => {
    subscriptionServiceSpy.getAllSubscriptions.and.returnValue(throwError(() => ({
      error: { message: 'Unable to load subscriptions' }
    })));

    component.loadSubscriptions();

    expect(component.error).toBe('Unable to load subscriptions');
    expect(component.loading).toBeFalse();
  });

  function sampleSubscriptions(): SubscriptionResponse[] {
    return [
      {
        success: true,
        message: 'ok',
        subscriptionId: 'sub-1',
        subscriptionNumber: 'SUB-1',
        userId: 'user-1',
        planId: 'plan-1',
        planName: 'Premium',
        planPrice: 99,
        status: 'ACTIVE',
        daysRemaining: 3
      },
      {
        success: true,
        message: 'ok',
        subscriptionId: 'sub-2',
        subscriptionNumber: 'SUB-2',
        userId: 'user-2',
        planId: 'plan-2',
        planName: 'Basic',
        planPrice: 19,
        status: 'ACTIVE',
        daysRemaining: 20
      },
      {
        success: true,
        message: 'ok',
        subscriptionId: 'sub-3',
        subscriptionNumber: 'SUB-3',
        userId: 'user-3',
        planId: 'plan-3',
        planName: 'Trial',
        status: 'CANCELED',
        daysRemaining: 0
      }
    ];
  }

  function samplePayments(): SubscriptionPaymentHistory[] {
    return [
      {
        paymentId: 'pay-1',
        userId: 'user-1',
        planId: 'plan-1',
        planName: 'Premium',
        amount: 99,
        status: 'SUCCESS'
      },
      {
        paymentId: 'pay-2',
        userId: 'user-2',
        planId: 'plan-2',
        planName: 'Basic',
        amount: 19,
        status: 'PENDING'
      }
    ];
  }
});
