import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ResourceManagementService } from '../resource-management.service';
import { Reservation, CheckInEvent } from '../resource-management.model';

@Component({
  standalone: false,
  selector: 'app-checkin',
  templateUrl: './checkin.component.html',
  styleUrls: ['./checkin.component.css']
})
export class CheckinComponent implements OnInit {
  reservation: Reservation | null = null;
  checkInEvent: CheckInEvent | null = null;
  qrImageUrl: SafeUrl | null = null;
  loading = false;
  qrLoading = false;
  error = '';
  reservationId = '';

  // Admin scan mode
  scanToken = '';
  scanning = false;
  scanResult: CheckInEvent | null = null;
  scanError = '';

  constructor(
    private svc: ResourceManagementService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.reservationId = this.route.snapshot.paramMap.get('id') || '';
    if (this.reservationId) {
      this.loadReservation();
    }
  }

  loadReservation(): void {
    this.loading = true;
    this.error = '';
    this.svc.getReservation(this.reservationId).subscribe({
      next: (r) => {
        this.reservation = r;
        this.loading = false;
        if (r.status === 'CONFIRMED' || r.status === 'CHECKED_IN') {
          this.loadQr();
        }
        if (r.status === 'CHECKED_IN') {
          this.loadCheckInEvent();
        }
      },
      error: () => {
        this.error = 'Reservation not found.';
        this.loading = false;
      }
    });
  }

  loadQr(): void {
    this.qrLoading = true;
    this.svc.getQrCodeBlob(this.reservationId).subscribe({
      next: (blob) => {
        const objectUrl = URL.createObjectURL(blob);
        this.qrImageUrl = this.sanitizer.bypassSecurityTrustUrl(objectUrl);
        this.qrLoading = false;
      },
      error: () => { this.qrLoading = false; }
    });
  }

  loadCheckInEvent(): void {
    this.svc.getCheckInByReservation(this.reservationId).subscribe({
      next: (ev) => { this.checkInEvent = ev; },
      error: () => {}
    });
  }

  scan(): void {
    if (!this.scanToken.trim()) return;
    this.scanning = true;
    this.scanError = '';
    this.scanResult = null;

    this.svc.scanQrToken(this.scanToken.trim()).subscribe({
      next: (ev) => {
        this.scanResult = ev;
        this.scanning = false;
        this.scanToken = '';
        // Refresh the reservation status if on reservation page
        if (this.reservationId) this.loadReservation();
      },
      error: (err) => {
        this.scanError = err?.error?.message || 'Scan failed. Token may be invalid or window expired.';
        this.scanning = false;
      }
    });
  }

  formatDate(dt: string | null): string {
    if (!dt) return '—';
    return new Date(dt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
  }
}
