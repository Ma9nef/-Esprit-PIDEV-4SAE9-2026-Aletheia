import { Component, OnInit } from '@angular/core';
import { ResourceManagementService } from '../resource-management.service';

interface TopResource { name: string; count: number; }
interface ActiveInstructor { instructorId: string; count: number; }

@Component({
  standalone: false,
  selector: 'app-platform-stats',
  templateUrl: './platform-stats.component.html',
  styleUrls: ['./platform-stats.component.css']
})
export class PlatformStatsComponent implements OnInit {
  platformStats: Record<string, any> = {};
  instructorStats: Record<string, any> = {};
  loading = false;
  error = '';

  topResources: TopResource[] = [];
  activeInstructors: ActiveInstructor[] = [];

  constructor(private svc: ResourceManagementService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';

    this.svc.getPlatformStats().subscribe({
      next: (data) => {
        this.platformStats = data;
        this.topResources = data['topResources'] ?? [];
        this.loading = false;
      },
      error: () => { this.error = 'Failed to load platform statistics.'; this.loading = false; }
    });

    this.svc.getInstructorStats().subscribe({
      next: (data) => {
        this.instructorStats = data;
        this.activeInstructors = data['mostActive'] ?? [];
      },
      error: () => {}
    });
  }

  statValue(key: string): any {
    return this.platformStats[key] ?? '—';
  }

  maxTopResource(): number {
    return Math.max(...this.topResources.map(r => r.count), 1);
  }

  maxActiveInstructor(): number {
    return Math.max(...this.activeInstructors.map(i => i.count), 1);
  }
}
