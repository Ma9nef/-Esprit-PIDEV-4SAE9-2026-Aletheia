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
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LibraryService {

  // Use relative path so Angular dev-server proxy (proxy.conf.json) forwards requests to the gateway
  // during development. This ensures both front-office and back-office use the same routing.
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
}
