import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ResourceManagementService } from '../resource-management.service';
import { Resource, ResourceType, MaintenanceStatus } from '../resource-management.model';

@Component({
  standalone: false,
  selector: 'app-underutilized',
  templateUrl: './underutilized.component.html',
  styleUrls: ['./underutilized.component.css']
})
export class UnderutilizedComponent implements OnInit {
  resources: Resource[] = [];
  loading = false;
  error = '';

  constructor(private svc: ResourceManagementService, private router: Router) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';
    this.svc.getUnderutilizedResources().subscribe({
      next: (data) => { this.resources = data; this.loading = false; },
      error: () => { this.error = 'Failed to load underutilized resources.'; this.loading = false; }
    });
  }

  viewStats(id: string): void {
    this.router.navigate(['/back-office/admin/resources', id, 'statistics']);
  }

  typeLabel(type: ResourceType): string {
    const map: Record<ResourceType, string> = {
      CLASSROOM: 'Classroom', COMPUTER_LAB: 'Computer Lab', AMPHITHEATER: 'Amphitheater',
      PROJECTOR: 'Projector', LAPTOP: 'Laptop', SMARTBOARD: 'Smartboard', CUSTOM_EQUIPMENT: 'Custom Equipment'
    };
    return map[type] ?? type;
  }

  maintenanceLabel(s: MaintenanceStatus): string {
    const map: Record<MaintenanceStatus, string> = {
      OPERATIONAL: 'Operational', UNDER_MAINTENANCE: 'Under Maintenance', OUT_OF_SERVICE: 'Out of Service'
    };
    return map[s];
  }
}
