import { Component, OnInit } from '@angular/core';
import { ResourceManagementService } from '../resource-management.service';
import { InstructorProfile } from '../resource-management.model';

@Component({
  standalone: false,
  selector: 'app-instructor-profile',
  templateUrl: './instructor-profile.component.html',
  styleUrls: ['./instructor-profile.component.css']
})
export class InstructorProfileComponent implements OnInit {
  profile: InstructorProfile | null = null;
  loading = false;
  error = '';

  constructor(private svc: ResourceManagementService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';
    this.svc.getMyProfile().subscribe({
      next: (p) => { this.profile = p; this.loading = false; },
      error: () => { this.error = 'Failed to load your profile.'; this.loading = false; }
    });
  }

  get scorePercent(): number {
    return this.profile ? this.profile.reputationScore : 0;
  }

  get scoreColor(): string {
    const s = this.scorePercent;
    if (s >= 80) return '#16a34a';
    if (s >= 50) return '#d97706';
    return '#dc2626';
  }

  get scoreTier(): { label: string; class: string } {
    const s = this.scorePercent;
    if (s >= 90) return { label: 'Elite (auto-confirm)', class: 'tier-elite' };
    if (s >= 80) return { label: 'Trusted', class: 'tier-trusted' };
    if (s >= 50) return { label: 'Standard', class: 'tier-standard' };
    return { label: 'Restricted', class: 'tier-restricted' };
  }

  formatDate(dt: string): string {
    if (!dt) return '—';
    return new Date(dt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
  }
}
