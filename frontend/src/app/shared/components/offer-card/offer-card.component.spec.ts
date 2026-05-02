import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OfferCardComponent } from './offer-card.component';
import { Offer, OfferStatus, OfferType } from '../../../core/models/offer.model';

describe('OfferCardComponent', () => {
  let component: OfferCardComponent;
  let fixture: ComponentFixture<OfferCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OfferCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(OfferCardComponent);
    component = fixture.componentInstance;
    component.offer = buildOffer();
    component.showApplyButton = true;
    component.applyPrice = 200;
    fixture.detectChanges();
  });

  it('should calculate percentage discount and final price', () => {
    expect(component.getDiscountAmount()).toBe(40);
    expect(component.getFinalPrice()).toBe(160);
    expect(component.getDiscountLabel()).toContain('20%');
  });

  it('should detect applicable active offer', () => {
    expect(component.isActive()).toBeTrue();
    expect(component.isFullyUsed()).toBeFalse();
    expect(component.isApplicable()).toBeTrue();
    expect(component.getStatusClass()).toBe('status-active');
  });

  it('should mark offer as fully used and not applicable', () => {
    component.offer.currentUses = 10;
    component.offer.maxUses = 10;

    expect(component.isFullyUsed()).toBeTrue();
    expect(component.isApplicable()).toBeFalse();
    expect(component.getStatusLabel()).toBe('Épuisée');
  });

  it('should expose targeting summary', () => {
    component.offer.courseIds = ['c1', 'c2'];
    component.offer.userIds = ['u1'];

    expect(component.hasTargeting()).toBeTrue();
    expect(component.getTargetingText()).toContain('2 cours');
    expect(component.getTargetingText()).toContain('1 utilisateurs');
  });

  it('should emit apply payload with current offer and price', () => {
    spyOn(component.applyOffer, 'emit');

    component.onApplyOffer();

    expect(component.applyOffer.emit).toHaveBeenCalledWith({
      offer: component.offer,
      price: 200
    });
  });

  function buildOffer(): Offer {
    const now = new Date();
    return {
      id: 'offer-1',
      name: 'Promo',
      description: 'Great offer',
      type: OfferType.PERCENTAGE,
      value: 20,
      courseIds: [],
      categoryIds: [],
      userIds: [],
      startDate: new Date(now.getTime() - 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() + 24 * 60 * 60 * 1000),
      maxUses: 10,
      currentUses: 2,
      status: OfferStatus.ACTIVE,
      createdAt: now,
      updatedAt: now
    };
  }
});
