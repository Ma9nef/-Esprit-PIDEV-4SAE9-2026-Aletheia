import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FlashSale } from '../models/flash-sale.model';

@Injectable({
  providedIn: 'root'
})
export class FlashSaleService {
  private apiUrl = '/api/flash-sales'; //Sera configuré via API Gateway plus tard

  constructor(private http: HttpClient) {}

  // Backoffice
  getAllFlashSales(): Observable<FlashSale[]> {
    return this.http.get<FlashSale[]>(this.apiUrl);
  }

  getFlashSaleById(id: string): Observable<FlashSale> {
    return this.http.get<FlashSale>(`${this.apiUrl}/${id}`);
  }

  createFlashSale(flashSale: Partial<FlashSale>): Observable<FlashSale> {
    return this.http.post<FlashSale>(this.apiUrl, flashSale);
  }

  updateFlashSale(id: string, flashSale: Partial<FlashSale>): Observable<FlashSale> {
    return this.http.put<FlashSale>(`${this.apiUrl}/${id}`, flashSale);
  }

  deleteFlashSale(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  toggleFlashSaleStatus(id: string): Observable<FlashSale> {
    return this.http.patch<FlashSale>(`${this.apiUrl}/${id}/toggle`, {});
  }

  getActiveFlashSales(): Observable<FlashSale[]> {
    return this.http.get<FlashSale[]>(`${this.apiUrl}/active`);
  }

  // Frontoffice - Backend retourne un message string
  applyFlashSale(flashSaleId: string, userId: string): Observable<string> {
    const params = new HttpParams().set('userId', userId);
    return this.http.post(`${this.apiUrl}/${flashSaleId}/apply`, null, {
      params,
      responseType: 'text'
    });
  }
}
