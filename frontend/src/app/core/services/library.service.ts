import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  id?: number;
  title: string;
  description: string;
  author?: string;
  type: string;
  price?: number;
  fileUrl?: string;
  coverImageUrl?: string;
  available?: boolean;
  stockQuantity?: number;
  stockThreshold?: number;
  lowStock?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface StockMovement {
  id: number;
  productId: number;
  productTitle: string;
  movementType: 'IN' | 'OUT';
  quantity: number;
  reason: string;
  timestamp: string;
}

export interface StockAdjustmentRequest {
  quantity: number;
  reason?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LibraryService {

  private baseUrl = '/api/products';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl);
  }

  create(product: Product): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, product);
  }

  update(id: number, product: Product): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, product);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  // ─── Stock Management ─────────────────────────────────────────────────────

  getLowStockProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/low-stock`);
  }

  addStock(productId: number, request: StockAdjustmentRequest): Observable<Product> {
    return this.http.post<Product>(`${this.baseUrl}/${productId}/stock/add`, request);
  }

  removeStock(productId: number, request: StockAdjustmentRequest): Observable<Product> {
    return this.http.post<Product>(`${this.baseUrl}/${productId}/stock/remove`, request);
  }

  getStockMovements(productId: number): Observable<StockMovement[]> {
    return this.http.get<StockMovement[]>(`${this.baseUrl}/${productId}/stock/movements`);
  }
}
