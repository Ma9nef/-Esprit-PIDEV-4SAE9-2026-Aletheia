import { OfferFilterPipe } from './offer-filter.pipe';
import { Offer, OfferStatus, OfferType } from '../../core/models/offer.model';

describe('OfferFilterPipe', () => {
  let pipe: OfferFilterPipe;

  beforeEach(() => {
    pipe = new OfferFilterPipe();
  });

  it('should return empty array when offers are null', () => {
    expect(pipe.transform(null)).toEqual([]);
  });

  it('should filter offers by text term', () => {
    const offers = [offer('1', 'Promo Spring', OfferStatus.ACTIVE), offer('2', 'Winter Deal', OfferStatus.ACTIVE)];

    const result = pipe.transform(offers, 'spring', 'all');

    expect(result.length).toBe(1);
    expect(result[0].id).toBe('1');
  });

  it('should filter active offers using status and dates', () => {
    const offers = [
      offer('1', 'Active', OfferStatus.ACTIVE, -1, 1),
      offer('2', 'Expired', OfferStatus.EXPIRED, -10, -1),
      offer('3', 'Scheduled', OfferStatus.SCHEDULED, 1, 10)
    ];

    const result = pipe.transform(offers, '', 'active');

    expect(result.map((item) => item.id)).toEqual(['1']);
  });

  it('should filter expired offers by date even if status is not updated', () => {
    const offers = [
      offer('1', 'Late sync', OfferStatus.ACTIVE, -10, -1),
      offer('2', 'Current', OfferStatus.ACTIVE, -1, 10)
    ];

    const result = pipe.transform(offers, '', 'expired');

    expect(result.map((item) => item.id)).toEqual(['1']);
  });

  it('should filter scheduled offers by future start date', () => {
    const offers = [
      offer('1', 'Coming soon', OfferStatus.ACTIVE, 2, 10),
      offer('2', 'Current', OfferStatus.ACTIVE, -1, 10)
    ];

    const result = pipe.transform(offers, '', 'scheduled');

    expect(result.map((item) => item.id)).toEqual(['1']);
  });

  function offer(id: string, name: string, status: OfferStatus, startOffsetDays = -1, endOffsetDays = 1): Offer {
    const now = new Date();
    return {
      id,
      name,
      description: `${name} description`,
      type: OfferType.PERCENTAGE,
      value: 20,
      startDate: new Date(now.getTime() + startOffsetDays * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() + endOffsetDays * 24 * 60 * 60 * 1000),
      currentUses: 0,
      status,
      createdAt: now,
      updatedAt: now
    };
  }
});
