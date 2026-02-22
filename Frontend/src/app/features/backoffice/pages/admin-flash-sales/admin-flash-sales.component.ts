import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FlashSaleService } from '../../../../core/services/flash-sale.service';
import { FlashSale, FlashSaleHelper } from '../../../../core/models/flash-sale.model';
import { CountdownTimerComponent } from '../../../../shared/components/countdown-timer/countdown-timer.component';

@Component({
  selector: 'app-admin-flash-sales',
  standalone: true,
  imports: [CommonModule, RouterLink, CountdownTimerComponent],
  template: `
    <div class="admin-flash-sales">
      <div class="page-header">
        <h1>Gestion des Flash Sales</h1>
        <a routerLink="/admin/flash-sales/new" class="btn-primary">+ Nouvelle Flash Sale</a>
      </div>

      <p *ngIf="loading">Chargement...</p>
      <div class="flash-sales-grid" *ngIf="!loading && flashSales.length > 0">
        <div class="fs-card" *ngFor="let fs of flashSales">
          <div class="fs-header">
            <h3>{{ fs.name }}</h3>
            <span [class]="'status-' + getStatus(fs).class">{{ getStatus(fs).text }}</span>
          </div>
          <p>{{ fs.description }}</p>
          <div class="fs-meta">
            <span>{{ fs.currentUsers }} / {{ fs.maxUsers }} places</span>
            <app-countdown-timer *ngIf="FlashSaleHelper.isOngoing(fs)" [endDate]="fs.endTime"></app-countdown-timer>
          </div>
          <div class="fs-actions">
            <a [routerLink]="['/admin/flash-sales', fs.id]" class="btn-edit">Modifier</a>
            <button (click)="onToggle(fs)" class="btn-toggle">
              {{ fs.isActive ? 'Désactiver' : 'Activer' }}
            </button>
            <button (click)="onDelete(fs.id)" class="btn-delete">Supprimer</button>
          </div>
        </div>
      </div>
      <p *ngIf="!loading && flashSales.length === 0" class="empty">Aucune Flash Sale.</p>
      <p *ngIf="error" class="error">{{ error }}</p>
    </div>
  `,
  styles: [`
    .admin-flash-sales { max-width: 100%; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .btn-primary {
      padding: 0.5rem 1rem;
      background: #3182ce;
      color: #fff;
      border-radius: 6px;
      text-decoration: none;
    }
    .flash-sales-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }
    .fs-card {
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 1rem;
      background: #fff;
    }
    .fs-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
    .fs-header h3 { margin: 0; }
    .fs-meta { margin: 0.75rem 0; font-size: 0.9rem; color: #718096; }
    .fs-actions { display: flex; gap: 0.5rem; margin-top: 1rem; }
    .btn-edit { color: #3182ce; text-decoration: none; padding: 0.35rem 0.75rem; }
    .btn-toggle, .btn-delete {
      padding: 0.35rem 0.75rem;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.85rem;
    }
    .btn-toggle { background: #ecc94b; border: none; }
    .btn-delete { background: #fff; border: 1px solid #e53e3e; color: #e53e3e; }
    .status-ongoing { color: #38a169; }
    .status-ended { color: #e53e3e; }
    .empty, .error { padding: 1rem; }
    .error { color: #e53e3e; }
  `]
})
export class AdminFlashSalesComponent implements OnInit {
  flashSales: FlashSale[] = [];
  loading = true;
  error = '';
  FlashSaleHelper = FlashSaleHelper;

  constructor(private flashSaleService: FlashSaleService) {}

  ngOnInit(): void {
    this.loadFlashSales();
  }

  loadFlashSales(): void {
    this.loading = true;
    this.flashSaleService.getAllFlashSales().subscribe({
      next: (fs) => {
        this.flashSales = fs;
        this.loading = false;
      },
      error: (e) => {
        this.error = e?.error?.message || 'Erreur lors du chargement';
        this.loading = false;
      }
    });
  }

  getStatus(fs: FlashSale) {
    return FlashSaleHelper.getDisplayStatus(fs);
  }

  onToggle(fs: FlashSale): void {
    if (!fs.id) return;
    this.flashSaleService.toggleFlashSaleStatus(fs.id).subscribe({
      next: () => this.loadFlashSales(),
      error: (e) => this.error = e?.error?.message || 'Erreur'
    });
  }

  onDelete(id?: string): void {
    if (!id) return;
    if (confirm('Supprimer cette Flash Sale ?')) {
      this.flashSaleService.deleteFlashSale(id).subscribe({
        next: () => this.loadFlashSales(),
        error: (e) => this.error = e?.error?.message || 'Erreur'
      });
    }
  }
}
