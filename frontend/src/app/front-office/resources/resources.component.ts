import { Component, OnInit } from '@angular/core';
import { ResourceManagementService } from '../../back-office/resources/resource-management.service';
import {
  Resource,
  ResourceType,
  TeachingSession,
  AvailabilityResponse,
  CreateReservationRequest,
  CreateRecurrenceReservationRequest,
  RecurrenceBookingResult,
  RecurrencePattern
} from '../../back-office/resources/resource-management.model';

@Component({
  standalone: false,
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.css']
})
export class ResourcesComponent implements OnInit {

  // ── Browse state ──────────────────────────────────────────────────────────
  allResources: Resource[] = [];
  filtered: Resource[] = [];
  loadingResources = false;
  resourcesError = '';
  searchTerm = '';
  selectedType: ResourceType | 'ALL' = 'ALL';

  readonly types: Array<ResourceType | 'ALL'> = [
    'ALL', 'CLASSROOM', 'COMPUTER_LAB', 'AMPHITHEATER',
    'PROJECTOR', 'LAPTOP', 'SMARTBOARD', 'CUSTOM_EQUIPMENT'
  ];

  // ── Availability check state ──────────────────────────────────────────────
  checkStartTime = '';
  checkEndTime = '';
  checkType: ResourceType | '' = '';
  checkResult: AvailabilityResponse | null = null;
  checkLoading = false;
  checkError = '';

  // ── My sessions (for reservation dropdowns) ───────────────────────────────
  mySessions: TeachingSession[] = [];
  sessionsLoading = false;

  // ── Single reservation modal ──────────────────────────────────────────────
  showReservationModal = false;
  reservationResourceId = '';
  reservationSessionId = '';
  reservationStart = '';
  reservationEnd = '';
  reservationLoading = false;
  reservationSuccess = '';
  reservationError = '';

  // ── Recurring booking modal ───────────────────────────────────────────────
  showRecurrenceModal = false;
  recurrenceResourceId = '';
  recurrenceSessionId = '';
  recurrencePattern: RecurrencePattern = 'WEEKLY';
  recurrenceDayOfWeek = 'MONDAY';
  recurrenceSlotStart = '';
  recurrenceSlotEnd = '';
  recurrenceEndDate = '';
  recurrenceLoading = false;
  recurrenceResult: RecurrenceBookingResult | null = null;
  recurrenceError = '';

  readonly recurrencePatterns: RecurrencePattern[] = ['WEEKLY', 'BIWEEKLY'];
  readonly daysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

  constructor(private svc: ResourceManagementService) {}

  ngOnInit(): void {
    this.loadResources();
    this.loadMySessions();
  }

  loadMySessions(): void {
    this.sessionsLoading = true;
    this.svc.getMySessions().subscribe({
      next: (data) => { this.mySessions = data; this.sessionsLoading = false; },
      error: () => { this.sessionsLoading = false; }
    });
  }

  // ── Resources ──────────────────────────────────────────────────────────────

  loadResources(): void {
    this.loadingResources = true;
    this.resourcesError = '';
    this.svc.getResources().subscribe({
      next: (data) => {
        this.allResources = data;
        this.applyFilters();
        this.loadingResources = false;
      },
      error: () => {
        this.resourcesError = 'Could not load resources. Make sure the service is running.';
        this.loadingResources = false;
      }
    });
  }

