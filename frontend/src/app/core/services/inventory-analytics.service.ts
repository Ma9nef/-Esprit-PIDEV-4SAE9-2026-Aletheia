import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductType } from './loan.service';

export interface TopProductDTO {
  productId: number;
  title: string;
  author: string;
  type: ProductType;
  borrowCount: number;
  currentStock: number;
}

export interface BorrowTrendDTO {
  year: number;
  month: number;
  monthLabel: string;
  borrowCount: number;
}

export interface InventoryInsightDTO {
  productId: number;
  title: string;
  type: ProductType;
  insightType: 'INCREASE_COPIES' | 'CONSIDER_REMOVAL';
  reason: string;
  borrowCount: number;
  currentStock: number;
}

export interface InventoryAnalyticsReport {
  topBorrowed: TopProductDTO[];
  leastBorrowed: TopProductDTO[];
  currentYearTrends: BorrowTrendDTO[];
  highDemandInsights: InventoryInsightDTO[];
  underutilizedInsights: InventoryInsightDTO[];
  totalActiveLoans: number;
  totalOverdueLoans: number;
  totalLoansAllTime: number;
  totalUnpaidFines: number;
}

@Injectable({ providedIn: 'root' })
export class InventoryAnalyticsService {
  private readonly base = '/api/inventory-analytics';

  constructor(private http: HttpClient) {}

  getFullReport(): Observable<InventoryAnalyticsReport> {
    return this.http.get<InventoryAnalyticsReport>(`${this.base}/report`);
  }

  getTopBorrowed(limit = 10): Observable<TopProductDTO[]> {
    return this.http.get<TopProductDTO[]>(`${this.base}/top-borrowed`, {
      params: new HttpParams().set('limit', limit)
    });
  }

  getLeastBorrowed(limit = 10): Observable<TopProductDTO[]> {
    return this.http.get<TopProductDTO[]>(`${this.base}/least-borrowed`, {
      params: new HttpParams().set('limit', limit)
    });
  }

  getTrends(year?: number): Observable<BorrowTrendDTO[]> {
    let params = new HttpParams();
    if (year) params = params.set('year', year);
    return this.http.get<BorrowTrendDTO[]>(`${this.base}/trends`, { params });
  }

  getHighDemand(): Observable<InventoryInsightDTO[]> {
    return this.http.get<InventoryInsightDTO[]>(`${this.base}/high-demand`);
  }

  getUnderutilized(): Observable<InventoryInsightDTO[]> {
    return this.http.get<InventoryInsightDTO[]>(`${this.base}/underutilized`);
  }
}
