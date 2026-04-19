import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  SubscriptionCheckoutRequest,
  SubscriptionCheckoutResponse,
  SubscriptionPaymentHistory,
  SubscriptionRequest,
  SubscriptionResponse,
  UserSubscription
} from '../models/subscription.model';
import { SubscriptionRequest, SubscriptionResponse, UserSubscription } from '../models/subscription.model';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private apiUrl = '/api/subscriptions'; // Sera proxifié ou redirigé via API Gateway

  constructor(private http: HttpClient) {}

  // Backoffice - Récupérer tous les abonnements
  getAllSubscriptions(): Observable<SubscriptionResponse[]> {
    return this.http.get<SubscriptionResponse[]>(this.apiUrl);
  }

  // Récupérer un abonnement par ID
  getSubscriptionById(id: string): Observable<SubscriptionResponse> {
    return this.http.get<SubscriptionResponse>(`${this.apiUrl}/${id}`);
  }

  // Récupérer tous les abonnements d'un utilisateur
  getSubscriptionsByUser(userId: string): Observable<SubscriptionResponse[]> {
    return this.http.get<SubscriptionResponse[]>(`${this.apiUrl}/user/${userId}`);
  }

  // Récupérer l'abonnement actif d'un utilisateur
  getActiveSubscriptionByUser(userId: string): Observable<UserSubscription> {
    return this.http.get<UserSubscription>(`${this.apiUrl}/user/${userId}/active`);
  }

  // Créer un abonnement
  createSubscription(request: SubscriptionRequest): Observable<SubscriptionResponse> {
    return this.http.post<SubscriptionResponse>(this.apiUrl, request);
  }

  createCheckoutSession(request: SubscriptionCheckoutRequest): Observable<SubscriptionCheckoutResponse> {
    return this.http.post<SubscriptionCheckoutResponse>(`${this.apiUrl}/checkout-session`, request);
  }

  // Annuler un abonnement
  cancelSubscription(id: string): Observable<SubscriptionResponse> {
    return this.http.patch<SubscriptionResponse>(`${this.apiUrl}/${id}/cancel`, {});
  }

  getPaymentHistory(): Observable<SubscriptionPaymentHistory[]> {
    return this.http.get<SubscriptionPaymentHistory[]>(`${this.apiUrl}/payments`);
  }

  getPaymentHistoryByUser(userId: string): Observable<SubscriptionPaymentHistory[]> {
    return this.http.get<SubscriptionPaymentHistory[]>(`${this.apiUrl}/payments/user/${userId}`);
  }

  // Vérifier si un utilisateur a accès à un cours
  hasCourseAccess(userId: string, courseId: string): Observable<boolean> {
    const params = new HttpParams()
      .set('userId', userId)
      .set('courseId', courseId);
    return this.http.get<boolean>(`${this.apiUrl}/has-access`, { params });
  }

  // Optionnel: méthode pour récupérer les abonnements expirés (admin)
  getExpiredSubscriptions(): Observable<SubscriptionResponse[]> {
    return this.http.get<SubscriptionResponse[]>(`${this.apiUrl}/expired`);
  }
}
