import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Resource,
  CreateResourceRequest,
  UpdateResourceRequest,
  Reservation,
  CreateReservationRequest,
  AvailabilityCheckRequest,
  AvailabilityCheckResponse,
  ResourceType
} from './resource-management.model';

@Injectable({ providedIn: 'root' })
export class ResourceManagementService {
  private readonly base = 'http://localhost:8086/api';

  constructor(private http: HttpClient) {}

  // ── Resources ──────────────────────────────────────────────────────────────

  getResources(type?: ResourceType): Observable<Resource[]> {
    let params = new HttpParams();
    if (type) params = params.set('type', type);
    return this.http.get<Resource[]>(`${this.base}/resources`, { params });
  }

  getResource(id: string): Observable<Resource> {
    return this.http.get<Resource>(`${this.base}/resources/${id}`);
  }

  createResource(body: CreateResourceRequest): Observable<Resource> {
    return this.http.post<Resource>(`${this.base}/resources`, body);
  }

  updateResource(id: string, body: UpdateResourceRequest): Observable<Resource> {
    return this.http.put<Resource>(`${this.base}/resources/${id}`, body);
  }

  deleteResource(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/resources/${id}`);
  }

  // ── Reservations ───────────────────────────────────────────────────────────

  getReservationsByEventId(eventId: string): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.base}/reservations`, {
      params: new HttpParams().set('eventId', eventId)
    });
  }

  getReservation(id: string): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.base}/reservations/${id}`);
  }

  createReservation(body: CreateReservationRequest, userId?: string): Observable<Reservation> {
    const headers: Record<string, string> = {};
    if (userId) headers['X-User-Id'] = userId;
    return this.http.post<Reservation>(`${this.base}/reservations`, body, { headers });
  }

  confirmReservation(id: string, userId?: string): Observable<Reservation> {
    const headers: Record<string, string> = {};
    if (userId) headers['X-User-Id'] = userId;
    return this.http.put<Reservation>(`${this.base}/reservations/${id}/confirm`, {}, { headers });
  }

  cancelReservation(id: string, userId?: string): Observable<Reservation> {
    const headers: Record<string, string> = {};
    if (userId) headers['X-User-Id'] = userId;
    return this.http.put<Reservation>(`${this.base}/reservations/${id}/cancel`, {}, { headers });
  }

  // ── Availability ───────────────────────────────────────────────────────────

  checkAvailability(body: AvailabilityCheckRequest): Observable<AvailabilityCheckResponse> {
    return this.http.post<AvailabilityCheckResponse>(`${this.base}/resources/check-availability`, body);
  }
}
