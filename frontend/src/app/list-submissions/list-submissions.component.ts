import { Component, OnInit } from '@angular/core';
import { SubmissionService } from '../core/services/submission.service';
import { Submission } from '../core/models/Submission.model';

@Component({
  selector: 'app-list-submissions',
  templateUrl: './list-submissions.component.html',
  styleUrls: ['./list-submissions.component.css']
})
export class ListSubmissionsComponent implements OnInit {
  allSubmissions: any[] = [];
  filteredSubmissions: any[] = [];
  loading: boolean = false;
  selectedIds: Set<number> = new Set();
  
  filter = { search: '', status: 'ALL', minScore: 0 };

  constructor(private submissionService: SubmissionService) {}

  ngOnInit(): void { 
    this.loadData(); 
  }

  loadData() {
    this.loading = true;
    this.submissionService.getAllSubmissions().subscribe({
      next: (res: Submission[]) => {
        this.allSubmissions = res.map(s => {
          // Get user details from nested object
          const firstName = s.user?.prenom || '';
          const lastName = s.user?.nom || '';
          
          // Combine names
          let fullName = (firstName + ' ' + lastName).trim();

          // Fallback if user object is missing or names are empty
          if (!fullName) {
            fullName = s.user?.fullName || `Learner #${s.id}`;
          }

          return {
            ...s,
            userName: fullName,
            // Use the 'feedback' field from your DB (Réussi/Échoué) for the status filter
            displayStatus: s.feedback || (s.score >= 50 ? 'Réussi' : 'Échoué'),
            avatarColor: this.getRandomColor(s.user?.id || s.id)
          };
        });
        this.applyAdvancedFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching submissions:', err);
        this.loading = false;
      }
    });
  }

  applyAdvancedFilters() {
    const searchTerm = this.filter.search.toLowerCase();
    
    this.filteredSubmissions = this.allSubmissions.filter(s => {
      const matchSearch = s.userName.toLowerCase().includes(searchTerm);
      // Compare against the displayStatus we created in loadData
      const matchStatus = this.filter.status === 'ALL' || s.displayStatus === this.filter.status;
      const matchScore = s.score >= this.filter.minScore;
      return matchSearch && matchStatus && matchScore;
    });
  }

  toggleSelect(id: number) {
    this.selectedIds.has(id) ? this.selectedIds.delete(id) : this.selectedIds.add(id);
  }

  toggleSelectAll(event: any) {
    if (event.target.checked) {
      this.filteredSubmissions.forEach(s => this.selectedIds.add(s.id));
    } else {
      this.selectedIds.clear();
    }
  }

  exportToCSV() {
    const headers = ['Learner Name', 'Score', 'Outcome', 'Date'];
    const rows = this.filteredSubmissions.map(s => 
      [s.userName, s.score + '%', s.displayStatus, s.submittedAt].join(',')
    );
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(',') + '\n' + rows.join('\n');
    const link = document.createElement("a");
    link.setAttribute("href", encodeURI(csvContent));
    link.setAttribute("download", "learner_report.csv");
    document.body.appendChild(link);
    link.click();
  }

  deleteSelected() {
    if(confirm(`Delete ${this.selectedIds.size} records?`)) {
      this.allSubmissions = this.allSubmissions.filter(s => !this.selectedIds.has(s.id));
      this.applyAdvancedFilters();
      this.selectedIds.clear();
    }
  }

  private getRandomColor(id: number) {
    const colors = ['#0d6efd', '#6610f2', '#6f42c1', '#d63384', '#fd7e14', '#198754'];
    return colors[id % colors.length] || '#6c757d';
  }
}