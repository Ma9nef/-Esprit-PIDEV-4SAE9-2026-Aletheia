import { Component, OnInit } from '@angular/core';
import { ResourceManagementService } from '../resource-management.service';
import { InstructorProfile } from '../resource-management.model';

@Component({
  standalone: false,
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {
  profiles: InstructorProfile[] = [];
  loading = false;
  error = '';

  // Manual score adjustment
  adjustingId: string | null = null;
  adjustDelta = 0;
  adjustReason = '';
  adjusting = false;
  adjustError = '';

  constructor(private svc: ResourceManagementService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';
    this.svc.getLeaderboard().subscribe({
      next: (data) => { this.profiles = data; this.loading = false; },
      error: () => { this.error = 'Failed to load leaderboard.'; this.loading = false; }
    });
  }

  openAdjust(instructorId: string): void {
    this.adjustingId = instructorId;
    this.adjustDelta = 0;
    this.adjustReason = '';
    this.adjustError = '';
  }

  closeAdjust(): void {
    this.adjustingId = null;
    this.adjustError = '';
  }

  submitAdjust(): void {
    if (!this.adjustingId || this.adjustDelta === 0 || !this.adjustReason.trim()) {
      this.adjustError = 'Delta and reason are required.';
      return;
    }
    this.adjusting = true;
    this.svc.adjustScore(this.adjustingId, { delta: this.adjustDelta, reason: this.adjustReason.trim() })
      .subscribe({
        next: (updated) => {
          const idx = this.profiles.findIndex(p => p.instructorId === updated.instructorId);
          if (idx !== -1) this.profiles[idx] = updated;
          this.profiles.sort((a, b) => b.reputationScore - a.reputationScore);
          this.adjusting = false;
          this.closeAdjust();
        },
        error: (err) => {
          this.adjustError = err?.error?.message || 'Adjustment failed.';
          this.adjusting = false;
        }
      });
  }

  tierLabel(score: number): string {
    if (score >= 90) return 'Elite';
    if (score >= 80) return 'Trusted';
    if (score >= 50) return 'Standard';
    return 'Restricted';
  }

  tierClass(score: number): string {
    if (score >= 90) return 'tier-elite';
    if (score >= 80) return 'tier-trusted';
    if (score >= 50) return 'tier-standard';
    return 'tier-restricted';
  }

  formatDate(dt: string): string {
    if (!dt) return '—';
    return new Date(dt).toLocaleDateString();
  }
}
