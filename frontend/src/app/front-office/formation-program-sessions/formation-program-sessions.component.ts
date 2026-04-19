import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Formation } from 'src/app/core/models/formation.model';
import { FormationSession } from 'src/app/core/models/formation-session.model';
import { FormationPublicService } from 'src/app/core/services/formation-public.service';

type SessionFilter = 'ALL' | 'TODAY' | 'UPCOMING' | 'COMPLETED' | 'IN_PROGRESS';

@Component({
  selector: 'app-formation-program-sessions',
  templateUrl: './formation-program-sessions.component.html',
  styleUrls: ['./formation-program-sessions.component.css']
})
export class FormationProgramSessionsComponent implements OnInit, OnDestroy {

  formation: Formation | null = null;
  sessions: FormationSession[] = [];

  loading = false;
  sessionsLoading = false;

  errorMessage = '';
  sessionsErrorMessage = '';

  now: Date = new Date();
  private clockInterval: any;

  todaySessions: FormationSession[] = [];
  currentSession: FormationSession | null = null;
  nextTodaySession: FormationSession | null = null;

  selectedSessionId: number | null = null;
  activeFilter: SessionFilter = 'ALL';

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

    this.startClock();
    this.loadFormation(id);
    this.loadSessions(id);
  }

  ngOnDestroy(): void {
    if (this.clockInterval) {
      clearInterval(this.clockInterval);
    }
  }

  startClock(): void {
    this.now = new Date();

    this.clockInterval = setInterval(() => {
      this.now = new Date();
      this.computeTodaySessionState();
    }, 1000);
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
        console.error('Error while loading sessions page:', error);
        this.errorMessage = 'Failed to load training sessions page.';
        this.loading = false;
      }
    });
  }

  loadSessions(formationId: number): void {
    this.sessionsLoading = true;
    this.sessionsErrorMessage = '';

    this.formationPublicService.getFormationSessions(formationId).subscribe({
      next: (data: FormationSession[]) => {
        this.sessions = data;
        this.computeTodaySessionState();
        this.sessionsLoading = false;
      },
      error: (error: any) => {
        console.error('Error while loading sessions:', error);

        if (error?.error?.message) {
          this.sessionsErrorMessage = error.error.message;
        } else if (typeof error?.error === 'string') {
          this.sessionsErrorMessage = error.error;
        } else {
          this.sessionsErrorMessage = 'Failed to load sessions.';
        }

        this.sessionsLoading = false;
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

  hasSessionToday(): boolean {
    return this.todaySessions.length > 0;
  }

  isSessionCompleted(session: FormationSession): boolean {
    const sessionDate = session.sessionDate;
    const todayStr = this.formatDateOnly(this.now);

    if (sessionDate < todayStr) {
      return true;
    }

    if (sessionDate > todayStr) {
      return false;
    }

    return this.toMinutes(session.endTime) < this.toMinutes(
      `${this.pad(this.now.getHours())}:${this.pad(this.now.getMinutes())}`
    );
  }

  isSessionNow(session: FormationSession): boolean {
    if (session.sessionDate !== this.formatDateOnly(this.now)) {
      return false;
    }

    const currentMinutes = this.toMinutes(
      `${this.pad(this.now.getHours())}:${this.pad(this.now.getMinutes())}`
    );

    return currentMinutes >= this.toMinutes(session.startTime)
      && currentMinutes <= this.toMinutes(session.endTime);
  }

  toggleSessionDetails(sessionId: number): void {
    this.selectedSessionId = this.selectedSessionId === sessionId ? null : sessionId;
  }

  isSessionSelected(sessionId: number): boolean {
    return this.selectedSessionId === sessionId;
  }

  getCompletedSessionsCount(): number {
    return this.sessions.filter(session => this.isSessionCompleted(session)).length;
  }

  getUpcomingSessionsCount(): number {
    return this.sessions.filter(session => !this.isSessionCompleted(session) && !this.isSessionNow(session)).length;
  }

  getRemainingSessionsCount(): number {
    return this.sessions.length - this.getCompletedSessionsCount();
  }

  getProgressPercentage(): number {
    if (this.sessions.length === 0) {
      return 0;
    }

    return Math.round((this.getCompletedSessionsCount() / this.sessions.length) * 100);
  }

  setFilter(filter: SessionFilter): void {
    this.activeFilter = filter;
  }

  getFilteredSessions(): FormationSession[] {
    switch (this.activeFilter) {
      case 'TODAY':
        return this.sessions.filter(
          session => session.sessionDate === this.formatDateOnly(this.now)
        );

      case 'UPCOMING':
        return this.sessions.filter(
          session => !this.isSessionCompleted(session) && !this.isSessionNow(session)
        );

      case 'COMPLETED':
        return this.sessions.filter(
          session => this.isSessionCompleted(session)
        );

      case 'IN_PROGRESS':
        return this.sessions.filter(
          session => this.isSessionNow(session)
        );

      default:
        return this.sessions;
    }
  }

  getNextSessionOverall(): FormationSession | null {
    const todayStr = this.formatDateOnly(this.now);
    const currentMinutes = this.toMinutes(
      `${this.pad(this.now.getHours())}:${this.pad(this.now.getMinutes())}`
    );

    const upcoming = this.sessions.filter(session => {
      if (session.sessionDate > todayStr) {
        return true;
      }

      if (session.sessionDate === todayStr) {
        return this.toMinutes(session.startTime) > currentMinutes;
      }

      return false;
    });

    if (upcoming.length === 0) {
      return null;
    }

    return upcoming.sort((a, b) => {
      if (a.sessionDate === b.sessionDate) {
        return this.toMinutes(a.startTime) - this.toMinutes(b.startTime);
      }

      return a.sessionDate.localeCompare(b.sessionDate);
    })[0];
  }

  goBackToDashboard(): void {
    if (!this.formation) {
      return;
    }

    this.router.navigate(['/formations', this.formation.id, 'program-space']);
  }

  goBackToMyPrograms(): void {
    this.router.navigate(['/my-enrolled-formations']);
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