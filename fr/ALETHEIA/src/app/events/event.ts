import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event, EventResponse } from './event.model';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private baseUrl = 'http://localhost:8090/api/events';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  createEvent(event: Event): Observable<EventResponse> {
    return this.http.post<EventResponse>(this.baseUrl, event, { 
      headers: this.getHeaders() 
    });
  }

  getAllEvents(): Observable<EventResponse[]> {
    return this.http.get<EventResponse[]>(this.baseUrl, { 
      headers: this.getHeaders() 
    });
  }

  getEventById(id: number): Observable<EventResponse> {
    return this.http.get<EventResponse>(`${this.baseUrl}/${id}`, { 
      headers: this.getHeaders() 
    });
  }

  updateEvent(id: number, event: Event): Observable<EventResponse> {
    return this.http.put<EventResponse>(`${this.baseUrl}/${id}`, event, { 
      headers: this.getHeaders() 
    });
  }

  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { 
      headers: this.getHeaders() 
    });
  }
}