import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductFilter } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  // Point this to your library microservice URL
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
}
