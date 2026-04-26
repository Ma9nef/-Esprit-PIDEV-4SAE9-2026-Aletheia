import { Pipe, PipeTransform } from '@angular/core';
import { Offer } from '../../core/models/offer.model';

@Pipe({
  name: 'offerFilter',
  standalone: true
})
export class OfferFilterPipe implements PipeTransform {

  transform(offers: Offer[] | null, filterTerm: string = '', filterType: string = 'all'): Offer[] {
    if (!offers) return [];

    let filtered = [...offers];

    // Filtre par recherche textuelle
    if (filterTerm.trim()) {
      const term = filterTerm.toLowerCase();
      filtered = filtered.filter(offer =>
        offer.name.toLowerCase().includes(term) ||
        offer.description?.toLowerCase().includes(term)
      );
    }

    // Filtre par type
    const now = new Date();
    switch(filterType) {
      case 'active':
        filtered = filtered.filter(offer =>
          offer.status === 'ACTIVE' &&
          new Date(offer.startDate) <= now &&
          new Date(offer.endDate) >= now
        );
        break;
      case 'expired':
        filtered = filtered.filter(offer =>
          offer.status === 'EXPIRED' || new Date(offer.endDate) < now
        );
        break;
      case 'scheduled':
        filtered = filtered.filter(offer =>
          offer.status === 'SCHEDULED' || new Date(offer.startDate) > now
        );
        break;
    }

    return filtered;
  }
}
