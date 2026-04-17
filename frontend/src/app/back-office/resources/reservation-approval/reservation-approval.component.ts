import { Component, OnInit } from '@angular/core';
import { ResourceManagementService } from '../resource-management.service';
import { Reservation } from '../resource-management.model';

@Component({
  standalone: false,
  selector: 'app-reservation-approval',
  templateUrl: './reservation-approval.component.html',
  styleUrls: ['./reservation-approval.component.css']
})
export class ReservationApprovalComponent implements OnInit {
  reservations: Reservation[] = [];
  loading = false;
  error = '';
  actionInProgress: string | null = null;

  showRejectModal = false;
  pendingRejectId = '';
  rejectReason = '';

  constructor(private svc: ResourceManagementService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';
    this.svc.getPendingReservations().subscribe({
      next: (data) => { this.reservations = data; this.loading = false; },
      error: () => { this.error = 'Failed to load pending reservations.'; this.loading = false; }
    });
  }

  approve(id: string): void {
    this.actionInProgress = id;
    this.svc.approveReservation(id).subscribe({
      next: (updated) => {
        this.reservations = this.reservations.filter(r => r.id !== updated.id);
        this.actionInProgress = null;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to approve reservation.';
        this.actionInProgress = null;
      }
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
    if (!this.pendingRejectId || !this.rejectReason.trim()) return;
    this.actionInProgress = this.pendingRejectId;
    this.svc.rejectReservation(this.pendingRejectId, this.rejectReason.trim()).subscribe({
      next: (updated) => {
        this.reservations = this.reservations.filter(r => r.id !== updated.id);
        this.actionInProgress = null;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to reject reservation.';
        this.actionInProgress = null;
      }
    });
    this.closeRejectModal();
  }

  formatDate(dt: string): string {
    return dt ? new Date(dt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : '—';
  }
}
