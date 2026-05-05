import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export type MenuCategoryDTO = {
  label: string;
  subCategories: string[];
};

export type CourseMiniDTO = {
  id: number;
  title: string;
};

@Injectable({ providedIn: 'root' })
export class CatalogMenuService {
  // ✅ si vous passez par gateway plus tard, remplacez baseUrl par 8089/courses/...
  private baseUrl = '/api/catalog';

  constructor(private http: HttpClient) {}

  getMenu(): Observable<MenuCategoryDTO[]> {
    return this.http.get<MenuCategoryDTO[]>(`${this.baseUrl}/menu`);
  }

  getTop(category: string, subCategory?: string, limit = 10): Observable<CourseMiniDTO[]> {
    let params = new HttpParams()
      .set('category', category)
      .set('limit', String(limit));

    if (subCategory) params = params.set('subCategory', subCategory);

    return this.http.get<CourseMiniDTO[]>(`${this.baseUrl}/top`, { params });
  }
}