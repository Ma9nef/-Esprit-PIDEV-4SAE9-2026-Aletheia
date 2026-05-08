import { Component, OnInit } from '@angular/core';
import { Formation } from 'src/app/core/models/formation.model';
import { InstructorFormationService } from 'src/app/core/services/instructor-formation.service';
import { Router } from '@angular/router';
type FormationFormData = {
  title: string;
  description: string;
  duration: number;
  capacity: number;
  location: string;
  startDate: string;
  endDate: string;
  level: string;
  objective: string;
  prerequisites: string;
};

@Component({
  selector: 'app-training-program',
  templateUrl: './training-program.component.html',
  styleUrls: ['./training-program.component.css']
})
export class TrainingProgramComponent implements OnInit {

  formations: Formation[] = [];
  filteredFormations: Formation[] = [];

  loading = false;
  saving = false;
  errorMessage = '';
  successMessage = '';

  searchTerm = '';
  statusFilter: 'ALL' | 'PENDING' | 'PUBLISHED' = 'ALL';
  levelFilter = 'ALL';

  showFormModal = false;
  editingFormation: Formation | null = null;

  formData: FormationFormData = this.getEmptyForm();

  constructor(
    private instructorFormationService: InstructorFormationService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.loadFormations();
  }

  getEmptyForm(): FormationFormData {
    return {
      title: '',
      description: '',
      duration: 1,
      capacity: 1,
      location: '',
      startDate: '',
      endDate: '',
      level: '',
      objective: '',
      prerequisites: ''
    };
  }

  loadFormations(): void {
    this.loading = true;
    this.errorMessage = '';

    this.instructorFormationService.getMyFormations().subscribe({
      next: (data) => {
        this.formations = data || [];
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading formations:', err);
        this.errorMessage = 'Failed to load training programs.';
        this.loading = false;
      }
    });
  }
  goToSessions(formationId?: number): void {
    if (!formationId) return;
    this.router.navigate(['/back-office/trainer/training-programs', formationId, 'sessions']);
  }
  applyFilters(): void {
    let result = [...this.formations];

    const search = this.searchTerm.trim().toLowerCase();
    if (search) {
      result = result.filter(f =>
        (f.title || '').toLowerCase().includes(search) ||
        (f.description || '').toLowerCase().includes(search) ||
        (f.location || '').toLowerCase().includes(search) ||
        (f.level || '').toLowerCase().includes(search)
      );
    }

    if (this.statusFilter !== 'ALL') {
      result = result.filter(f => {
        const pending = !!f.archived;
        return this.statusFilter === 'PENDING' ? pending : !pending;
      });
    }

    if (this.levelFilter !== 'ALL') {
      result = result.filter(
        f => (f.level || '').toLowerCase() === this.levelFilter.toLowerCase()
      );
    }

    this.filteredFormations = result;
  }

  getLevels(): string[] {
    const levels = this.formations
      .map(f => (f.level || '').trim())
      .filter(level => level.length > 0);

    return [...new Set(levels)];
  }

  get totalPrograms(): number {
    return this.formations.length;
  }

  get pendingPrograms(): number {
    return this.formations.filter(f => !!f.archived).length;
  }

  get publishedPrograms(): number {
    return this.formations.filter(f => !f.archived).length;
  }

  get totalCapacity(): number {
    return this.formations.reduce((sum, f) => sum + (f.capacity || 0), 0);
  }

  getStatusLabel(formation: Formation): string {
    return formation.archived ? 'Pending Approval' : 'Published';
  }

  openCreateModal(): void {
    this.editingFormation = null;
    this.formData = this.getEmptyForm();
    this.successMessage = '';
    this.errorMessage = '';
    this.showFormModal = true;
  }

  openEditModal(formation: Formation): void {
    this.editingFormation = formation;
    this.formData = {
      title: formation.title || '',
      description: formation.description || '',
      duration: formation.duration || 1,
      capacity: formation.capacity || 1,
      location: formation.location || '',
      startDate: formation.startDate || '',
      endDate: formation.endDate || '',
      level: formation.level || '',
      objective: formation.objective || '',
      prerequisites: formation.prerequisites || ''
    };
    this.successMessage = '';
    this.errorMessage = '';
    this.showFormModal = true;
  }

  closeModal(): void {
    this.showFormModal = false;
    this.editingFormation = null;
    this.formData = this.getEmptyForm();
  }

  saveFormation(): void {
    if (!this.formData.title.trim()) {
      this.errorMessage = 'Title is required.';
      return;
    }

    if (!this.formData.duration || this.formData.duration < 1) {
      this.errorMessage = 'Duration must be at least 1.';
      return;
    }

    if (!this.formData.capacity || this.formData.capacity < 1) {
      this.errorMessage = 'Capacity must be at least 1.';
      return;
    }

    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    const payload: Partial<Formation> = {
      title: this.formData.title.trim(),
      description: this.formData.description.trim(),
      duration: this.formData.duration,
      capacity: this.formData.capacity,
      location: this.formData.location.trim(),
      startDate: this.formData.startDate || undefined,
      endDate: this.formData.endDate || undefined,
      level: this.formData.level.trim(),
      objective: this.formData.objective.trim(),
      prerequisites: this.formData.prerequisites.trim()
    };

    const request$ = this.editingFormation?.id
      ? this.instructorFormationService.updateFormation(this.editingFormation.id, payload as Formation)
      : this.instructorFormationService.createFormation(payload as Formation);

    request$.subscribe({
      next: () => {
        const wasEditing = !!this.editingFormation;
        this.saving = false;
        this.closeModal();
        this.successMessage = wasEditing
          ? 'Training program updated successfully.'
          : 'Training program created successfully and sent for admin approval.';
        this.loadFormations();
      },
      error: (err) => {
        console.error('Error saving formation:', err);
        this.errorMessage = 'Failed to save training program.';
        this.saving = false;
      }
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.statusFilter = 'ALL';
    this.levelFilter = 'ALL';
    this.applyFilters();
  }
}