  applyFilters(): void {
    let result = [...this.allResources];
    if (this.selectedType !== 'ALL') {
      result = result.filter(r => r.type === this.selectedType);
    }
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(r => r.name.toLowerCase().includes(term));
    }
    this.filtered = result;
  }

  onSearch(): void { this.applyFilters(); }
  onTypeChange(): void { this.applyFilters(); }

  countByType(...types: ResourceType[]): number {
    return this.allResources.filter(r => types.includes(r.type)).length;
  }

  // ── Availability check ────────────────────────────────────────────────────

  checkAvailability(): void {
    if (!this.checkStartTime || !this.checkEndTime) {
      this.checkError = 'Please select both start and end times.';
      return;
    }
    if (this.checkEndTime <= this.checkStartTime) {
      this.checkError = 'End time must be after start time.';
      return;
    }
    this.checkLoading = true;
    this.checkError = '';
    this.checkResult = null;

    const payload: any = { startTime: this.checkStartTime, endTime: this.checkEndTime };
    if (this.checkType) payload.type = this.checkType;

    this.svc.checkAvailability(payload).subscribe({
      next: (res) => { this.checkResult = res; this.checkLoading = false; },
      error: () => {
        this.checkError = 'Availability check failed. Please try again.';
        this.checkLoading = false;
      }
    });
  }

  // ── Single reservation ────────────────────────────────────────────────────

  openReservationModal(resourceId: string): void {
    this.reservationResourceId = resourceId;
    this.reservationSessionId = '';
    this.reservationStart = this.checkStartTime;
    this.reservationEnd = this.checkEndTime;
    this.reservationSuccess = '';
    this.reservationError = '';
    this.showReservationModal = true;
  }

  closeReservationModal(): void {
    this.showReservationModal = false;
  }

  submitReservation(): void {
    if (!this.reservationSessionId.trim() || !this.reservationStart || !this.reservationEnd) {
      this.reservationError = 'Please fill in all fields.';
      return;
    }
    if (this.reservationEnd <= this.reservationStart) {
      this.reservationError = 'End time must be after start time.';
      return;
    }

    const req: CreateReservationRequest = {
      resourceId: this.reservationResourceId,
      teachingSessionId: this.reservationSessionId.trim(),
      startTime: this.reservationStart,
      endTime: this.reservationEnd
    };

    this.reservationLoading = true;
    this.reservationError = '';
    this.reservationSuccess = '';

    this.svc.createReservation(req).subscribe({
      next: (res) => {
        this.reservationSuccess = `Reservation created! Status: ${res.status}.${res.status === 'PENDING' ? ' Awaiting admin approval.' : ''}`;
        this.reservationLoading = false;
        if (this.checkResult) this.checkAvailability();
      },
      error: (err) => {
        this.reservationError = err?.error?.message || 'Failed to create reservation. The resource may already be booked.';
        this.reservationLoading = false;
      }
    });
  }

  // ── Recurring reservation ─────────────────────────────────────────────────

  openRecurrenceModal(resourceId: string): void {
    this.recurrenceResourceId = resourceId;
    this.recurrenceSessionId = '';
    this.recurrencePattern = 'WEEKLY';
    this.recurrenceDayOfWeek = 'MONDAY';
    this.recurrenceSlotStart = '';
    this.recurrenceSlotEnd = '';
    this.recurrenceEndDate = '';
    this.recurrenceResult = null;
    this.recurrenceError = '';
    this.showRecurrenceModal = true;
  }

  closeRecurrenceModal(): void {
    this.showRecurrenceModal = false;
  }

  submitRecurringReservation(): void {
    if (!this.recurrenceSessionId.trim() || !this.recurrenceSlotStart || !this.recurrenceSlotEnd || !this.recurrenceEndDate) {
      this.recurrenceError = 'Please fill in all required fields.';
      return;
    }

    const req: CreateRecurrenceReservationRequest = {
      resourceId: this.recurrenceResourceId,
      teachingSessionId: this.recurrenceSessionId.trim(),
      pattern: this.recurrencePattern,
      dayOfWeek: this.recurrenceDayOfWeek,
      slotStartTime: this.recurrenceSlotStart + ':00',
      slotEndTime: this.recurrenceSlotEnd + ':00',
      endDate: this.recurrenceEndDate
    };

    this.recurrenceLoading = true;
    this.recurrenceError = '';
    this.recurrenceResult = null;

    this.svc.createRecurringReservation(req).subscribe({
      next: (result) => {
        this.recurrenceResult = result;
        this.recurrenceLoading = false;
      },
      error: (err) => {
        this.recurrenceError = err?.error?.message || 'Failed to create recurring reservation.';
        this.recurrenceLoading = false;
      }
    });
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  resourceById(id: string): Resource | undefined {
    return this.allResources.find(r => r.id === id);
  }

  typeIcon(type: ResourceType): string {
    const map: Record<ResourceType, string> = {
      CLASSROOM: '🏫', COMPUTER_LAB: '🖥️', AMPHITHEATER: '🎭',
      PROJECTOR: '📽️', LAPTOP: '💻', SMARTBOARD: '📋', CUSTOM_EQUIPMENT: '🔧'
    };
    return map[type] ?? '📦';
  }

  typeLabel(type: ResourceType): string {
    const map: Record<ResourceType, string> = {
      CLASSROOM: 'Classroom', COMPUTER_LAB: 'Computer Lab', AMPHITHEATER: 'Amphitheater',
      PROJECTOR: 'Projector', LAPTOP: 'Laptop', SMARTBOARD: 'Smartboard', CUSTOM_EQUIPMENT: 'Custom Equipment'
    };
    return map[type] ?? type;
  }

  tabIcon(type: ResourceType | 'ALL'): string {
    if (type === 'ALL') return '🌐';
    return this.typeIcon(type as ResourceType);
  }

  dayLabel(day: string): string {
    const map: Record<string, string> = {
      MONDAY: 'Monday', TUESDAY: 'Tuesday', WEDNESDAY: 'Wednesday',
      THURSDAY: 'Thursday', FRIDAY: 'Friday', SATURDAY: 'Saturday', SUNDAY: 'Sunday'
    };
    return map[day] ?? day;
  }

  patternLabel(p: RecurrencePattern): string {
    return p === 'WEEKLY' ? 'Weekly' : 'Bi-weekly';
  }
}
