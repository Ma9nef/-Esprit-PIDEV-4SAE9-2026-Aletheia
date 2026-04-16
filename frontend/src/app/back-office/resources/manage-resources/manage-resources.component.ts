import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ResourceManagementService } from '../resource-management.service';
import { Resource, ResourceType, MaintenanceStatus } from '../resource-management.model';

@Component({
  standalone: false,
  selector: 'app-manage-resources',
  templateUrl: './manage-resources.component.html',
  styleUrls: ['./manage-resources.component.css']
})
export class ManageResourcesComponent implements OnInit {
  resources: Resource[] = [];
  filtered: Resource[] = [];
  loading = false;
  error = '';
  searchTerm = '';
  selectedType: ResourceType | 'ALL' = 'ALL';
  selectedMaintenanceStatus: MaintenanceStatus | 'ALL' = 'ALL';
  showDeleteModal = false;
  pendingDeleteId = '';

  readonly types: Array<ResourceType | 'ALL'> = [
    'ALL', 'CLASSROOM', 'COMPUTER_LAB', 'AMPHITHEATER', 'PROJECTOR', 'LAPTOP', 'SMARTBOARD', 'CUSTOM_EQUIPMENT'
  ];
  readonly maintenanceStatuses: Array<MaintenanceStatus | 'ALL'> = [
    'ALL', 'OPERATIONAL', 'UNDER_MAINTENANCE', 'OUT_OF_SERVICE'
  ];

  constructor(private svc: ResourceManagementService, private router: Router) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';
    this.svc.getResources().subscribe({
      next: (data) => {
        this.resources = data;
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load resources. Make sure the ResourceManagement service is running on port 8094.';
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    let result = [...this.resources];
    if (this.selectedType !== 'ALL') {
      result = result.filter(r => r.type === this.selectedType);
    }
    if (this.selectedMaintenanceStatus !== 'ALL') {
      result = result.filter(r => r.maintenanceStatus === this.selectedMaintenanceStatus);
    }
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(r => r.name.toLowerCase().includes(term));
    }
    this.filtered = result;
  }

  onSearch(): void { this.applyFilters(); }
  onTypeChange(): void { this.applyFilters(); }
  onMaintenanceStatusChange(): void { this.applyFilters(); }
  resetFilters(): void {
    this.searchTerm = '';
    this.selectedType = 'ALL';
    this.selectedMaintenanceStatus = 'ALL';
    this.applyFilters();
  }

  navigateToCreate(): void { this.router.navigate(['/back-office/admin/resources/new']); }
  navigateToEdit(id: string): void { this.router.navigate(['/back-office/admin/resources/edit', id]); }
  viewReservations(id: string): void { this.router.navigate(['/back-office/admin/resources', id, 'reservations']); }
  viewStatistics(id: string): void { this.router.navigate(['/back-office/admin/resources', id, 'statistics']); }
  viewMaintenance(id: string): void { this.router.navigate(['/back-office/admin/resources', id, 'maintenance']); }

  confirmDelete(id: string): void { this.pendingDeleteId = id; this.showDeleteModal = true; }
  cancelDelete(): void { this.pendingDeleteId = ''; this.showDeleteModal = false; }

  deleteResource(): void {
    this.svc.deleteResource(this.pendingDeleteId).subscribe({
      next: () => {
        this.resources = this.resources.filter(r => r.id !== this.pendingDeleteId);
        this.applyFilters();
        this.cancelDelete();
      },
      error: () => {
        this.error = 'Failed to delete resource.';
        this.cancelDelete();
      }
    });
  }

  typeLabel(type: ResourceType): string {
    const map: Record<ResourceType, string> = {
      CLASSROOM: 'Classroom',
      COMPUTER_LAB: 'Computer Lab',
      AMPHITHEATER: 'Amphitheater',
      PROJECTOR: 'Projector',
      LAPTOP: 'Laptop',
      SMARTBOARD: 'Smartboard',
      CUSTOM_EQUIPMENT: 'Custom Equipment'
    };
    return map[type] ?? type;
  }

  typeIcon(type: ResourceType): string {
    const map: Record<ResourceType, string> = {
      CLASSROOM: '🏫',
      COMPUTER_LAB: '🖥️',
      AMPHITHEATER: '🎭',
      PROJECTOR: '📽️',
      LAPTOP: '💻',
      SMARTBOARD: '📋',
      CUSTOM_EQUIPMENT: '🔧'
    };
    return map[type] ?? '📦';
  }

  typeBadgeClass(type: ResourceType): string {
    const map: Record<ResourceType, string> = {
      CLASSROOM: 'badge-classroom',
      COMPUTER_LAB: 'badge-computer-lab',
      AMPHITHEATER: 'badge-amphitheater',
      PROJECTOR: 'badge-projector',
      LAPTOP: 'badge-laptop',
      SMARTBOARD: 'badge-smartboard',
      CUSTOM_EQUIPMENT: 'badge-custom'
    };
    return map[type] ?? 'badge-secondary';
  }

  countByType(type: ResourceType): number {
    return this.resources.filter(r => r.type === type).length;
  }

  maintenanceStatusLabel(status: MaintenanceStatus): string {
    const map: Record<MaintenanceStatus, string> = {
      OPERATIONAL: 'Operational',
      UNDER_MAINTENANCE: 'Under Maintenance',
      OUT_OF_SERVICE: 'Out of Service'
    };
    return map[status] ?? status;
  }

  maintenanceStatusClass(status: MaintenanceStatus): string {
    const map: Record<MaintenanceStatus, string> = {
      OPERATIONAL: 'badge-operational',
      UNDER_MAINTENANCE: 'badge-under-maintenance',
      OUT_OF_SERVICE: 'badge-out-of-service'
    };
    return map[status] ?? 'badge-secondary';
  }
}
