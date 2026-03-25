import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OfferResponseDTO, OfferRequestDTO, AppliedOfferDTO } from '../models/offer.model';

@Injectable({
  providedIn: 'root'
})
export class OfferService {
  private apiUrl = '/api/offers'; //Sera proxifié ou redirigé via API Gateway

  constructor(private http: HttpClient) {}

  // Backoffice
  getAllOffers(): Observable<OfferResponseDTO[]> {
    return this.http.get<OfferResponseDTO[]>(this.apiUrl);
  }

  getOfferById(id: string): Observable<OfferResponseDTO> {
    return this.http.get<OfferResponseDTO>(`${this.apiUrl}/${id}`);
  }

  createOffer(offer: OfferRequestDTO): Observable<OfferResponseDTO> {
    return this.http.post<OfferResponseDTO>(this.apiUrl, offer);
  }

  updateOffer(id: string, offer: OfferRequestDTO): Observable<OfferResponseDTO> {
    return this.http.put<OfferResponseDTO>(`${this.apiUrl}/${id}`, offer);
  }

  deleteOffer(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  toggleOfferStatus(id: string): Observable<OfferResponseDTO> {
    return this.http.patch<OfferResponseDTO>(`${this.apiUrl}/${id}/toggle`, {});
  }

  getActiveOffers(): Observable<OfferResponseDTO[]> {
    return this.http.get<OfferResponseDTO[]>(`${this.apiUrl}/active`);
  }

  // Frontoffice
  // Frontoffice - Appliquer une offre à un prix pour un utilisateur
  applyOffer(offerId: string, price: number, userId: string): Observable<AppliedOfferDTO> {
    const params = new HttpParams()
      .set('price', price.toString())
      .set('userId', userId);

    return this.http.post<AppliedOfferDTO>(`${this.apiUrl}/${offerId}/apply`, null, { params });
  }

  // Retourne les offres actives (disponibles pour l'utilisateur)
  getUserAvailableOffers(_userId: string): Observable<OfferResponseDTO[]> {
    return this.getActiveOffers();
  }
}
