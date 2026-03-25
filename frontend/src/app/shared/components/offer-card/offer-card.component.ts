import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Offer, OfferType, OfferStatus } from '../../../core/models/offer.model';
import { CommonModule } from '@angular/common';

// SUPPRIMEZ "standalone: true" et "imports: []"
@Component({
  selector: 'app-offer-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './offer-card.component.html',
  styleUrls: ['./offer-card.component.css']
  // Plus de "standalone: true"
})
export class OfferCardComponent {
  @Input() offer!: Offer;
  @Input() showActions: boolean = true;
  @Input() showApplyButton: boolean = false;
  @Input() applyPrice: number = 0;
  @Output() viewDetails = new EventEmitter<string>();
  @Output() applyOffer = new EventEmitter<{offer: Offer, price: number}>();
  @Output() edit = new EventEmitter<Offer>();
  @Output() delete = new EventEmitter<string>();

  OfferType = OfferType;
  OfferStatus = OfferStatus;

  onViewDetails(): void {
    this.viewDetails.emit(this.offer.id);
  }

  onApplyOffer(): void {
    this.applyOffer.emit({
      offer: this.offer,
      price: this.applyPrice
    });
  }

  onEdit(): void {
    this.edit.emit(this.offer);
  }

  onDelete(): void {
    this.delete.emit(this.offer.id);
  }

  isExpired(): boolean {
    return new Date(this.offer.endDate) < new Date();
  }

  isScheduled(): boolean {
    return new Date(this.offer.startDate) > new Date();
  }

  isActive(): boolean {
    const now = new Date();
    return this.offer.status === OfferStatus.ACTIVE &&
      now >= new Date(this.offer.startDate) &&
      now <= new Date(this.offer.endDate);
  }

  isFullyUsed(): boolean {
    return this.offer.maxUses ? this.offer.currentUses >= this.offer.maxUses : false;
  }

  isApplicable(): boolean {
    return this.isActive() && !this.isFullyUsed() && this.showApplyButton;
  }

  getDiscountLabel(): string {
    if (this.offer.type === OfferType.PERCENTAGE) {
      return `${this.offer.value}% de réduction`;
    } else {
      return `${this.offer.value}€ de réduction`;
    }
  }

  getDiscountAmount(): number {
    if (this.offer.type === OfferType.PERCENTAGE) {
      return (this.applyPrice * this.offer.value) / 100;
    } else {
      return this.offer.value;
    }
  }

  getFinalPrice(): number {
    const discount = this.getDiscountAmount();
    return Math.max(0, this.applyPrice - discount);
  }

  getStatusLabel(): string {
    if (this.isFullyUsed()) {
      return 'Épuisée';
    }
    if (this.isExpired()) {
      return 'Expirée';
    }
    if (this.isScheduled()) {
      return 'À venir';
    }
    if (this.isActive()) {
      return 'Active';
    }

    switch(this.offer.status) {
      case OfferStatus.ACTIVE:
        return 'Active';
      case OfferStatus.INACTIVE:
        return 'Inactive';
      case OfferStatus.EXPIRED:
        return 'Expirée';
      case OfferStatus.SCHEDULED:
        return 'Programmée';
      default:
        return this.offer.status;
    }
  }

  getStatusClass(): string {
    if (this.isFullyUsed() || this.isExpired() || this.offer.status === OfferStatus.EXPIRED) {
      return 'status-expired';
    }
    if (this.isActive() && this.offer.status === OfferStatus.ACTIVE) {
      return 'status-active';
    }
    if (this.isScheduled() || this.offer.status === OfferStatus.SCHEDULED) {
      return 'status-scheduled';
    }
    return 'status-inactive';
  }

  getTypeLabel(): string {
    return this.offer.type === OfferType.PERCENTAGE ? 'Pourcentage' : 'Montant fixe';
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  getUsagePercentage(): number {
    if (!this.offer.maxUses) return 0;
    return Math.round((this.offer.currentUses / this.offer.maxUses) * 100);
  }

  hasTargeting(): boolean {
    return !!(this.offer.courseIds?.length ||
      this.offer.categoryIds?.length ||
      this.offer.userIds?.length);
  }

  getTargetingText(): string {
    const targets: string[] = [];

    if (this.offer.courseIds?.length) {
      targets.push(`${this.offer.courseIds.length} cours`);
    }
    if (this.offer.categoryIds?.length) {
      targets.push(`${this.offer.categoryIds.length} catégories`);
    }
    if (this.offer.userIds?.length) {
      targets.push(`${this.offer.userIds.length} utilisateurs`);
    }

    return targets.length ? `Ciblé: ${targets.join(', ')}` : 'Tous les utilisateurs';
  }

  hasValidPrice(): boolean {
    return this.showApplyButton && this.applyPrice > 0;
  }
}
