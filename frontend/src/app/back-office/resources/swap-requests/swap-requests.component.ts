import { Component, OnInit } from '@angular/core';
import { ResourceManagementService } from '../resource-management.service';
import { Reservation, SwapRequest, SwapRequestStatus } from '../resource-management.model';

@Component({
  standalone: false,
  selector: 'app-swap-requests',
  templateUrl: './swap-requests.component.html',
  styleUrls: ['./swap-requests.component.css']
})
export class SwapRequestsComponent implements OnInit {
  swaps: SwapRequest[] = [];
  loading = false;
  error = '';
  actionInProgress: string | null = null;

  // My own reservations (for the "Your Reservation" picker)
  myReservations: Reservation[] = [];
  myReservationsLoading = false;

  // Other instructors' reservations (for the "Target" picker)
  swappableReservations: Reservation[] = [];
  swappableLoading = false;
  targetFilter = '';

  // New swap form
  showNewSwapForm = false;
  selectedMyReservationId = '';
  selectedTargetReservationId = '';
  newNote = '';
  submitting = false;
  submitSuccess = '';

  constructor(private svc: ResourceManagementService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';
    this.svc.getMySwaps().subscribe({
      next: (data) => { this.swaps = data; this.loading = false; },
      error: () => { this.error = 'Failed to load swap requests.'; this.loading = false; }
    });
  }

  openNewSwapForm(): void {
    this.showNewSwapForm = true;
    this.selectedMyReservationId = '';
    this.selectedTargetReservationId = '';
    this.newNote = '';
    this.submitSuccess = '';
    this.error = '';
    this.targetFilter = '';
    this.loadMyReservations();
    this.loadSwappable();
  }

  closeNewSwapForm(): void {
    this.showNewSwapForm = false;
  }

  loadMyReservations(): void {
    this.myReservationsLoading = true;
    this.svc.getReservations().subscribe({
      next: (data) => {
        // Only show active reservations the instructor can offer to swap
        this.myReservations = data.filter(r =>
          (r.status === 'CONFIRMED' || r.status === 'PENDING') &&
          new Date(r.endTime) > new Date()
        );
        this.myReservationsLoading = false;
      },
      error: () => { this.myReservationsLoading = false; }
    });
  }

  loadSwappable(): void {
    this.swappableLoading = true;
    this.svc.getSwappableReservations().subscribe({
      next: (data) => { this.swappableReservations = data; this.swappableLoading = false; },
      error: () => { this.swappableLoading = false; }
    });
  }

  get filteredSwappable(): Reservation[] {
    const f = this.targetFilter.trim().toLowerCase();
    if (!f) return this.swappableReservations;
    return this.swappableReservations.filter(r =>
      (r.resourceName ?? '').toLowerCase().includes(f) ||
      (r.resourceLocation ?? '').toLowerCase().includes(f) ||
      r.instructorId.toLowerCase().includes(f) ||
      (r.sessionTitle ?? '').toLowerCase().includes(f)
    );
  }

  accept(id: string): void {
    this.actionInProgress = id;
    this.svc.acceptSwap(id).subscribe({
      next: (updated) => { this.updateLocal(updated); this.actionInProgress = null; },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to accept swap.';
        this.actionInProgress = null;
      }
    });
  }

  reject(id: string): void {
    this.actionInProgress = id;
    this.svc.rejectSwap(id).subscribe({
      next: (updated) => { this.updateLocal(updated); this.actionInProgress = null; },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to reject swap.';
        this.actionInProgress = null;
      }
    });
  }

  submitNewSwap(): void {
    if (!this.selectedMyReservationId || !this.selectedTargetReservationId) {
      this.error = 'Please select both your reservation and a target reservation.';
      return;
    }
    this.submitting = true;
    this.error = '';
    this.svc.requestSwap(this.selectedMyReservationId, {
      targetReservationId: this.selectedTargetReservationId,
      note: this.newNote.trim() || undefined
    }).subscribe({
      next: (s) => {
        this.swaps.unshift(s);
        this.submitSuccess = 'Swap request sent successfully!';
        this.submitting = false;
        this.selectedMyReservationId = '';
        this.selectedTargetReservationId = '';
        this.newNote = '';
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to create swap request.';
        this.submitting = false;
      }
    });
  }

  private updateLocal(updated: SwapRequest): void {
    const idx = this.swaps.findIndex(s => s.id === updated.id);
    if (idx !== -1) this.swaps[idx] = updated;
  }

  reservationById(id: string): Reservation | undefined {
    return [...this.myReservations, ...this.swappableReservations].find(r => r.id === id);
  }

  statusLabel(status: SwapRequestStatus): string {
    const map: Record<SwapRequestStatus, string> = {
      PENDING: 'Pending', ACCEPTED: 'Accepted', REJECTED: 'Rejected', EXPIRED: 'Expired'
    };
    return map[status];
  }

  statusClass(status: SwapRequestStatus): string {
    const map: Record<SwapRequestStatus, string> = {
      PENDING: 'bg-warning text-dark', ACCEPTED: 'bg-success', REJECTED: 'bg-danger', EXPIRED: 'bg-secondary'
    };
    return map[status];
  }

  formatDate(dt: string | null): string {
    return dt ? new Date(dt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : '—';
  }

  ownerLabel(instructorId: string): string {
    // Shows a short version of the instructor ID until a user service is wired up
    return instructorId.length > 12 ? instructorId.substring(0, 8) + '…' : instructorId;
  }
}
