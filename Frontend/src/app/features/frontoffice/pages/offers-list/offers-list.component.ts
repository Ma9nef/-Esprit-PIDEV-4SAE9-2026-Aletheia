import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OfferService } from '../../../../core/services/offer.service';
import { FlashSaleService } from '../../../../core/services/flash-sale.service';
import { OfferCardComponent } from '../../../../shared/components/offer-card/offer-card.component';
import { CountdownTimerComponent } from '../../../../shared/components/countdown-timer/countdown-timer.component';
import { OfferResponseDTO } from '../../../../core/models/offer.model';
import { FlashSale } from '../../../../core/models/flash-sale.model';

@Component({
  selector: 'app-offers-list',
  standalone: true,
  imports: [CommonModule, RouterLink, OfferCardComponent, CountdownTimerComponent],
  template: `
    <div class="offers-page">
      <header class="page-header">
        <h1>Formations & Certifications</h1>
        <p class="subtitle">Découvrez nos offres spéciales et formations à prix réduit</p>
      </header>

      <section class="flash-sales" *ngIf="activeFlashSales.length > 0">
        <h2>🔥 Flash Sales en cours</h2>
        <div class="flash-sales-grid">
          <div class="flash-sale-card" *ngFor="let fs of activeFlashSales">
            <div class="fs-header">
              <h3>{{ fs.name }}</h3>
              <app-countdown-timer [endDate]="fs.endTime"></app-countdown-timer>
            </div>
            <p>{{ fs.description }}</p>
            <div class="fs-stats">
              <span>{{ fs.currentUsers }} / {{ fs.maxUsers }} places</span>
              <a [routerLink]="['/checkout']" [queryParams]="{ flashSaleId: fs.id }" class="btn-cta">
                Profiter de l'offre
              </a>
            </div>
          </div>
        </div>
      </section>

      <section class="active-offers">
        <h2>Offres actives</h2>
        <div class="offers-grid" *ngIf="!loading && activeOffers.length > 0">
          <app-offer-card
            *ngFor="let offer of activeOffers"
            [offer]="offer"
            [showActions]="false"
            [showApplyButton]="true"
            [applyPrice]="99.99"
            (viewDetails)="onViewDetails($event)"
          ></app-offer-card>
        </div>
        <p *ngIf="!loading && activeOffers.length === 0 && activeFlashSales.length === 0" class="empty-state">
          Aucune offre disponible pour le moment.
        </p>
        <p *ngIf="loading" class="loading">Chargement...</p>
      </section>

      <section class="checkout-cta">
        <a routerLink="/checkout" class="btn-checkout">Passer à la caisse avec un code promo</a>
      </section>
    </div>
  `,
  styles: [`
    .offers-page { max-width: 1200px; margin: 0 auto; padding: 2rem; }
    .page-header { text-align: center; margin-bottom: 3rem; }
    .page-header h1 { font-size: 2rem; color: #1a202c; margin-bottom: 0.5rem; }
    .subtitle { color: #718096; }
    .flash-sales h2, .active-offers h2 { margin-bottom: 1.5rem; font-size: 1.25rem; }
    .flash-sales-grid, .offers-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;
    }
    .flash-sale-card {
      border: 2px solid #ed8936;
      border-radius: 8px;
      padding: 1.5rem;
      background: linear-gradient(135deg, #fffaf0 0%, #fff 100%);
    }
    .fs-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.75rem; }
    .fs-header h3 { margin: 0; }
    .fs-stats { margin-top: 1rem; display: flex; justify-content: space-between; align-items: center; }
    .btn-cta {
      background: #ed8936;
      color: #fff;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 500;
    }
    .btn-cta:hover { background: #dd6b20; }
    .empty-state, .loading { text-align: center; color: #718096; padding: 2rem; }
    .checkout-cta { text-align: center; margin-top: 3rem; padding-top: 2rem; border-top: 1px solid #e2e8f0; }
    .btn-checkout {
      display: inline-block;
      padding: 0.75rem 1.5rem;
      background: #3182ce;
      color: #fff;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 500;
    }
    .btn-checkout:hover { background: #2c5282; }
  `]
})
export class OffersListComponent implements OnInit {
  activeOffers: OfferResponseDTO[] = [];
  activeFlashSales: FlashSale[] = [];
  loading = true;

  constructor(
    private offerService: OfferService,
    private flashSaleService: FlashSaleService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.offerService.getActiveOffers().subscribe({
      next: (offers) => {
        this.activeOffers = offers;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
    this.flashSaleService.getActiveFlashSales().subscribe({
      next: (fs) => this.activeFlashSales = fs || []
    });
  }

  onViewDetails(id: string): void {
    console.log('View offer', id);
  }
}
