// src/app/front-office/service/event.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppEvent } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:8090/api';

  constructor(private http: HttpClient) {}

  getAllEvents(): Observable<AppEvent[]> {
    return this.http.get<AppEvent[]>(`${this.apiUrl}/events`);
  }

  getEventById(id: number): Observable<AppEvent> {
    return this.http.get<AppEvent>(`${this.apiUrl}/events/${id}`);
  }

  createEvent(event: AppEvent): Observable<AppEvent> {
    return this.http.post<AppEvent>(`${this.apiUrl}/events`, event);
  }

  updateEvent(id: number, event: AppEvent): Observable<AppEvent> {
    return this.http.put<AppEvent>(`${this.apiUrl}/events/${id}`, event);
  }

  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/events/${id}`);
  }

  getUpcomingEvents(): Observable<AppEvent[]> {
    return this.http.get<AppEvent[]>(`${this.apiUrl}/events/upcoming`);
  }

  getEventsByStatus(status: string): Observable<AppEvent[]> {
    return this.http.get<AppEvent[]>(`${this.apiUrl}/events/status/${status}`);
  }
}