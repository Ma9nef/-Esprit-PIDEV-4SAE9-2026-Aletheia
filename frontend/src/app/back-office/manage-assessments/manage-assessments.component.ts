import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AssessmentService } from '../../core/services/assessment.service';
import { Assessment } from '../../core/models/assessment.model';
import { CourseApiService, CoursePublicDTO } from '../../core/services/course-api.service';

import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-manage-assessments',
  templateUrl: './manage-assessments.component.html',
  styleUrls: ['./manage-assessments.component.css']
})
export class ManageAssessmentsComponent implements OnInit {
  // Initialisation à vide pour éviter les erreurs "undefined"
  assessments: Assessment[] = [];
  courses: CoursePublicDTO[] = [];
  searchTerm: string = '';
  
  sortKey: string = 'title';
  sortOrder: 'asc' | 'desc' = 'asc';
  selectedIds: Set<number> = new Set();
  loading: boolean = false;
    @ViewChild('distributionChart') chartCanvas!: ElementRef;
  private searchSubject = new Subject<string>();
  private myChart: any;
  
  stats = { total: 0, avgScore: 0, urgentCount: 0, quizCount: 0 };

  constructor(
    private assessmentService: AssessmentService,
    private courseApiService: CourseApiService,
    private router: Router
  ) {}

  // --- SELECTION HELPERS ---
  toggleAll(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      // select every visible assessment
      this.filteredAndSortedAssessments.forEach(a => {
        if (a.id != null) {
          this.selectedIds.add(a.id);
        }
      });
    } else {
      this.selectedIds.clear();
    }
  }

  toggleSelect(id: number) {
    if (this.selectedIds.has(id)) {
      this.selectedIds.delete(id);
    } else {
      this.selectedIds.add(id);
    }
  }

  bulkDelete() {
    if (this.selectedIds.size === 0) {
      return;
    }
    if (!confirm(`Supprimer ${this.selectedIds.size} évaluation(s) ?`)) {
      return;
    }

    this.loading = true;
    const ids = Array.from(this.selectedIds);
    const calls = ids.map(i => this.assessmentService.deleteAssessment(i));
    forkJoin(calls).subscribe({
      next: () => {
        this.selectedIds.clear();
        this.loadData();
      },
      error: (err) => {
        console.error('Bulk delete failed', err);
        this.loading = false;
      }
    });
  }

  ngOnInit(): void {
    this.loadInitialData();
      this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      this.searchTerm = term;
    });
  }

  loadInitialData() {
    this.loading = true;
    // 1. Charger les cours d'abord
    this.courseApiService.getAllPublicCourses().subscribe({
      next: (data) => {
        this.courses = data || [];
        this.loadData(); // Charger les évaluations après
      },
      error: (err) => {
        console.error('Erreur API Courses:', err);
        this.courses = [];
        this.loadData();
      }
    });
  }
 ngAfterViewInit() {
    // Initializing chart after view loads
    this.initChart();
  }
  onSearchChange(term: string) {
    this.searchSubject.next(term);
  }
   initChart() {
    if (this.myChart) this.myChart.destroy();
    
    // Group assessments by score ranges
    const low = this.assessments.filter(a => (a.totalScore || 0) < 20).length;
    const mid = this.assessments.filter(a => (a.totalScore || 0) >= 20 && (a.totalScore || 0) < 70).length;
    const high = this.assessments.filter(a => (a.totalScore || 0) >= 70).length;

    this.myChart = new Chart(this.chartCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['Easy (<20)', 'Moderate (20-70)', 'Hard (>70)'],
        datasets: [{
          data: [low, mid, high],
          backgroundColor: ['#0dcaf0', '#ffc107', '#dc3545'],
          borderWidth: 0,
          hoverOffset: 15
        }]
      },
      options: {
        cutout: '80%',
        plugins: { legend: { display: false } }
      }
    });
  } getTimeRemainingProgress(dueDate: any): number {
    if (!dueDate) return 0;
    const end = new Date(dueDate).getTime();
    const now = new Date().getTime();
    const start = end - (7 * 24 * 60 * 60 * 1000); // Created 1 week before due
    
    const progress = ((now - start) / (end - start)) * 100;
    return Math.min(Math.max(progress, 0), 100);
    
  }


  loadData() {
    this.assessmentService.getAllAssessments().subscribe({
      next: (data) => {
        this.assessments = data || [];
        this.calculateStats();
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur API Assessments:', err);
        this.assessments = [];
        this.loading = false;
      }
    });
  }

  calculateStats() {
    if (!this.assessments.length) return;
    const now = new Date();
    this.stats.total = this.assessments.length;
    this.stats.quizCount = this.assessments.filter(a => a.type === 'QUIZ').length;
    
    const sum = this.assessments.reduce((acc, curr) => acc + (curr.totalScore || 0), 0);
    this.stats.avgScore = sum / this.stats.total;

    this.stats.urgentCount = this.assessments.filter(a => {
      if (!a.dueDate) return false;
      const diff = new Date(a.dueDate).getTime() - now.getTime();
      return diff > 0 && diff < (48 * 60 * 60 * 1000);
    }).length;
  }

  // --- LOGIQUE D'AFFICHAGE ---
  get filteredAndSortedAssessments() {
    let list = this.assessments.filter(a => 
      a.title?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      a.type?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      this.getCourseName(a).toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    return list.sort((a: any, b: any) => {
      const valA = a[this.sortKey] || '';
      const valB = b[this.sortKey] || '';
      return (valA < valB ? -1 : 1) * (this.sortOrder === 'asc' ? 1 : -1);
    });
  }

  getCourseName(a: Assessment): string {
    const id = a.course?.id || a.courseId || a.course_id;
    if (!id) return 'N/A';
    const course = this.courses.find(c => c.id === id);
    return course ? course.title : `ID: ${id}`;
  }

  getAssessmentStatus(date: any): { label: string, class: string } {
    if (!date) return { label: 'Active', class: 'bg-success' };
    const due = new Date(date);
    const now = new Date();
    if (due < now) return { label: 'Expired', class: 'bg-danger' };
    return { label: 'Active', class: 'bg-success' };
  }

  // --- ACTIONS ---
  setSort(key: string) {
    this.sortOrder = (this.sortKey === key && this.sortOrder === 'asc') ? 'desc' : 'asc';
    this.sortKey = key;
  }

  delete(id: number) {
    if(confirm('Supprimer cette évaluation ?')) {
      this.assessmentService.deleteAssessment(id).subscribe(() => this.loadData());
    }
  }

  exportCSV() {
    const headers = "Titre,Type,Points,Date\n";
    const rows = this.assessments.map(a => `${a.title},${a.type},${a.totalScore},${a.dueDate}`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    window.open(url);
  }

  edit(id: number) { this.router.navigate(['/edit-assessment', id]); }
  navigateToAdd() { this.router.navigate(['/add-assessment']); }
}