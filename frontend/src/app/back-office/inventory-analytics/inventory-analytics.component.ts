import { Component, OnInit } from '@angular/core';
import {
  InventoryAnalyticsService,
  InventoryAnalyticsReport,
  TopProductDTO,
  BorrowTrendDTO,
  InventoryInsightDTO
} from '../../core/services/inventory-analytics.service';

@Component({
  selector: 'app-inventory-analytics',
  templateUrl: './inventory-analytics.component.html',
  styleUrls: ['./inventory-analytics.component.css']
})
export class InventoryAnalyticsComponent implements OnInit {
  report: InventoryAnalyticsReport | null = null;
  loading = false;
  error = '';
  activeTab: 'overview' | 'top' | 'trends' | 'insights' = 'overview';

  constructor(private analyticsService: InventoryAnalyticsService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';
    this.analyticsService.getFullReport().subscribe({
      next: (data) => { this.report = data; this.loading = false; },
      error: () => { this.error = 'Failed to load analytics. Make sure the Library service is running.'; this.loading = false; }
    });
  }

  get trendMax(): number {
    if (!this.report?.currentYearTrends?.length) return 1;
    return Math.max(...this.report.currentYearTrends.map(t => t.borrowCount));
  }

  trendBarHeight(trend: BorrowTrendDTO): string {
    const max = this.trendMax;
    return max > 0 ? `${(trend.borrowCount / max) * 100}%` : '0%';
  }

  typeColor(type: string): string {
    const map: Record<string, string> = {
      BOOK: '#3b82f6', CHILDREN_MATERIAL: '#22c55e',
      PDF: '#8b5cf6', EXAM: '#f59e0b', OTHER: '#64748b'
    };
    return map[type] ?? '#94a3b8';
  }

  insightClass(insight: InventoryInsightDTO): string {
    return insight.insightType === 'INCREASE_COPIES' ? 'insight-increase' : 'insight-remove';
  }

  insightIcon(insight: InventoryInsightDTO): string {
    return insight.insightType === 'INCREASE_COPIES' ? '📈' : '📦';
  }
}
