import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Formation } from 'src/app/core/models/formation.model';
import { FormationSession } from 'src/app/core/models/formation-session.model';
import { FormationAttendanceSummary } from 'src/app/core/models/formation-attendance.model';
import { FormationPublicService } from 'src/app/core/services/formation-public.service';

@Component({
  selector: 'app-formation-program-space',
  templateUrl: './formation-program-space.component.html',
  styleUrls: ['./formation-program-space.component.css']
})
export class FormationProgramSpaceComponent implements OnInit {

  formation: Formation | null = null;
  sessions: FormationSession[] = [];
  attendance: FormationAttendanceSummary | null = null;

  loading = false;
  sessionsLoading = false;
  attendanceLoading = false;

  errorMessage = '';
  sessionsErrorMessage = '';
  attendanceErrorMessage = '';

  now: Date = new Date();

  todaySessions: FormationSession[] = [];
  currentSession: FormationSession | null = null;
  nextTodaySession: FormationSession | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formationPublicService: FormationPublicService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.errorMessage = 'Invalid formation id.';
      return;
    }

    this.loadFormation(id);
    this.loadSessionsPreview(id);
    this.loadAttendancePreview(id);
  }

  loadFormation(id: number): void {
    this.loading = true;
    this.errorMessage = '';

    this.formationPublicService.getFormationById(id).subscribe({
      next: (data: Formation) => {
        this.formation = data;
        this.loading = false;
      },
      error: (error: unknown) => {
        console.error('Error while loading program dashboard:', error);
        this.errorMessage = 'Failed to load training program dashboard.';
        this.loading = false;
      }
    });
  }

  loadSessionsPreview(formationId: number): void {
    this.sessionsLoading = true;
    this.sessionsErrorMessage = '';

    this.formationPublicService.getFormationSessions(formationId).subscribe({
      next: (data: FormationSession[]) => {
        this.sessions = data;
        this.computeTodaySessionState();
        this.sessionsLoading = false;
      },
      error: (error: any) => {
        console.error('Error while loading sessions preview:', error);

        if (error?.error?.message) {
          this.sessionsErrorMessage = error.error.message;
        } else if (typeof error?.error === 'string') {
          this.sessionsErrorMessage = error.error;
        } else {
          this.sessionsErrorMessage = 'Failed to load sessions preview.';
        }

        this.sessionsLoading = false;
      }
    });
  }

  loadAttendancePreview(formationId: number): void {
    this.attendanceLoading = true;
    this.attendanceErrorMessage = '';

    this.formationPublicService.getMyAttendance(formationId).subscribe({
      next: (data: FormationAttendanceSummary) => {
        this.attendance = data;
        this.attendanceLoading = false;
      },
      error: (error: any) => {
        console.error('Error while loading attendance preview:', error);

        if (error?.error?.message) {
          this.attendanceErrorMessage = error.error.message;
        } else if (typeof error?.error === 'string') {
          this.attendanceErrorMessage = error.error;
        } else {
          this.attendanceErrorMessage = 'Failed to load attendance preview.';
        }

        this.attendanceLoading = false;
      }
    });
  }

  computeTodaySessionState(): void {
    const todayStr = this.formatDateOnly(this.now);

    this.todaySessions = this.sessions.filter(
      (session) => session.sessionDate === todayStr
    );

    this.currentSession = null;
    this.nextTodaySession = null;

    const currentMinutes = this.toMinutes(
      `${this.pad(this.now.getHours())}:${this.pad(this.now.getMinutes())}`
    );

    for (const session of this.todaySessions) {
      const startMinutes = this.toMinutes(session.startTime);
      const endMinutes = this.toMinutes(session.endTime);

      if (currentMinutes >= startMinutes && currentMinutes <= endMinutes) {
        this.currentSession = session;
        break;
      }
    }

    if (!this.currentSession) {
      const upcoming = this.todaySessions
        .filter(session => this.toMinutes(session.startTime) > currentMinutes)
        .sort((a, b) => this.toMinutes(a.startTime) - this.toMinutes(b.startTime));

      this.nextTodaySession = upcoming.length > 0 ? upcoming[0] : null;
    }
  }

  getUpcomingSessionsCount(): number {
    const todayStr = this.formatDateOnly(this.now);
    const currentMinutes = this.toMinutes(
      `${this.pad(this.now.getHours())}:${this.pad(this.now.getMinutes())}`
    );

    return this.sessions.filter(session => {
      if (session.sessionDate > todayStr) {
        return true;
      }

      if (session.sessionDate === todayStr) {
        return this.toMinutes(session.startTime) > currentMinutes;
      }

      return false;
    }).length;
  }

  goBackToMyPrograms(): void {
    this.router.navigate(['/my-enrolled-formations']);
  }

  goToFormationDetails(): void {
    if (!this.formation) {
      return;
    }

    this.router.navigate(['/formations', this.formation.id]);
  }

  openSessionsPage(): void {
    if (!this.formation) {
      return;
    }

    this.router.navigate(['/formations', this.formation.id, 'program-space', 'sessions']);
  }

  openAttendancePage(): void {
    if (!this.formation) {
      return;
    }

    this.router.navigate(['/formations', this.formation.id, 'program-space', 'attendance']);
  }

  openDocumentsPage(): void {
    if (!this.formation) {
      return;
    }

    this.router.navigate(['/formations', this.formation.id, 'program-space', 'documents']);
  }

  openProductFile(): void {
    const fileUrl = this.formation?.productFileUrl;

    if (!fileUrl) {
      return;
    }

    window.open(fileUrl, '_blank');
  }

  hasProductResource(): boolean {
    return !!this.formation?.productId;
  }

  private formatDateOnly(date: Date): string {
    const year = date.getFullYear();
    const month = this.pad(date.getMonth() + 1);
    const day = this.pad(date.getDate());
    return `${year}-${month}-${day}`;
  }

  private toMinutes(time: string): number {
    const clean = time.length >= 5 ? time.substring(0, 5) : time;
    const [hours, minutes] = clean.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private pad(value: number): string {
    return value.toString().padStart(2, '0');
  }
}