// src/app/allocations/allocation.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Allocation, AllocationResponse, AvailabilityCheck, toNestedAllocation } from './allocation.model';

@Injectable({
    providedIn: 'root'
})
export class AllocationService {
    private baseUrl = 'http://localhost:8090/api/allocations';
  private token: string | null = null;

    constructor(
        private http: HttpClient,
    ) {}

    private getHeaders(): HttpHeaders {
    this.token = localStorage.getItem('token');
        return new HttpHeaders({
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
        });
    }

    // CREATE
    createAllocation(allocation: Allocation): Observable<AllocationResponse> {
        return this.http.post<AllocationResponse>(this.baseUrl, allocation, {
            headers: this.getHeaders()
        });
    }

    // READ ALL - Avec transformation
    getAllAllocations(): Observable<any[]> {
        return this.http.get<AllocationResponse[]>(this.baseUrl, {
            headers: this.getHeaders()
        }).pipe(
            map(responses => responses.map(response => toNestedAllocation(response)))
        );
    }

    // READ ONE - Avec transformation
    getAllocationById(id: number): Observable<any> {
        return this.http.get<AllocationResponse>(`${this.baseUrl}/${id}`, {
            headers: this.getHeaders()
        }).pipe(
            map(response => toNestedAllocation(response))
        );
    }

    // READ BY EVENT - Avec transformation
    getAllocationsByEvent(eventId: number): Observable<any[]> {
        return this.http.get<AllocationResponse[]>(`${this.baseUrl}/event/${eventId}`, {
            headers: this.getHeaders()
        }).pipe(
            map(responses => responses.map(response => toNestedAllocation(response)))
        );
    }

    // READ BY RESOURCE - Avec transformation
    getAllocationsByResource(resourceId: number): Observable<any[]> {
        return this.http.get<AllocationResponse[]>(`${this.baseUrl}/resource/${resourceId}`, {
            headers: this.getHeaders()
        }).pipe(
            map(responses => responses.map(response => toNestedAllocation(response)))
        );
    }

    // UPDATE
    updateAllocation(id: number, allocation: Allocation): Observable<AllocationResponse> {
        return this.http.put<AllocationResponse>(`${this.baseUrl}/${id}`, allocation, {
            headers: this.getHeaders()
        });
    }

    // DELETE
    deleteAllocation(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`, {
            headers: this.getHeaders()
        });
    }

    // CHECK AVAILABILITY
    checkAvailability(allocation: Allocation): Observable<AvailabilityCheck> {
        return this.http.post<AvailabilityCheck>(`${this.baseUrl}/check-availability`, allocation, {
            headers: this.getHeaders()
        });
    }

    // GET CONFLICTS
    getConflicts(resourceId: number, allocation: Allocation): Observable<AllocationResponse[]> {
        const params = new HttpParams().set('eventId', allocation.event?.id?.toString() || '');
        return this.http.post<AllocationResponse[]>(
            `${this.baseUrl}/resource/${resourceId}/conflicts`,
            allocation,
            { headers: this.getHeaders(), params }
        );
    }

    // GET USAGE STATS
    getResourceUsage(resourceId: number): Observable<number> {
        return this.http.get<number>(`${this.baseUrl}/resource/${resourceId}/usage`, {
            headers: this.getHeaders()
        });
    }
}
