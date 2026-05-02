import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { provideRouter } from '@angular/router';
import { SubscriptionPlansListComponent } from './subscription-plans-list.component';
import { SubscriptionPlanService } from '../../core/services/subscription-plan.service';
import { AuthService } from '../../core/services/auth.service';
import { SubscriptionPlanRecommendation, SubscriptionPlanResponse } from '../../core/models/subscription-plan.model';

describe('SubscriptionPlansListComponent', () => {
  let component: SubscriptionPlansListComponent;
  let fixture: ComponentFixture<SubscriptionPlansListComponent>;
  let planServiceSpy: jasmine.SpyObj<SubscriptionPlanService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    planServiceSpy = jasmine.createSpyObj<SubscriptionPlanService>('SubscriptionPlanService', [
      'getActivePlans',
      'getRecommendedPlan'
    ]);
    authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', ['getUserFromToken']);

    planServiceSpy.getActivePlans.and.returnValue(of(samplePlans()));
    planServiceSpy.getRecommendedPlan.and.returnValue(of(sampleRecommendation()));
    authServiceSpy.getUserFromToken.and.returnValue({ id: 7, email: 'user@test.com', role: 'USER' });

    await TestBed.configureTestingModule({
      imports: [SubscriptionPlansListComponent],
      providers: [
        { provide: SubscriptionPlanService, useValue: planServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SubscriptionPlansListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load active plans and recommendation on init', () => {
    expect(planServiceSpy.getActivePlans).toHaveBeenCalled();
    expect(planServiceSpy.getRecommendedPlan).toHaveBeenCalledWith('7');
    expect(component.plans.length).toBe(2);
    expect(component.recommendedPlan?.planId).toBe('plan-2');
  });

  it('should not load recommendation when user is not connected', () => {
    authServiceSpy.getUserFromToken.and.returnValue(null);
    planServiceSpy.getRecommendedPlan.calls.reset();

    component.loadRecommendation();

    expect(planServiceSpy.getRecommendedPlan).not.toHaveBeenCalled();
  });

  it('should reset recommendation when service fails', () => {
    planServiceSpy.getRecommendedPlan.and.returnValue(throwError(() => new Error('boom')));
    component.recommendation = sampleRecommendation();

    component.loadRecommendation();

    expect(component.recommendation).toBeNull();
  });

  function samplePlans(): SubscriptionPlanResponse[] {
    return [
      { success: true, message: 'ok', planId: 'plan-1', name: 'Basic', price: 10 },
      { success: true, message: 'ok', planId: 'plan-2', name: 'Premium', price: 30 }
    ];
  }

  function sampleRecommendation(): SubscriptionPlanRecommendation {
    return {
      success: true,
      message: 'ok',
      userId: '7',
      recommendedPlanId: 'plan-2',
      recommendedPlanName: 'Premium',
      confidenceScore: 91,
      recommendationType: 'LOYALTY_RENEWAL',
      reasons: ['Good history']
    };
  }
});
