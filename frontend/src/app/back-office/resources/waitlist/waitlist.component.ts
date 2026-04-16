import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourceManagementService } from '../resource-management.service';
import { Resource, WaitlistEntry, WaitlistStatus } from '../resource-management.model';

@Component({
  standalone: false,
  selector: 'app-waitlist',
  templateUrl: './waitlist.component.html',
  styleUrls: ['./waitlist.component.css']
})
export class WaitlistComponent implements OnInit {
  resource: Resource | null = null;
  entries: WaitlistEntry[] = [];
  filtered: WaitlistEntry[] = [];
  loading = false;
  error = '';
  selectedStatus: WaitlistStatus | 'ALL' = 'ALL';
  actionInProgress: string | null = null;

  readonly statusOptions: Array<WaitlistStatus | 'ALL'> = [
    'ALL', 'WAITING', 'NOTIFIED', 'EXPIRED', 'CONVERTED'
  ];

  constructor(
    private svc: ResourceManagementService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id') || '';
    this.loading = true;
    if (id) {
      this.svc.getResource(id).subscribe({
        next: (r) => {
          this.resource = r;
          this.loadWaitlist();
        },
        error: () => {
          this.error = 'Resource not found.';
          this.loading = false;
        }
      });
    } else {
      // Instructor view: load own waitlist
      this.loadWaitlist();
    }
  }

  loadWaitlist(): void {
    this.svc.getMyWaitlist().subscribe({
      next: (entries) => {
        this.entries = this.resource
          ? entries.filter(e => e.resourceId === this.resource!.id)
          : entries;
        this.applyFilter();
        this.loading = false;
      },
      error: () => {
        this.entries = [];
        this.applyFilter();
        this.loading = false;
      }
    });
  }

  applyFilter(): void {
    this.filtered = this.selectedStatus === 'ALL'
      ? [...this.entries]
      : this.entries.filter(e => e.status === this.selectedStatus);
  }

  onStatusChange(): void { this.applyFilter(); }

  leaveWaitlist(id: string): void {
    this.actionInProgress = id;
    this.svc.leaveWaitlist(id).subscribe({
      next: () => {
        this.entries = this.entries.filter(e => e.id !== id);
        this.applyFilter();
        this.actionInProgress = null;
      },
      error: () => { this.actionInProgress = null; }
    });
  }

  goBack(): void {
    this.router.navigate(['/back-office/admin/resources']);
  }

  statusLabel(status: WaitlistStatus): string {
    const map: Record<WaitlistStatus, string> = {
      WAITING: 'Waiting',
      NOTIFIED: 'Notified',
      EXPIRED: 'Expired',
      CONVERTED: 'Converted to Reservation'
    };
    return map[status];
  }

  statusClass(status: WaitlistStatus): string {
    const map: Record<WaitlistStatus, string> = {
      WAITING: 'status-waiting',
      NOTIFIED: 'status-notified',
      EXPIRED: 'status-expired',
      CONVERTED: 'status-converted'
    };
    return map[status];
  }

  formatDate(dt: string): string {
    if (!dt) return '—';
    return new Date(dt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
  }

  countByStatus(status: WaitlistStatus): number {
    return this.entries.filter(e => e.status === status).length;
  }

  canLeave(entry: WaitlistEntry): boolean {
    return entry.status === 'WAITING' || entry.status === 'NOTIFIED';
  }
}
