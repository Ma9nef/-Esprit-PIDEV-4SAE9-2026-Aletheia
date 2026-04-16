import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Resource,
  ResourceType,
  CreateResourceRequest,
  UpdateResourceRequest,
  TeachingSession,
  CreateTeachingSessionRequest,
  Reservation,
  CreateReservationRequest,
  CreateRecurrenceReservationRequest,
  RecurrenceBookingResult,
  CheckAvailabilityRequest,
  AvailabilityResponse,
  MaintenanceWindow,
  CreateMaintenanceWindowRequest,
  WaitlistEntry,
  CreateWaitlistRequest,
  SwapRequest,
  CreateSwapRequest,
  CheckInEvent,
  ScanTokenRequest,
  InstructorProfile,
  AdjustScoreRequest,
  ResourceStatistics
} from './resource-management.model';

@Injectable({ providedIn: 'root' })
export class ResourceManagementService {
  // /api/rm/** is routed by the API Gateway to the ResourceManagement service (port 8094).
  // The gateway strips /rm before forwarding, so controllers remain at /api/** on the service side.
  private readonly base = '/api/rm';

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

  searchResources(keyword: string): Observable<Resource[]> {
    return this.http.get<Resource[]>(`${this.base}/resources/search`, {
      params: new HttpParams().set('keyword', keyword)
    });
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

  updateConditionScore(id: string, score: number): Observable<Resource> {
    return this.http.patch<Resource>(`${this.base}/resources/${id}/condition`, null, {
      params: new HttpParams().set('score', score.toString())
    });
  }

  // ── Teaching Sessions ───────────────────────────────────────────────────────

  getMySessions(): Observable<TeachingSession[]> {
    return this.http.get<TeachingSession[]>(`${this.base}/sessions`);
  }

  getSession(id: string): Observable<TeachingSession> {
    return this.http.get<TeachingSession>(`${this.base}/sessions/${id}`);
  }

  createSession(body: CreateTeachingSessionRequest): Observable<TeachingSession> {
    return this.http.post<TeachingSession>(`${this.base}/sessions`, body);
  }

  updateSession(id: string, body: Partial<CreateTeachingSessionRequest>): Observable<TeachingSession> {
    return this.http.put<TeachingSession>(`${this.base}/sessions/${id}`, body);
  }

  // ── Availability ───────────────────────────────────────────────────────────

  checkAvailability(body: CheckAvailabilityRequest): Observable<AvailabilityResponse> {
    return this.http.post<AvailabilityResponse>(`${this.base}/availability/check`, body);
  }

  suggestAlternatives(
    resourceId: string,
    startTime: string,
    endTime: string,
    expectedAttendees?: number
  ): Observable<AvailabilityResponse> {
    let params = new HttpParams()
      .set('resourceId', resourceId)
      .set('startTime', startTime)
      .set('endTime', endTime);
    if (expectedAttendees != null) params = params.set('expectedAttendees', expectedAttendees.toString());
    return this.http.post<AvailabilityResponse>(`${this.base}/availability/suggest`, null, { params });
  }

  browseAvailability(type?: ResourceType, date?: string, minCapacity?: number): Observable<Resource[]> {
    let params = new HttpParams();
    if (type) params = params.set('type', type);
    if (date) params = params.set('date', date);
    if (minCapacity != null) params = params.set('minCapacity', minCapacity.toString());
    return this.http.get<Resource[]>(`${this.base}/availability/browse`, { params });
  }

  // ── Reservations ───────────────────────────────────────────────────────────

  /** Admin: all reservations; Instructor: own reservations */
  getReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.base}/reservations`);
  }

  getReservation(id: string): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.base}/reservations/${id}`);
  }

  getPendingReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.base}/reservations/pending`);
  }

  /** Returns other instructors' confirmed future reservations available for swapping */
  getSwappableReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.base}/reservations/swappable`);
  }

  getRecurrenceGroup(groupId: string): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(`${this.base}/reservations/group/${groupId}`);
  }

  createReservation(body: CreateReservationRequest): Observable<Reservation> {
    return this.http.post<Reservation>(`${this.base}/reservations`, body);
  }

  createRecurringReservation(body: CreateRecurrenceReservationRequest): Observable<RecurrenceBookingResult> {
    return this.http.post<RecurrenceBookingResult>(`${this.base}/reservations/recurrence`, body);
  }

  approveReservation(id: string): Observable<Reservation> {
    return this.http.post<Reservation>(`${this.base}/reservations/${id}/approve`, {});
  }

  rejectReservation(id: string, reason: string): Observable<Reservation> {
    return this.http.post<Reservation>(`${this.base}/reservations/${id}/reject`, { reason });
  }

  cancelReservation(id: string, reason?: string): Observable<Reservation> {
    const body: any = {};
    if (reason) body.reason = reason;
    return this.http.post<Reservation>(`${this.base}/reservations/${id}/cancel`, body);
  }

  cancelRecurrenceGroup(groupId: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/reservations/group/${groupId}`);
  }

  // ── Maintenance Windows ────────────────────────────────────────────────────

  getMaintenanceByResource(resourceId: string): Observable<MaintenanceWindow[]> {
    return this.http.get<MaintenanceWindow[]>(`${this.base}/maintenance/resource/${resourceId}`);
  }

  createMaintenanceWindow(body: CreateMaintenanceWindowRequest): Observable<MaintenanceWindow> {
    return this.http.post<MaintenanceWindow>(`${this.base}/maintenance`, body);
  }

  deleteMaintenanceWindow(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/maintenance/${id}`);
  }

  // ── Waitlist ───────────────────────────────────────────────────────────────

  getMyWaitlist(): Observable<WaitlistEntry[]> {
    return this.http.get<WaitlistEntry[]>(`${this.base}/waitlist`);
  }

  joinWaitlist(body: CreateWaitlistRequest): Observable<WaitlistEntry> {
    return this.http.post<WaitlistEntry>(`${this.base}/waitlist`, body);
  }

  leaveWaitlist(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/waitlist/${id}`);
  }

  // ── Check-In ───────────────────────────────────────────────────────────────

  getQrCode(reservationId: string): string {
    // Returns a direct URL to use in <img [src]>. The interceptor will add the Authorization header.
    // For simpler use, we expose the URL so components can call it directly.
    return `${this.base}/checkin/${reservationId}/qr`;
  }

  getQrCodeBlob(reservationId: string): Observable<Blob> {
    return this.http.get(`${this.base}/checkin/${reservationId}/qr`, { responseType: 'blob' });
  }

  scanQrToken(token: string): Observable<CheckInEvent> {
    const body: ScanTokenRequest = { token };
    return this.http.post<CheckInEvent>(`${this.base}/checkin/scan`, body);
  }

  getCheckInByReservation(reservationId: string): Observable<CheckInEvent> {
    return this.http.get<CheckInEvent>(`${this.base}/checkin/reservation/${reservationId}`);
  }

  // ── Swap Requests ──────────────────────────────────────────────────────────

  getMySwaps(): Observable<SwapRequest[]> {
    return this.http.get<SwapRequest[]>(`${this.base}/swaps`);
  }

  requestSwap(reservationId: string, body: CreateSwapRequest): Observable<SwapRequest> {
    return this.http.post<SwapRequest>(`${this.base}/swaps`, { ...body, reservationId });
  }

  acceptSwap(id: string): Observable<SwapRequest> {
    return this.http.post<SwapRequest>(`${this.base}/swaps/${id}/accept`, {});
  }

  rejectSwap(id: string, note?: string): Observable<SwapRequest> {
    return this.http.post<SwapRequest>(`${this.base}/swaps/${id}/reject`, { note });
  }

  // ── Instructor Profile ─────────────────────────────────────────────────────

  getMyProfile(): Observable<InstructorProfile> {
    return this.http.get<InstructorProfile>(`${this.base}/profile/me`);
  }

  getInstructorProfile(instructorId: string): Observable<InstructorProfile> {
    return this.http.get<InstructorProfile>(`${this.base}/profile/${instructorId}`);
  }

  getLeaderboard(): Observable<InstructorProfile[]> {
    return this.http.get<InstructorProfile[]>(`${this.base}/profile/leaderboard`);
  }

  adjustScore(instructorId: string, body: AdjustScoreRequest): Observable<InstructorProfile> {
    return this.http.patch<InstructorProfile>(`${this.base}/profile/${instructorId}/score`, body);
  }

  // ── Statistics ─────────────────────────────────────────────────────────────

  getResourceStatistics(resourceId: string, from?: string, to?: string): Observable<ResourceStatistics> {
    let params = new HttpParams();
    if (from) params = params.set('from', from);
    if (to)   params = params.set('to', to);
    return this.http.get<ResourceStatistics>(`${this.base}/stats/resources/${resourceId}`, { params });
  }

  getPlatformStats(): Observable<Record<string, any>> {
    return this.http.get<Record<string, any>>(`${this.base}/stats/platform`);
  }

  getInstructorStats(): Observable<Record<string, any>> {
    return this.http.get<Record<string, any>>(`${this.base}/stats/instructors`);
  }

  getUnderutilizedResources(): Observable<Resource[]> {
    return this.http.get<Resource[]>(`${this.base}/stats/underutilized`);
  }

  // ── Schedule Export ────────────────────────────────────────────────────────

  downloadSchedulePdf(from?: string, to?: string): Observable<Blob> {
    let params = new HttpParams();
    if (from) params = params.set('from', from);
    if (to)   params = params.set('to', to);
    return this.http.get(`${this.base}/export/pdf`, { params, responseType: 'blob' });
  }

  getIcalUrl(instructorId: string): string {
    return `${this.base}/export/ical/${instructorId}`;
  }
}
