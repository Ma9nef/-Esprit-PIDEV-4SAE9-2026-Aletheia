// subscription-plan.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  SubscriptionPlan,
  SubscriptionPlanRecommendation,
  SubscriptionPlanRequest,
  SubscriptionPlanResponse
} from '../models/subscription-plan.model';
import { SubscriptionPlan, SubscriptionPlanRequest, SubscriptionPlanResponse } from '../models/subscription-plan.model';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionPlanService {
  private apiUrl = '/api/subscription-plans'; // Sera proxifié ou redirigé via API Gateway

  constructor(private http: HttpClient) {}

  // Backoffice - Récupérer tous les plans
  getAllPlans(): Observable<SubscriptionPlanResponse[]> {
    return this.http.get<SubscriptionPlanResponse[]>(this.apiUrl);
  }

  // Récupérer un plan par ID
  getPlanById(id: string): Observable<SubscriptionPlanResponse> {
    return this.http.get<SubscriptionPlanResponse>(`${this.apiUrl}/${id}`);
  }

  // Récupérer les plans actifs (pour le frontoffice)
  getActivePlans(): Observable<SubscriptionPlanResponse[]> {
    return this.http.get<SubscriptionPlanResponse[]>(`${this.apiUrl}/active`);
  }

  getRecommendedPlan(userId: string): Observable<SubscriptionPlanRecommendation> {
    return this.http.get<SubscriptionPlanRecommendation>(`${this.apiUrl}/recommendation/${userId}`);
  }

  // Créer un plan (admin)
  createPlan(request: SubscriptionPlanRequest): Observable<SubscriptionPlanResponse> {
    return this.http.post<SubscriptionPlanResponse>(this.apiUrl, request);
  }

  // Mettre à jour un plan (admin)
  updatePlan(id: string, request: SubscriptionPlanRequest): Observable<SubscriptionPlanResponse> {
    return this.http.put<SubscriptionPlanResponse>(`${this.apiUrl}/${id}`, request);
  }

  // Supprimer un plan (admin) - optionnel
  deletePlan(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Activer/désactiver un plan
  togglePlanStatus(id: string): Observable<SubscriptionPlanResponse> {
    return this.http.patch<SubscriptionPlanResponse>(`${this.apiUrl}/${id}/toggle`, {});
  }
}
