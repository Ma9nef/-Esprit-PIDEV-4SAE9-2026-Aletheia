import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { OfferService } from '../../../../core/services/offer.service';
import { FlashSaleService } from '../../../../core/services/flash-sale.service';
import { OfferCardComponent } from '../../../../shared/components/offer-card/offer-card.component';
import { CountdownTimerComponent } from '../../../../shared/components/countdown-timer/countdown-timer.component';
import { OfferResponseDTO } from '../../../../core/models/offer.model';
import { FlashSale } from '../../../../core/models/flash-sale.model';

@Component({
  selector: 'app-offers-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    OfferCardComponent,
    CountdownTimerComponent,
    ReactiveFormsModule
  ],
  template: `
    <div class="offers-page">
      <header class="page-header">
        <h1>Courses & Certifications</h1>
        <p class="subtitle">Discover our special offers and discounted courses</p>
      </header>

      <!-- 🔍 Advanced Search -->
      <div class="search-filters card">
        <h3>🔍 Advanced Search</h3>
        <form [formGroup]="filterForm" (ngSubmit)="applyFilters()">
          <div class="filter-row">
            <label>Keyword</label>
            <input type="text" formControlName="keyword" placeholder="Title, description...">
          </div>
          <div class="filter-row">
            <label>Discount Type</label>
            <select formControlName="discountType">
              <option value="">All</option>
              <option value="PERCENTAGE">Percentage</option>
              <option value="FIXED">Fixed amount</option>
            </select>
          </div>
          <div class="filter-row">
            <label>Min discount (%)</label>
            <input type="number" formControlName="minDiscount" min="0" max="100">
          </div>
          <div class="filter-row">
            <label>Max discount (%)</label>
            <input type="number" formControlName="maxDiscount" min="0" max="100">
          </div>
          <div class="filter-row">
            <label>Status</label>
            <select formControlName="status">
              <option value="">All</option>
              <option value="ACTIVE">Active</option>
              <option value="EXPIRED">Expired</option>
              <option value="UPCOMING">Upcoming</option>
            </select>
          </div>
          <div class="filter-row checkbox">
            <label>
              <input type="checkbox" formControlName="hasUsesLeft">
              Remaining uses only
            </label>
          </div>
          <div class="filter-actions">
            <button type="submit" class="btn-primary">Filter</button>
            <button type="button" class="btn-secondary" (click)="resetFilters()">Reset</button>
          </div>
        </form>
      </div>

      <!-- Items per page selector -->
      <div class="items-per-page" *ngIf="!loading">
        <label>Items per page:</label>
        <select (change)="onItemsPerPageChange($event)">
          <option value="6">6</option>
          <option value="9" selected>9</option>
          <option value="12">12</option>
          <option value="24">24</option>
        </select>
      </div>

      <!-- Filtered Offers (paginated) -->
      <section class="offers">
        <h2>Available Offers</h2>
        <div class="offers-grid" *ngIf="!loading && paginatedOffers.length > 0">
          <app-offer-card
            *ngFor="let offer of paginatedOffers"
            [offer]="offer"
            [showActions]="false"
            [showApplyButton]="true"
            [applyPrice]="99.99"
            (viewDetails)="onViewDetails($event)"
          ></app-offer-card>
        </div>
        <p *ngIf="!loading && filteredOffers.length === 0 && activeFlashSales.length === 0" class="empty-state">
          No offers match your criteria.
        </p>
        <p *ngIf="loading" class="loading">Loading...</p>
      </section>

      <!-- Pagination controls -->
      <div class="pagination" *ngIf="!loading && totalPages > 1">
        <button (click)="prevPage()" [disabled]="currentPage === 1">Previous</button>
        <button *ngFor="let page of [].constructor(totalPages); let i = index"
                (click)="goToPage(i + 1)"
                [class.active]="currentPage === i + 1">
          {{ i + 1 }}
        </button>
        <button (click)="nextPage()" [disabled]="currentPage === totalPages">Next</button>
      </div>

      <section class="checkout-cta">
        <a routerLink="/checkout" class="btn-checkout">Go to checkout with a promo code</a>
      </section>
    </div>
    <!-- Compteur et pagination -->
    <div class="pagination-info" *ngIf="!loading && filteredOffers.length > 0">
  <span>
    Showing {{ (currentPage - 1) * itemsPerPage + 1 }} -
    {{ Math.min(currentPage * itemsPerPage, filteredOffers.length) }}
    of {{ filteredOffers.length }} offers
  </span>
    </div>

    <!-- Contrôles de pagination (toujours affichés si > 1 page) -->
    <div class="pagination" *ngIf="!loading && totalPages > 1">
      <button (click)="prevPage()" [disabled]="currentPage === 1">Previous</button>
      <button *ngFor="let page of [].constructor(totalPages); let i = index"
              (click)="goToPage(i + 1)"
              [class.active]="currentPage === i + 1">
        {{ i + 1 }}
      </button>
      <button (click)="nextPage()" [disabled]="currentPage === totalPages">Next</button>
    </div>

    <!-- Flash Sales -->
    <section class="flash-sales" *ngIf="activeFlashSales.length > 0">
      <h2>🔥 Active Flash Sales</h2>
      <div class="flash-sales-grid">
        <div class="flash-sale-card" *ngFor="let fs of activeFlashSales">
          <div class="fs-header">
            <h3>{{ fs.name }}</h3>
            <app-countdown-timer [endDate]="fs.endTime"></app-countdown-timer>
          </div>
          <p>{{ fs.description }}</p>
          <div class="fs-stats">
            <span>{{ fs.currentUsers }} / {{ fs.maxUsers }} spots</span>
            <a [routerLink]="['/checkout']" [queryParams]="{ flashSaleId: fs.id }" class="btn-cta">
              Grab the offer
            </a>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .offers-page { max-width: 1200px; margin: 0 auto; padding: 2rem; }
    .page-header { text-align: center; margin-bottom: 3rem; }
    .page-header h1 { font-size: 2rem; color: #1a202c; margin-bottom: 0.5rem; }
    .subtitle { color: #718096; }
    .flash-sales h2, .offers h2 { margin-bottom: 1.5rem; font-size: 1.25rem; }
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

    /* Filter styles */
    .search-filters.card {
      background: #f7fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 1.5rem;
      margin-bottom: 2rem;
    }
    .filter-row {
      display: flex;
      align-items: center;
      margin-bottom: 0.75rem;
      gap: 1rem;
    }
    .filter-row label {
      min-width: 140px;
      font-weight: 500;
      color: #2d3748;
    }
    .filter-row input,
    .filter-row select {
      flex: 1;
      padding: 0.5rem;
      border: 1px solid #cbd5e0;
      border-radius: 4px;
    }
    .filter-row.checkbox label {
      min-width: auto;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .filter-actions {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
    }
    .btn-primary {
      background: #3182ce;
      color: #fff;
      padding: 0.5rem 1.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .btn-primary:hover {
      background: #2c5282;
    }
    .btn-secondary {
      background: #a0aec0;
      color: #fff;
      padding: 0.5rem 1.5rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .btn-secondary:hover {
      background: #718096;
    }

    /* Pagination & items per page */
    .items-per-page {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }
    .items-per-page select {
      padding: 0.25rem;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
    }
    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
      margin: 2rem 0;
    }
    .pagination button {
      padding: 0.5rem 0.75rem;
      border: 1px solid #e2e8f0;
      background-color: white;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
    }
    .pagination button.active {
      background-color: #3182ce;
      color: white;
      border-color: #3182ce;
    }
    .pagination button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class OffersListComponent implements OnInit {
  allOffers: OfferResponseDTO[] = [];
  filteredOffers: OfferResponseDTO[] = [];
  activeFlashSales: FlashSale[] = [];
  loading = true;
  currentPage = 1;
  itemsPerPage = 3;
  totalPages = 0;
  paginatedOffers: OfferResponseDTO[] = [];
  Math = Math; // pour utiliser Math.min dans le template

  filterForm: FormGroup;

  constructor(
    private offerService: OfferService,
    private flashSaleService: FlashSaleService,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      keyword: [''],
      discountType: [''],
      minDiscount: [null],
      maxDiscount: [null],
      status: [''],
      hasUsesLeft: [false]
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.offerService.getAllOffers().subscribe({
      next: (offers) => {
        this.allOffers = offers;
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });

    this.flashSaleService.getActiveFlashSales().subscribe({
      next: (fs) => {
        console.log('Flash sales received:', fs);
        this.activeFlashSales = fs.map(sale => ({
          ...sale,
          endTime: new Date(sale.endTime)
        }));
      },
      error: (err) => {
        console.error('Error loading flash sales', err);
        this.activeFlashSales = [];
      }
    });
  }

  applyFilters(): void {
    const f = this.filterForm.value;

    this.filteredOffers = this.allOffers.filter(offer => {
      if (f.keyword) {
        const keywordLower = f.keyword.toLowerCase();
        const nameMatch = offer.name?.toLowerCase().includes(keywordLower);
        const descMatch = offer.description?.toLowerCase().includes(keywordLower);
        if (!nameMatch && !descMatch) return false;
      }
      if (f.discountType && offer.type !== f.discountType) return false;
      if (offer.type === 'PERCENTAGE') {
        if (f.minDiscount !== null && offer.value < f.minDiscount) return false;
        if (f.maxDiscount !== null && offer.value > f.maxDiscount) return false;
      }
      if (f.status && offer.status !== f.status) return false;
      if (f.hasUsesLeft) {
        const max = offer.maxUses ?? Infinity;
        if (offer.currentUses >= max) return false;
      }
      return true;
    });
    this.currentPage = 1;
    this.updatePagination();
  }

  resetFilters(): void {
    this.filterForm.reset({
      keyword: '',
      discountType: '',
      minDiscount: null,
      maxDiscount: null,
      status: '',
      hasUsesLeft: false
    });
    this.applyFilters();
  }

  onViewDetails(id: string): void {
    console.log('View offer', id);
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredOffers.length / this.itemsPerPage);
    if (this.totalPages === 0) this.totalPages = 1;
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedOffers = this.filteredOffers.slice(startIndex, endIndex);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  onItemsPerPageChange(event: any): void {
    this.itemsPerPage = +event.target.value;
    this.currentPage = 1;
    this.updatePagination();
  }
}
