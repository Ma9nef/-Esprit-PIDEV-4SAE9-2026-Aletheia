import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
// model is at: src/app/core/models/  — service is at: src/app/core/services/
// so relative path is: ../models/
import { Product, ProductFilter } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly API = 'http://localhost:8080/api/products';

  constructor(private http: HttpClient) {}

  getAll(filter: ProductFilter = {}): Observable<Product[]> {
    let params = new HttpParams();
    if (filter.search?.trim())
      params = params.set('search', filter.search.trim());
    if (filter.type)
      params = params.set('type', filter.type);
    if (filter.available !== null && filter.available !== undefined)
      params = params.set('available', String(filter.available));
    return this.http.get<Product[]>(this.API, { params });
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.API}/${id}`);
  }

  create(product: Product): Observable<Product> {
    return this.http.post<Product>(this.API, product);
  }

  update(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.API}/${id}`, product);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }

  uploadFile(file: File, purpose: 'cover' | 'file'): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('purpose', purpose);
    return this.http.post<{ url: string }>(`${this.API}/upload`, formData);
  }
}
