import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Resource, ResourceStatistics } from '../resource-management.model';
import { ResourceManagementService } from '../resource-management.service';

interface PeakDayData {
  day: string;
  count: number;
  percentage: number;
}

interface HourlyData {
  hour: number;
  count: number;
  percentage: number;
}

@Component({
  standalone: false,
  selector: 'app-resource-statistics',
  templateUrl: './resource-statistics.component.html',
  styleUrls: ['./resource-statistics.component.css']
})
export class ResourceStatisticsComponent implements OnInit {
  resource: Resource | null = null;
  stats: ResourceStatistics | null = null;
  loading = false;
  error: string | null = null;

  selectedDays = 30;
  dayOptions = [7, 30, 60, 90];

  peakDayData: PeakDayData[] = [];
  hourlyData: HourlyData[] = [];

  private resourceId = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: ResourceManagementService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.resourceId = params['id'];
      if (this.resourceId) {
        this.loadData();
      }
    });
  }

  loadData(): void {
    this.loading = true;
    this.error = null;

    this.service.getResource(this.resourceId).subscribe({
      next: (resource) => {
        this.resource = resource;
        this.loadStatistics();
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Failed to load resource details';
        console.error(err);
      }
    });
  }

  loadStatistics(): void {
    const to = new Date();
    const from = new Date(to.getTime() - this.selectedDays * 24 * 60 * 60 * 1000);
    const toStr = to.toISOString().slice(0, 19);
    const fromStr = from.toISOString().slice(0, 19);

    this.service.getResourceStatistics(this.resourceId, fromStr, toStr).subscribe({
      next: (stats) => {
        this.stats = stats;
        this.computeChartData();
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Failed to load statistics';
        console.error(err);
      }
    });
  }

  private computeChartData(): void {
    if (!this.stats) return;

    const dayOrder = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
    const dayMap = this.stats.reservationsByDayOfWeek;
    const maxDayCount = Math.max(...Object.values(dayMap).map(Number), 1);

    this.peakDayData = dayOrder.map(day => ({
      day,
      count: Number(dayMap[day] || 0),
      percentage: maxDayCount > 0 ? (Number(dayMap[day] || 0) / maxDayCount) * 100 : 0
    }));

    // peakHours is a map of "HH:00" → count
    const hourMap = this.stats.peakHours;
    const maxHourCount = Math.max(...Object.values(hourMap).map(Number), 1);

    this.hourlyData = Array.from({ length: 24 }, (_, i) => {
      const key = `${i.toString().padStart(2, '0')}:00`;
      const count = Number(hourMap[key] || 0);
      return {
        hour: i,
        count,
        percentage: maxHourCount > 0 ? (count / maxHourCount) * 100 : 0
      };
    });
  }

  onPeriodChange(days: number): void {
    this.selectedDays = days;
    this.loadStatistics();
  }

  goBack(): void {
    this.router.navigate(['/back-office/admin/resources']);
  }

  formatPercentage(value: number): string {
    return `${Math.round(value)}%`;
  }

  formatHours(value: number): string {
    const hours = Math.floor(value);
    const minutes = Math.round((value - hours) * 60);
    return minutes === 0 ? `${hours}h` : `${hours}h ${minutes}m`;
  }

  dayOfWeekLabel(day: string): string {
    const labels: Record<string, string> = {
      'MONDAY': 'Mon', 'TUESDAY': 'Tue', 'WEDNESDAY': 'Wed',
      'THURSDAY': 'Thu', 'FRIDAY': 'Fri', 'SATURDAY': 'Sat', 'SUNDAY': 'Sun'
    };
    return labels[day] || day;
  }

  hourLabel(hour: number): string {
    return `${hour.toString().padStart(2, '0')}:00`;
  }

  getConfirmedCount(): number { return this.stats?.confirmedReservations || 0; }
  getPendingCount(): number { return this.stats?.pendingReservations || 0; }
  getCancelledCount(): number { return this.stats?.cancelledReservations || 0; }
}
