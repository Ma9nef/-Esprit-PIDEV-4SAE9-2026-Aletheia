import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourceManagementService } from '../resource-management.service';
import { Resource, Reservation, ReservationStatus } from '../resource-management.model';

@Component({
  standalone: false,
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
  showRejectModal = false;
  rejectReason = '';
  pendingRejectId = '';
  showCancelModal = false;
  cancelReason = '';
  pendingCancelId = '';

  readonly statusOptions: Array<ReservationStatus | 'ALL'> = [
    'ALL', 'PENDING', 'CONFIRMED', 'CHECKED_IN', 'COMPLETED', 'REJECTED', 'CANCELLED'
  ];

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
        this.loadReservations();
      },
      error: () => {
        this.error = 'Resource not found.';
        this.loading = false;
      }
    });
  }

  loadReservations(): void {
    // Admin loads all reservations; filter by resource client-side
    this.svc.getReservations().subscribe({
      next: (all) => {
        this.reservations = this.resource
          ? all.filter(r => r.resourceId === this.resource!.id)
          : all;
        this.applyFilter();
        this.loading = false;
      },
      error: () => {
        this.reservations = [];
        this.applyFilter();
        this.loading = false;
      }
    });
  }

  applyFilter(): void {
    this.filtered = this.selectedStatus === 'ALL'
      ? [...this.reservations]
      : this.reservations.filter(r => r.status === this.selectedStatus);
  }

  onStatusChange(): void { this.applyFilter(); }

  approve(id: string): void {
    this.actionInProgress = id;
    this.svc.approveReservation(id).subscribe({
      next: (updated) => { this.updateLocal(updated); this.actionInProgress = null; },
      error: () => { this.actionInProgress = null; }
    });
  }

  openRejectModal(id: string): void {
    this.pendingRejectId = id;
    this.rejectReason = '';
    this.showRejectModal = true;
  }

  closeRejectModal(): void {
    this.showRejectModal = false;
    this.pendingRejectId = '';
    this.rejectReason = '';
  }

  confirmReject(): void {
    if (!this.pendingRejectId) return;
    this.actionInProgress = this.pendingRejectId;
    this.svc.rejectReservation(this.pendingRejectId, this.rejectReason).subscribe({
      next: (updated) => { this.updateLocal(updated); this.actionInProgress = null; },
      error: () => { this.actionInProgress = null; }
    });
    this.closeRejectModal();
  }

  openCancelModal(id: string): void {
    this.pendingCancelId = id;
    this.cancelReason = '';
    this.showCancelModal = true;
  }

  closeCancelModal(): void {
    this.showCancelModal = false;
    this.pendingCancelId = '';
    this.cancelReason = '';
  }

  confirmCancel(): void {
    if (!this.pendingCancelId) return;
    this.actionInProgress = this.pendingCancelId;
    this.svc.cancelReservation(this.pendingCancelId, this.cancelReason || undefined).subscribe({
      next: (updated) => { this.updateLocal(updated); this.actionInProgress = null; },
      error: () => { this.actionInProgress = null; }
    });
    this.closeCancelModal();
  }

  private updateLocal(updated: Reservation): void {
    const idx = this.reservations.findIndex(r => r.id === updated.id);
    if (idx !== -1) this.reservations[idx] = updated;
    this.applyFilter();
  }

  goBack(): void { this.router.navigate(['/back-office/admin/resources']); }

  statusLabel(status: ReservationStatus): string {
    const map: Record<ReservationStatus, string> = {
      PENDING: 'Pending',
      CONFIRMED: 'Confirmed',
      CHECKED_IN: 'Checked In',
      COMPLETED: 'Completed',
      REJECTED: 'Rejected',
      CANCELLED: 'Cancelled'
    };
    return map[status];
  }

  statusClass(status: ReservationStatus): string {
    const map: Record<ReservationStatus, string> = {
      PENDING: 'status-pending',
      CONFIRMED: 'status-confirmed',
      CHECKED_IN: 'status-checked-in',
      COMPLETED: 'status-completed',
      REJECTED: 'status-rejected',
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
