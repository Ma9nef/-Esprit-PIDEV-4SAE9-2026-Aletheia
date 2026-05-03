import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { OfferService } from '../../core/services/offer.service';
import { OfferCardComponent } from '../../shared/components/offer-card/offer-card.component';
import { OfferResponseDTO } from '../../core/models/offer.model';

@Component({
  selector: 'app-admin-offers',
  standalone: true,
  imports: [CommonModule, RouterLink, OfferCardComponent],
  template: `
    <div class="admin-offers">
      <div class="page-header">
        <h1>Offer Management</h1>
        <a routerLink="/back-office/admin/offers/new" class="btn-primary">+ New Offer</a>
        <a routerLink="/back-office/admin/coupons/new" class="btn-secondary">+ New Coupon</a>
        <a routerLink="/back-office/admin/flash-sales/new" class="btn-secondary">+ New Flash Sale</a>
        <button class="btn-analytics" (click)="goToAnalytics()">📊 Analytics</button>
      </div>

      <p *ngIf="loading">Loading...</p>
      <div class="offers-grid" *ngIf="!loading && offers.length > 0">
        <app-offer-card
          *ngFor="let offer of offers"
          [offer]="offer"
          [showActions]="true"
          [showApplyButton]="false"
          (edit)="onEdit($event)"
          (delete)="onDelete($event)"
          (viewDetails)="onViewDetails($event)"
        ></app-offer-card>
      </div>
      <p *ngIf="!loading && offers.length === 0" class="empty">No offers found.</p>
      <p *ngIf="error" class="error">{{ error }}</p>
    </div>
  `,
  styles: [`
    .admin-offers { max-width: 100%; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .btn-primary {
      padding: 0.5rem 1rem;
      background: #3182ce;
      color: #fff;
      border-radius: 6px;
      text-decoration: none;
    }


    /* Common styles for secondary buttons */
    .btn-secondary {
      display: inline-block;
      padding: 0.5rem 1rem;       /* vertical + horizontal padding */
      margin-left: 0.5rem;        /* spacing between buttons */
      background-color: #718096;  /* slate gray / secondary color */
      color: #fff;                /* white text */
      font-weight: 500;           /* medium weight */
      font-size: 0.9rem;          /* slightly smaller text */
      border: none;               /* remove default border */
      border-radius: 6px;         /* rounded corners */
      text-decoration: none;      /* remove underline for <a> */
      cursor: pointer;            /* pointer on hover */
      transition: background-color 0.2s, transform 0.2s; /* smooth hover */
    }

    /* Hover state */
    .btn-secondary:hover {
      background-color: #4a5568;  /* darker shade */
      transform: translateY(-1px); /* subtle lift effect */
    }

    /* Active / pressed state */
    .btn-secondary:active {
      background-color: #2d3748;  /* even darker shade */
      transform: translateY(0);   /* reset lift */
    }

    /* Optional focus outline for accessibility */
    .btn-secondary:focus {
      outline: 2px solid #63b3ed; /* blue outline */
      outline-offset: 2px;
    }

    .offers-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 1.5rem;
    }
    .empty, .error { padding: 1rem; }
    .error { color: #e53e3e; }
  `]
})
export class AdminOffersComponent implements OnInit {
  offers: OfferResponseDTO[] = [];
  loading = true;
  error = '';

  constructor(
    private offerService: OfferService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOffers();
  }

  loadOffers(): void {
    this.loading = true;
    this.offerService.getAllOffers().subscribe({
      next: (o) => {
        this.offers = o;
        this.loading = false;
      },
      error: (e) => {
        this.error = e?.error?.message || 'Error loading offers';
        this.loading = false;
      }
    });
  }

  onEdit(offer: OfferResponseDTO): void {
    this.router.navigate(['/back-office/admin/offers', offer.id]);
  }

  onDelete(id: string): void {
    if (confirm('Delete this offer?')) {
      this.offerService.deleteOffer(id).subscribe({
        next: () => this.loadOffers(),
        error: (e) => this.error = e?.error?.message || 'Error deleting offer'
      });
    }
  }

  onViewDetails(id: string): void {
    // TODO: modal or detail page
  }
  goToAnalytics(): void {
    this.router.navigate(['/back-office/admin/analytics']);
  }
}
