import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DashboardData {
  timestamp: Date;
  conversionByType: {
    question: string;
    answer: string;
    details: Array<{
      offerType: string;
      totalConversions: number;
      totalRevenue: number;
      totalDiscount: number;
      averageBasket: number;
      uniqueCustomers: number;
      conversionRate: string;
      revenuePerConversion: number;
    }>;
  };
  bestPeriod: {
    question: string;
    answer: string;
    details: {
      bestMonth: string;
      bestMonthSales: number;
      bestMonthRevenue: number;
      bestMonthCustomers: number;
      bestDayOfWeek: string;
      bestDaySales: number;
      bestHour: string;
      bestHourSales: number;
    };
    monthlyBreakdown: Array<{
      _id: { year: number; month: number };
      totalSales: number;
      revenue: number;
      uniqueCustomers: number;
    }>;
  };
  topInstructors: {
    question: string;
    answer: string;
    topInstructor: {
      rank: number;
      instructorId: string;
      totalSales: number;
      revenue: number;
      totalDiscountGiven: number;
      avgDiscount: number;
      coursesSold: number;
      uniqueStudents: number;
      offerTypesUsed: number;
      revenuePerStudent: number;
      salesPerCourse: number;
      promoEffectiveness: string;
    };
    allInstructors: Array<{
      rank: number;
      instructorId: string;
      totalSales: number;
      revenue: number;
      totalDiscountGiven: number;
      avgDiscount: number;
      coursesSold: number;
      uniqueStudents: number;
      offerTypesUsed: number;
      revenuePerStudent: number;
      salesPerCourse: number;
      promoEffectiveness: string;
    }>;
  };
  executiveSummary: {
    meilleur_type_offre: string;
    meilleure_periode: string;
    meilleur_instructeur: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  // CORRECTION: Port 8083 (votre backend tourne sur ce port)
  private apiUrl = 'http://localhost:8083/api/analytics';

  constructor(private http: HttpClient) {
    console.log('🔌 Analytics Service connecté à:', this.apiUrl);
  }

  /**
   * Récupère le tableau de bord complet avec toutes les analyses
   */
  getDashboard(): Observable<DashboardData> {
    console.log('📊 Récupération du dashboard...');
    return this.http.get<DashboardData>(`${this.apiUrl}/dashboard`);
  }

  /**
   * Analyse du type d'offre qui convertit le mieux
   */
  getConversionByType(): Observable<any> {
    console.log('🎯 Récupération des conversions par type...');
    return this.http.get(`${this.apiUrl}/conversion-by-type`);
  }

  /**
   * Analyse de la période la plus rentable
   */
  getBestPeriod(): Observable<any> {
    console.log('📅 Récupération des meilleures périodes...');
    return this.http.get(`${this.apiUrl}/best-period`);
  }

  /**
   * Classement des instructeurs par performance
   */
  getTopInstructors(): Observable<any> {
    console.log('👨‍🏫 Récupération du classement des instructeurs...');
    return this.http.get(`${this.apiUrl}/top-instructors`);
  }

  // ============================================
  // MÉTHODES SIMPLES (pour compatibilité avec votre code existant)
  // ============================================

  /**
   * Récupère les ventes par type d'offre (format simple)
   */
  getSalesByType(): Observable<any[]> {
    console.log('📊 Récupération des ventes par type (simple)...');
    return this.http.get<any[]>(`${this.apiUrl}/by-type`);
  }

  /**
   * Récupère les ventes par mois (format simple)
   */
  getSalesByMonth(): Observable<any[]> {
    console.log('📅 Récupération des ventes par mois (simple)...');
    return this.http.get<any[]>(`${this.apiUrl}/by-month`);
  }

  /**
   * Récupère le classement des instructeurs (format simple)
   */
  getTopInstructorsSimple(): Observable<any[]> {
    console.log('👨‍🏫 Récupération du classement des instructeurs (simple)...');
    return this.http.get<any[]>(`${this.apiUrl}/top-instructors-simple`);
  }
}
