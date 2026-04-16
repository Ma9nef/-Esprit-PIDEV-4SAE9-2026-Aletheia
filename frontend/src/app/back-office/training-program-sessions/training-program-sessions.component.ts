import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormationSession } from 'src/app/core/models/formation-session.model';
import { InstructorFormationSessionService } from 'src/app/core/services/instructor-formation-session.service';
type SessionFormData = {
  sessionDate: string;
  startTime: string;
  endTime: string;
  room: string;
  topic: string;
};

@Component({
  selector: 'app-training-program-sessions',
  templateUrl: './training-program-sessions.component.html',
  styleUrls: ['./training-program-sessions.component.css']
})
export class TrainingProgramSessionsComponent implements OnInit {
  formationId!: number;

  sessions: FormationSession[] = [];
  loading = false;
  saving = false;
  errorMessage = '';
  successMessage = '';

  showModal = false;
  editingSession: FormationSession | null = null;

  formData: SessionFormData = this.getEmptyForm();

  constructor(
    private route: ActivatedRoute,
    private instructorFormationSessionService: InstructorFormationSessionService
  ) {}

  ngOnInit(): void {
    const formationIdParam = this.route.snapshot.paramMap.get('formationId');
    this.formationId = formationIdParam ? +formationIdParam : 0;
    this.loadSessions();
  }

  getEmptyForm(): SessionFormData {
    return {
      sessionDate: '',
      startTime: '',
      endTime: '',
      room: '',
      topic: ''
    };
  }

  loadSessions(): void {
    if (!this.formationId) {
      this.errorMessage = 'Invalid formation id.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.instructorFormationSessionService.getSessionsByFormation(this.formationId).subscribe({
      next: (data) => {
        this.sessions = data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading sessions:', err);
        this.errorMessage = 'Failed to load sessions.';
        this.loading = false;
      }
    });
  }

  get totalSessions(): number {
    return this.sessions.length;
  }

  get upcomingSessions(): number {
    const today = new Date().toISOString().split('T')[0];
    return this.sessions.filter(s => s.sessionDate >= today).length;
  }

  get completedSessions(): number {
    const today = new Date().toISOString().split('T')[0];
    return this.sessions.filter(s => s.sessionDate < today).length;
  }

  openCreateModal(): void {
    this.editingSession = null;
    this.formData = this.getEmptyForm();
    this.errorMessage = '';
    this.successMessage = '';
    this.showModal = true;
  }

  openEditModal(session: FormationSession): void {
    this.editingSession = session;
    this.formData = {
      sessionDate: session.sessionDate || '',
      startTime: session.startTime || '',
      endTime: session.endTime || '',
      room: session.room || '',
      topic: session.topic || ''
    };
    this.errorMessage = '';
    this.successMessage = '';
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingSession = null;
    this.formData = this.getEmptyForm();
  }

  saveSession(): void {
    if (!this.formData.sessionDate || !this.formData.startTime || !this.formData.endTime) {
      this.errorMessage = 'Date, start time, and end time are required.';
      return;
    }

    if (!this.formData.room.trim() || !this.formData.topic.trim()) {
      this.errorMessage = 'Room and topic are required.';
      return;
    }

    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    const payload: FormationSession = {
      formationId: this.formationId,
      sessionDate: this.formData.sessionDate,
      startTime: this.formData.startTime,
      endTime: this.formData.endTime,
      room: this.formData.room.trim(),
      topic: this.formData.topic.trim()
    };

    const request$ = this.editingSession?.id
      ? this.instructorFormationSessionService.updateSession(this.editingSession.id, payload)
      : this.instructorFormationSessionService.createSession(this.formationId, payload);

    request$.subscribe({
      next: () => {
        const wasEditing = !!this.editingSession;
        this.saving = false;
        this.closeModal();
        this.successMessage = wasEditing
          ? 'Session updated successfully.'
          : 'Session created successfully.';
        this.loadSessions();
      },
      error: (err) => {
        console.error('Error saving session:', err);
        this.errorMessage = 'Failed to save session.';
        this.saving = false;
      }
    });
  }

  deleteSession(sessionId?: number): void {
    if (!sessionId) return;

    const confirmed = window.confirm('Are you sure you want to delete this session?');
    if (!confirmed) return;

    this.instructorFormationSessionService.deleteSession(sessionId).subscribe({
      next: () => {
        this.successMessage = 'Session deleted successfully.';
        this.loadSessions();
      },
      error: (err) => {
        console.error('Error deleting session:', err);
        this.errorMessage = 'Failed to delete session.';
      }
    });
  }
}