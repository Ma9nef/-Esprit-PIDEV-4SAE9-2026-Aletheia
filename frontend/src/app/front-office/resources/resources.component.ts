import { Component, OnInit } from '@angular/core';
import { ResourceManagementService } from '../../back-office/resources/resource-management.service';
import {
  Resource,
  ResourceType,
  AvailabilityCheckResponse,
  CreateReservationRequest
} from '../../back-office/resources/resource-management.model';

@Component({
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
  readonly types: Array<ResourceType | 'ALL'> = ['ALL', 'ROOM', 'DEVICE', 'MATERIAL'];

  // ── Availability check state ──────────────────────────────────────────────
  checkStartTime = '';
  checkEndTime = '';
  checkType: ResourceType | '' = '';
  checkResult: AvailabilityCheckResponse | null = null;
  checkLoading = false;
  checkError = '';

  // ── Reservation state ─────────────────────────────────────────────────────
  reservationResourceId = '';
  reservationEventId = '';
  reservationStart = '';
  reservationEnd = '';
  reservationLoading = false;
  reservationSuccess = '';
  reservationError = '';
  showReservationForm = false;

  constructor(private svc: ResourceManagementService) {}

  ngOnInit(): void {
    this.loadResources();
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

  countByType(type: ResourceType): number {
    return this.allResources.filter(r => r.type === type).length;
  }

  typeIcon(type: ResourceType): string {
    const map: Record<ResourceType, string> = { ROOM: '🏫', DEVICE: '💻', MATERIAL: '📦' };
    return map[type];
  }

  typeLabel(type: ResourceType): string {
    const map: Record<ResourceType, string> = { ROOM: 'Room', DEVICE: 'Device', MATERIAL: 'Material' };
    return map[type];
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

    const payload: any = {
      startTime: this.checkStartTime,
      endTime: this.checkEndTime
    };
    if (this.checkType) {
      payload.type = this.checkType;
    }

    this.svc.checkAvailability(payload).subscribe({
      next: (res) => {
        this.checkResult = res;
        this.checkLoading = false;
      },
      error: () => {
        this.checkError = 'Availability check failed. Please try again.';
        this.checkLoading = false;
      }
    });
  }

  openReservationForm(resourceId: string): void {
    this.reservationResourceId = resourceId;
    this.reservationEventId = '';
    this.reservationStart = this.checkStartTime;
    this.reservationEnd = this.checkEndTime;
    this.reservationSuccess = '';
    this.reservationError = '';
    this.showReservationForm = true;
  }

  closeReservationForm(): void {
    this.showReservationForm = false;
  }

  submitReservation(): void {
    if (!this.reservationEventId.trim() || !this.reservationStart || !this.reservationEnd) {
      this.reservationError = 'Please fill in all fields.';
      return;
    }
    if (this.reservationEnd <= this.reservationStart) {
      this.reservationError = 'End time must be after start time.';
      return;
    }

    const req: CreateReservationRequest = {
      resourceId: this.reservationResourceId,
      eventId: this.reservationEventId.trim(),
      startTime: this.reservationStart,
      endTime: this.reservationEnd
    };

    this.reservationLoading = true;
    this.reservationError = '';
    this.reservationSuccess = '';

    this.svc.createReservation(req).subscribe({
      next: (res) => {
        this.reservationSuccess = `Reservation created successfully! ID: ${res.id}. Status: ${res.status}.`;
        this.reservationLoading = false;
        // Refresh availability result if open
        if (this.checkResult) {
          this.checkAvailability();
        }
      },
      error: (err) => {
        this.reservationError = err?.error?.message || 'Failed to create reservation. The resource may already be booked.';
        this.reservationLoading = false;
      }
    });
  }

  resourceById(id: string): Resource | undefined {
    return this.allResources.find(r => r.id === id);
  }
}
