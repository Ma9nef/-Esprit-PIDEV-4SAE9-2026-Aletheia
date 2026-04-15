// admin/analytics/analytics.component.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService } from '../../core/services/analytics.service';

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

    console.log('🔄 Loading dashboard...');
    console.log('State before loading - loading:', this.loading, 'dashboardData:', this.dashboardData);

    this.analyticsService.getDashboard().subscribe({
      next: (data) => {
        console.log('✅ Dashboard loaded:', data);
        this.dashboardData = data;
        this.loading = false;
        this.cdr.detectChanges(); // Force view update
        console.log('State after loading - loading:', this.loading, 'dashboardData:', this.dashboardData);
      },
      error: (err) => {
        console.error('❌ Error:', err);
        this.error = 'Error loading data';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // ------------------------------
  // Helper Methods for Template
  // ------------------------------

  getTypeColor(type: string): string {
    const colors: {[key: string]: string} = {
      'FLASH_SALE': '#FF6B6B',
      'OFFER': '#4ECDC4',
      'COUPON': '#45B7D1'
    };
    return colors[type] || '#95A5A6';
  }

  getMonthName(monthNumber: number): string {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthNumber - 1] || `Month ${monthNumber}`;
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(value);
  }

  formatNumber(value: number): string {
    return new Intl.NumberFormat('en-US').format(value);
  }

  // ------------------------------
  // TrackBy Functions for *ngFor
  // ------------------------------

  trackByOfferType(index: number, item: any): string {
    return item.offerType; // unique id for conversionByType.details
  }

  trackByMonth(index: number, item: any): string {
    return `${item._id.year}-${item._id.month}`; // unique id for monthlyBreakdown
  }

  trackByInstructorId(index: number, item: any): string {
    return item.instructorId; // unique id for topInstructors.allInstructors
  }
}
