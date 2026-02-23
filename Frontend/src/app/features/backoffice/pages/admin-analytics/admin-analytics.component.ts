// admin/analytics/analytics.component.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from '../../../../core/services/analytics.service';

@Component({
  selector: 'app-admin-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AdminAnalyticsComponent implements OnInit {

  dashboardData: any = null;
  loading = true;
  error: string | null = null;

  constructor(
    private analyticsService: AnalyticsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading = true;
    this.error = null;

    console.log('🔄 Chargement du dashboard...');
    console.log('État avant chargement - loading:', this.loading, 'dashboardData:', this.dashboardData);

    this.analyticsService.getDashboard().subscribe({
      next: (data) => {
        console.log('✅ Dashboard chargé:', data);
        console.log('Données reçues - conversionByType:', data.conversionByType);
        console.log('Données reçues - bestPeriod:', data.bestPeriod);

        this.dashboardData = data;
        this.loading = false;
        this.cdr.detectChanges(); // Force la mise à jour de la vue

        console.log('État après chargement - loading:', this.loading, 'dashboardData:', this.dashboardData);
      },
      error: (err) => {
        console.error('❌ Erreur:', err);
        this.error = 'Erreur de chargement des données';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  getTypeColor(type: string): string {
    const colors: {[key: string]: string} = {
      'FLASH_SALE': '#FF6B6B',
      'OFFRE': '#4ECDC4',
      'COUPON': '#45B7D1'
    };
    return colors[type] || '#95A5A6';
  }

  getMonthName(monthNumber: number): string {
    const months = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    return months[monthNumber - 1] || `Mois ${monthNumber}`;
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(value);
  }

  formatNumber(value: number): string {
    return new Intl.NumberFormat('fr-FR').format(value);
  }
}
