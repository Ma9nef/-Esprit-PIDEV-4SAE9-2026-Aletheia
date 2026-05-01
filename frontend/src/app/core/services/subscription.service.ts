import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  SubscriptionCheckoutRequest,
  SubscriptionCheckoutResponse,
  SubscriptionPaymentHistory,
  SubscriptionRequest,
  SubscriptionResponse,
  UserSubscription
} from '../models/subscription.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private apiUrl = '/api/subscriptions'; // Proxifié vers la gateway (8089) par le dev-server

  constructor(private http: HttpClient, private auth: AuthService) {}

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
    const token = this.auth.getToken();
    const headers = token
      ? new HttpHeaders({
          Authorization: `Bearer ${token}`,
          'X-Auth-Token': token
        })
      : undefined;
    return this.http.post<SubscriptionCheckoutResponse>(
      `${this.apiUrl}/checkout-session`,
      request,
      headers ? { headers } : {}
    );
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
