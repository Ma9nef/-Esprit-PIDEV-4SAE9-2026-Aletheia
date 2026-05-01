import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResourceManagementService } from '../resource-management.service';
import { Resource, MaintenanceWindow } from '../resource-management.model';

@Component({
  standalone: false,
  selector: 'app-maintenance-list',
  templateUrl: './maintenance-list.component.html',
  styleUrls: ['./maintenance-list.component.css']
})
export class MaintenanceListComponent implements OnInit {
  resource: Resource | null = null;
  maintenanceList: MaintenanceWindow[] = [];
  loading = false;
  error = '';
  resourceId = '';

  showDeleteModal = false;
  pendingDeleteId = '';

  constructor(
    private svc: ResourceManagementService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.resourceId = this.route.snapshot.paramMap.get('id') || '';
    if (this.resourceId) {
      this.load();
    }
  }

  load(): void {
    this.loading = true;
    this.error = '';
    this.svc.getResource(this.resourceId).subscribe({
      next: (r) => {
        this.resource = r;
        this.loadMaintenance();
      },
      error: () => {
        this.error = 'Failed to load resource.';
        this.loading = false;
      }
    });
  }

  loadMaintenance(): void {
    this.svc.getMaintenanceByResource(this.resourceId).subscribe({
      next: (data) => {
        this.maintenanceList = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load maintenance windows.';
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/back-office/admin/resources']);
  }

  navigateToCreate(): void {
    this.router.navigate(['/back-office/admin/resources', this.resourceId, 'maintenance', 'new']);
  }

  confirmDelete(id: string): void {
    this.pendingDeleteId = id;
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.pendingDeleteId = '';
    this.showDeleteModal = false;
  }

  deleteMaintenance(): void {
    if (!this.pendingDeleteId) return;
    this.error = '';
    this.svc.deleteMaintenanceWindow(this.pendingDeleteId).subscribe({
      next: () => {
        this.maintenanceList = this.maintenanceList.filter(m => m.id !== this.pendingDeleteId);
        this.cancelDelete();
      },
      error: (err) => {
        this.error = err?.error?.message || err?.message || 'Failed to delete maintenance window.';
        this.cancelDelete();
      }
    });
  }

  formatDateTime(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  isActive(window: MaintenanceWindow): boolean {
    const now = new Date();
    return new Date(window.startTime) <= now && new Date(window.endTime) >= now;
  }

  isUpcoming(window: MaintenanceWindow): boolean {
    return new Date(window.startTime) > new Date();
  }

  isPast(window: MaintenanceWindow): boolean {
    return new Date(window.endTime) < new Date();
  }

  windowStatusLabel(window: MaintenanceWindow): string {
    if (this.isActive(window)) return 'Active';
    if (this.isUpcoming(window)) return 'Upcoming';
    return 'Past';
  }

  windowStatusClass(window: MaintenanceWindow): string {
    if (this.isActive(window)) return 'badge-in-progress';
    if (this.isUpcoming(window)) return 'badge-scheduled';
    return 'badge-secondary';
  }
}
