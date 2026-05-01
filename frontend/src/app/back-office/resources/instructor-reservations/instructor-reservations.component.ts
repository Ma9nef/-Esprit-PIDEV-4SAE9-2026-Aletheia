import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ResourceManagementService } from '../resource-management.service';
import { Reservation, ReservationStatus } from '../resource-management.model';

@Component({
  standalone: false,
  selector: 'app-instructor-reservations',
  templateUrl: './instructor-reservations.component.html',
  styleUrls: ['./instructor-reservations.component.css']
})
export class InstructorReservationsComponent implements OnInit {
  loading = false;
  error = '';
  icalCopied = false;
  reservations: Reservation[] = [];
  selectedStatus: ReservationStatus | 'ALL' = 'ALL';
  actionInProgressId: string | null = null;

  readonly statusOptions: Array<ReservationStatus | 'ALL'> = [
    'ALL', 'PENDING', 'CONFIRMED', 'CHECKED_IN', 'COMPLETED', 'REJECTED', 'CANCELLED'
  ];

  constructor(
    private readonly svc: ResourceManagementService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadReservations();
  }

  get filteredReservations(): Reservation[] {
    if (this.selectedStatus === 'ALL') return this.reservations;
    return this.reservations.filter(r => r.status === this.selectedStatus);
  }

  onStatusChange(): void { /* filteredReservations getter reacts automatically */ }

  loadReservations(): void {
    this.loading = true;
    this.error = '';
    this.svc.getReservations().subscribe({
      next: (data) => {
        this.reservations = data.sort(
          (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
        );
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Failed to load reservations.';
      }
    });
  }

  cancelReservation(reservation: Reservation): void {
    this.actionInProgressId = reservation.id;
    this.svc.cancelReservation(reservation.id).subscribe({
      next: (updated) => {
        const idx = this.reservations.findIndex(r => r.id === updated.id);
        if (idx !== -1) this.reservations[idx] = updated;
        this.actionInProgressId = null;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to cancel reservation.';
        this.actionInProgressId = null;
      }
    });
  }

  viewQr(reservationId: string): void {
    this.router.navigate(['/back-office/trainer/checkin', reservationId]);
  }

  goToResources(): void {
    this.router.navigate(['/front/resources']);
  }

  downloadSchedule(): void {
    this.svc.downloadSchedulePdf().subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `schedule-${new Date().toISOString().slice(0, 10)}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      },
      error: () => { this.error = 'Failed to download schedule PDF.'; }
    });
  }

  copyIcalLink(): void {
    // instructorId is not directly available on the frontend without a profile call;
    // we derive it from the first reservation's instructorId as a fallback.
    const instructorId = this.reservations[0]?.instructorId;
    if (!instructorId) {
      this.error = 'No reservations found — cannot determine your instructor ID for the iCal link.';
      return;
    }
    const url = `${window.location.origin}${this.svc.getIcalUrl(instructorId)}`;
    navigator.clipboard.writeText(url).then(() => {
      this.icalCopied = true;
      setTimeout(() => this.icalCopied = false, 3000);
    });
  }

  canViewQr(status: ReservationStatus): boolean {
    return status === 'CONFIRMED' || status === 'CHECKED_IN';
  }

  canCancel(status: ReservationStatus): boolean {
    return status === 'PENDING' || status === 'CONFIRMED';
  }

  statusLabel(status: ReservationStatus): string {
    const labels: Record<ReservationStatus, string> = {
      PENDING: 'Pending Approval',
      CONFIRMED: 'Confirmed',
      CHECKED_IN: 'Checked In',
      COMPLETED: 'Completed',
      REJECTED: 'Rejected',
      CANCELLED: 'Cancelled'
    };
    return labels[status];
  }

  statusClass(status: ReservationStatus): string {
    const classes: Record<ReservationStatus, string> = {
      PENDING: 'status-pending',
      CONFIRMED: 'status-confirmed',
      CHECKED_IN: 'status-checked-in',
      COMPLETED: 'status-completed',
      REJECTED: 'status-rejected',
      CANCELLED: 'status-cancelled'
    };
    return classes[status];
  }

  formatDate(value: string | null): string {
    if (!value) return '—';
    return new Date(value).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
  }
}
