import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Coupon } from '../models/coupon.model';
import { AppliedOfferDTO } from '../models/offer.model';

@Injectable({
  providedIn: 'root'
})
export class CouponService {
  // À remplacer par l'URL de l'API Gateway plus tard
  private apiUrl = '/api/coupons';  // Sera proxifié ou configuré via API Gateway

  constructor(private http: HttpClient) {}

  // Backoffice
  getAllCoupons(): Observable<Coupon[]> {
    return this.http.get<Coupon[]>(this.apiUrl);
  }

  getCouponById(id: string): Observable<Coupon> {
    return this.http.get<Coupon>(`${this.apiUrl}/${id}`);
  }

  createCoupon(coupon: any): Observable<Coupon> {
    return this.http.post<Coupon>(this.apiUrl, coupon);
  }

  updateCoupon(id: string, coupon: any): Observable<Coupon> {
    return this.http.put<Coupon>(`${this.apiUrl}/${id}`, coupon);
  }

  deleteCoupon(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Frontoffice - Backend expose POST /api/offers/apply-coupon
  applyCoupon(code: string, price: number, userId: string): Observable<AppliedOfferDTO> {
    const params = new HttpParams()
      .set('code', code)
      .set('price', price.toString())
      .set('userId', userId);

    return this.http.post<AppliedOfferDTO>('/api/offers/apply-coupon', null, { params });
  }
}
