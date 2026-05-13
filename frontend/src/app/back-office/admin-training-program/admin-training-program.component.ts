import { Component, OnInit } from '@angular/core';
import { Formation } from 'src/app/core/models/formation.model';
import { AdminFormationService } from 'src/app/core/services/admin-formation.service';

@Component({
  selector: 'app-admin-training-program',
  templateUrl: './admin-training-program.component.html',
  styleUrls: ['./admin-training-program.component.css']
})
export class AdminTrainingProgramComponent implements OnInit {

  formations: Formation[] = [];
  filteredFormations: Formation[] = [];

  loading = false;
  actionLoadingId: number | null = null;
  errorMessage = '';
  successMessage = '';

  searchTerm = '';
  statusFilter: 'ALL' | 'ACTIVE' | 'ARCHIVED' = 'ALL';
  levelFilter = 'ALL';

  constructor(private adminFormationService: AdminFormationService) {}

  ngOnInit(): void {
    this.loadFormations();
  }

  loadFormations(): void {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.adminFormationService.getAllFormations().subscribe({
      next: (data) => {
        this.formations = data || [];
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading admin formations:', err);
        this.errorMessage = 'Failed to load training programs.';
        this.loading = false;
      }
    });
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
      result = result.filter(f =>
        this.statusFilter === 'ARCHIVED' ? !!f.archived : !f.archived
      );
    }

    if (this.levelFilter !== 'ALL') {
      result = result.filter(f =>
        (f.level || '').toLowerCase() === this.levelFilter.toLowerCase()
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

  get activePrograms(): number {
    return this.formations.filter(f => !f.archived).length;
  }

  get archivedPrograms(): number {
    return this.formations.filter(f => !!f.archived).length;
  }

  get totalCapacity(): number {
    return this.formations.reduce((sum, f) => sum + (f.capacity || 0), 0);
  }

  getStatusLabel(formation: Formation): string {
    return formation.archived ? 'Archived / Pending' : 'Published';
  }

  archiveFormation(formation: Formation): void {
    if (!formation.id) return;

    this.actionLoadingId = formation.id;
    this.errorMessage = '';
    this.successMessage = '';

    this.adminFormationService.archiveFormation(formation.id).subscribe({
      next: () => {
        this.successMessage = 'Training program archived successfully.';
        this.actionLoadingId = null;
        this.loadFormations();
      },
      error: (err) => {
        console.error('Error archiving formation:', err);
        this.errorMessage = 'Failed to archive training program.';
        this.actionLoadingId = null;
      }
    });
  }

  unarchiveFormation(formation: Formation): void {
    if (!formation.id) return;

    this.actionLoadingId = formation.id;
    this.errorMessage = '';
    this.successMessage = '';

    this.adminFormationService.unarchiveFormation(formation.id).subscribe({
      next: () => {
        this.successMessage = 'Training program approved successfully.';
        this.actionLoadingId = null;
        this.loadFormations();
      },
      error: (err) => {
        console.error('Error unarchiving formation:', err);
        this.errorMessage = 'Failed to approve training program.';
        this.actionLoadingId = null;
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