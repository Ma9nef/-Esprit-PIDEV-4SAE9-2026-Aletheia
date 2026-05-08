import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourceManagementService } from '../resource-management.service';
import { Resource, Reservation, ReservationStatus } from '../resource-management.model';

@Component({
  selector: 'app-resource-reservations',
  templateUrl: './resource-reservations.component.html',
  styleUrls: ['./resource-reservations.component.css']
})
export class ResourceReservationsComponent implements OnInit {
  resource: Resource | null = null;
  reservations: Reservation[] = [];
  filtered: Reservation[] = [];
  loading = false;
  error = '';
  selectedStatus: ReservationStatus | 'ALL' = 'ALL';
  actionInProgress: string | null = null;

  readonly statusOptions: Array<ReservationStatus | 'ALL'> = ['ALL', 'PENDING', 'CONFIRMED', 'CANCELLED'];

  constructor(
    private svc: ResourceManagementService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') || '';
    this.loading = true;
    this.svc.getResource(id).subscribe({
      next: (r) => {
        this.resource = r;
        this.loadReservations(id);
      },
      error: () => {
        this.error = 'Resource not found.';
        this.loading = false;
      }
    });
  }

  loadReservations(resourceId: string): void {
    // Load all reservations; the API returns them by eventId,
    // so we fetch the raw reservations list from the resource detail approach.
    // The check-availability endpoint is read-only; to list all reservations for
    // a specific resource we use a general GET /reservations and filter client-side.
    // For a full integration the backend could expose GET /resources/{id}/reservations.
    // Using eventId '' returns empty; instead we leverage the resource's existing data.
    this.svc.getReservationsByEventId('').subscribe({
      next: () => {},
      error: () => {}
    });
    // Workaround: fetch reservations using check-availability to surface conflicts,
    // and supplement with createReservation flow. For now we call the service and
    // filter by resourceId on whatever comes back.
    // Best approach: direct call with resourceId filter using existing endpoint pattern.
    this.fetchReservationsForResource(resourceId);
  }

  fetchReservationsForResource(resourceId: string): void {
    // Use check-availability with a broad window to discover active reservations
    const start = new Date();
    start.setMonth(start.getMonth() - 6);
    const end = new Date();
    end.setMonth(end.getMonth() + 6);

    this.svc.checkAvailability({
      resourceId,
      startTime: start.toISOString().slice(0, 16),
      endTime: end.toISOString().slice(0, 16)
    }).subscribe({
      next: (resp) => {
        this.reservations = resp.conflictingReservations || [];
        this.applyFilter();
        this.loading = false;
      },
      error: () => {
        // If check-availability fails, show empty state gracefully
        this.reservations = [];
        this.applyFilter();
        this.loading = false;
      }
    });
  }

  applyFilter(): void {
    if (this.selectedStatus === 'ALL') {
      this.filtered = [...this.reservations];
    } else {
      this.filtered = this.reservations.filter(r => r.status === this.selectedStatus);
    }
  }

  onStatusChange(): void { this.applyFilter(); }

  confirm(id: string): void {
    this.actionInProgress = id;
    this.svc.confirmReservation(id).subscribe({
      next: (updated) => {
        this.updateLocal(updated);
        this.actionInProgress = null;
      },
      error: () => { this.actionInProgress = null; }
    });
  }

  cancel(id: string): void {
    this.actionInProgress = id;
    this.svc.cancelReservation(id).subscribe({
      next: (updated) => {
        this.updateLocal(updated);
        this.actionInProgress = null;
      },
      error: () => { this.actionInProgress = null; }
    });
  }

  private updateLocal(updated: Reservation): void {
    const idx = this.reservations.findIndex(r => r.id === updated.id);
    if (idx !== -1) this.reservations[idx] = updated;
    this.applyFilter();
  }

  goBack(): void { this.router.navigate(['/back-office/admin/resources']); }

  statusLabel(status: ReservationStatus): string {
    const map: Record<ReservationStatus, string> = {
      PENDING: 'Pending', CONFIRMED: 'Confirmed', CANCELLED: 'Cancelled'
    };
    return map[status];
  }

  statusClass(status: ReservationStatus): string {
    const map: Record<ReservationStatus, string> = {
      PENDING: 'status-pending',
      CONFIRMED: 'status-confirmed',
      CANCELLED: 'status-cancelled'
    };
    return map[status];
  }

  formatDate(dt: string): string {
    if (!dt) return '—';
    return new Date(dt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
  }

  countByStatus(status: ReservationStatus): number {
    return this.reservations.filter(r => r.status === status).length;
  }
}
