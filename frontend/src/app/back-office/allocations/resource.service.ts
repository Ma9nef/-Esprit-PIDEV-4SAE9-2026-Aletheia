// src/app/allocations/resource.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Resource } from './allocation.model';

@Injectable({
    providedIn: 'root'
})
export class ResourceService {
    private baseUrl = 'http://localhost:8090/api/resources';

    constructor(
        private http: HttpClient,
    ) {}
  private token: string | null = null;

    private getHeaders(): HttpHeaders {
    this.token = localStorage.getItem('token');
        return new HttpHeaders({
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
        });
    }

    // CREATE
    createResource(resource: Resource): Observable<Resource> {
        return this.http.post<Resource>(this.baseUrl, resource, {
            headers: this.getHeaders()
        });
    }

    // READ ALL
    getAllResources(): Observable<Resource[]> {
        return this.http.get<Resource[]>(this.baseUrl, {
            headers: this.getHeaders()
        });
    }

    // READ ONE
    getResourceById(id: number): Observable<Resource> {
        return this.http.get<Resource>(`${this.baseUrl}/${id}`, {
            headers: this.getHeaders()
        });
    }

    // UPDATE
    updateResource(id: number, resource: Resource): Observable<Resource> {
        return this.http.put<Resource>(`${this.baseUrl}/${id}`, resource, {
            headers: this.getHeaders()
        });
    }

    // DELETE
    deleteResource(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`, {
            headers: this.getHeaders()
        });
    }

    // GET BY TYPE
    getResourcesByType(type: string): Observable<Resource[]> {
        return this.http.get<Resource[]>(`${this.baseUrl}/type/${type}`, {
            headers: this.getHeaders()
        });
    }

    // GET AVAILABLE RESOURCES
    getAvailableResources(): Observable<Resource[]> {
        return this.http.get<Resource[]>(`${this.baseUrl}/available`, {
            headers: this.getHeaders()
        });
    }

    // SEARCH BY NAME
    searchResourcesByName(name: string): Observable<Resource[]> {
        const params = new HttpParams().set('name', name);
        return this.http.get<Resource[]>(`${this.baseUrl}/search`, {
            headers: this.getHeaders(),
            params: params
        });
    }

    // CHECK AVAILABILITY
    checkResourceAvailability(id: number, quantity: number): Observable<boolean> {
        const params = new HttpParams().set('quantity', quantity.toString());
        return this.http.get<boolean>(`${this.baseUrl}/${id}/availability`, {
            headers: this.getHeaders(),
            params: params
        });
    }

    // UPDATE QUANTITY
    updateResourceQuantity(id: number, quantity: number): Observable<Resource> {
        const params = new HttpParams().set('quantity', quantity.toString());
        return this.http.patch<Resource>(`${this.baseUrl}/${id}/quantity`, null, {
            headers: this.getHeaders(),
            params: params
        });
    }
}