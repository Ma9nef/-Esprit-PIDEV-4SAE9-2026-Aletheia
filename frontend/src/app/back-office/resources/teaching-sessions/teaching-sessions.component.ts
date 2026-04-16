import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResourceManagementService } from '../resource-management.service';
import { TeachingSession, SessionType, CreateTeachingSessionRequest } from '../resource-management.model';

@Component({
  standalone: false,
  selector: 'app-teaching-sessions',
  templateUrl: './teaching-sessions.component.html',
  styleUrls: ['./teaching-sessions.component.css']
})
export class TeachingSessionsComponent implements OnInit {
  sessions: TeachingSession[] = [];
  loading = false;
  saving = false;
  error = '';
  showForm = false;
  editingId: string | null = null;
  copiedId: string | null = null;

  form!: FormGroup;

  readonly sessionTypes: SessionType[] = ['LECTURE', 'LAB', 'EXAM', 'WORKSHOP'];

  constructor(private svc: ResourceManagementService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    this.load();
  }

  initForm(session?: TeachingSession): void {
    this.form = this.fb.group({
      title: [session?.title || '', [Validators.required, Validators.minLength(3)]],
      courseCode: [session?.courseCode || ''],
      module: [session?.module || ''],
      expectedAttendees: [session?.expectedAttendees || null, [Validators.min(1)]],
      sessionType: [session?.sessionType || 'LECTURE', Validators.required]
    });
  }

  load(): void {
    this.loading = true;
    this.error = '';
    this.svc.getMySessions().subscribe({
      next: (data) => { this.sessions = data; this.loading = false; },
      error: () => { this.error = 'Failed to load sessions.'; this.loading = false; }
    });
  }

  openCreateForm(): void {
    this.editingId = null;
    this.initForm();
    this.showForm = true;
  }

  openEditForm(session: TeachingSession): void {
    this.editingId = session.id;
    this.initForm(session);
    this.showForm = true;
  }

  closeForm(): void {
    this.showForm = false;
    this.editingId = null;
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    this.error = '';

    const payload: CreateTeachingSessionRequest = {
      title: this.form.value.title.trim(),
      sessionType: this.form.value.sessionType,
      ...(this.form.value.courseCode?.trim() ? { courseCode: this.form.value.courseCode.trim() } : {}),
      ...(this.form.value.module?.trim() ? { module: this.form.value.module.trim() } : {}),
      ...(this.form.value.expectedAttendees ? { expectedAttendees: Number(this.form.value.expectedAttendees) } : {})
    };

    const req = this.editingId
      ? this.svc.updateSession(this.editingId, payload)
      : this.svc.createSession(payload);

    req.subscribe({
      next: (s) => {
        if (this.editingId) {
          const idx = this.sessions.findIndex(x => x.id === this.editingId);
          if (idx !== -1) this.sessions[idx] = s;
        } else {
          this.sessions.unshift(s);
        }
        this.saving = false;
        this.closeForm();
      },
      error: () => {
        this.error = 'Failed to save session.';
        this.saving = false;
      }
    });
  }

  sessionTypeLabel(type: SessionType): string {
    const map: Record<SessionType, string> = {
      LECTURE: 'Lecture', LAB: 'Lab', EXAM: 'Exam', WORKSHOP: 'Workshop'
    };
    return map[type];
  }

  sessionTypeClass(type: SessionType): string {
    const map: Record<SessionType, string> = {
      LECTURE: 'badge-lecture', LAB: 'badge-lab', EXAM: 'badge-exam', WORKSHOP: 'badge-workshop'
    };
    return map[type];
  }

  copyId(id: string): void {
    navigator.clipboard.writeText(id).then(() => {
      this.copiedId = id;
      setTimeout(() => { this.copiedId = null; }, 2000);
    });
  }

  formatDate(dt: string): string {
    return dt ? new Date(dt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : '—';
  }

  get f() { return this.form.controls; }
}
