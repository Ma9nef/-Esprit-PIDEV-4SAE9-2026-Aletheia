import { Component, OnInit } from '@angular/core';
import { SubmissionService } from '../core/services/submission.service';
import { UserService } from 'src/app/core/services/user.service'; // Ensure this is imported
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-list-submissions',
  templateUrl: './list-submissions.component.html',
  styleUrls: ['./list-submissions.component.css']
})
export class ListSubmissionsComponent implements OnInit {
  allSubmissions: any[] = [];
  filteredSubmissions: any[] = [];
  usersList: any[] = []; // To store the list of students
  loading: boolean = false;
  selectedIds: Set<number> = new Set();
  
  filter = { search: '', status: 'ALL', minScore: 0 };

  constructor(
    private submissionService: SubmissionService,
    private userService: UserService // Inject the user service
  ) {}

  ngOnInit(): void { 
    this.loadData(); 
  }

  loadData() {
    this.loading = true;
    
    // STEP 1: Load all users first
    this.userService.getAllUsers().subscribe({
      next: (userData: any) => {
        // Handle paginated or list response
        this.usersList = userData.content ? userData.content : (Array.isArray(userData) ? userData : []);
        
        // STEP 2: Once users are loaded, load submissions
        this.fetchSubmissions();
      },
      error: (err) => {
        console.error("Could not load users", err);
        this.fetchSubmissions(); // Try loading submissions anyway
      }
    });
  }

  fetchSubmissions() {
    this.submissionService.getAllSubmissions().subscribe({
      next: (res: any[]) => {
        this.allSubmissions = res.map(s => {
          // STEP 3: Manual Join - Find the user in our list by userId
          const student = this.usersList.find(u => u.id === s.userId);
          
          let fullName = "Unknown Learner";
          if (student) {
            fullName = `${student.prenom} ${student.nom}`.trim();
          }

          return {
            ...s,
            userName: fullName,
            // Use 'feedback' for the status text
            displayStatus: s.feedback || (s.score >= 50 ? 'Réussi' : 'Échoué'),
            avatarColor: this.getRandomColor(s.userId || s.id)
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
    const idsToDelete = Array.from(this.selectedIds);
    
    if (confirm(`Are you sure you want to delete ${idsToDelete.length} selected record(s)?`)) {
      this.loading = true;

      // Create an array of delete observables
      const deleteRequests = idsToDelete.map(id => this.submissionService.deleteSubmission(id));

      // forkJoin executes all requests in parallel and waits for all to complete
      forkJoin(deleteRequests).subscribe({
        next: () => {
          // Success: Clear selection and reload data from server
          this.selectedIds.clear();
          this.loadData(); 
          alert('Records deleted successfully');
        },
        error: (err) => {
          console.error('Error deleting records:', err);
          this.loading = false;
          alert('An error occurred while deleting records.');
        }
      });
    }
  }

  // Optional: Add a method for single row deletion
  deleteOne(id: number) {
    if (confirm('Are you sure you want to delete this record?')) {
      this.loading = true;
      this.submissionService.deleteSubmission(id).subscribe({
        next: () => {
          this.loadData();
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        }
      });
    }
  }

  private getRandomColor(id: number) {
    const colors = ['#0d6efd', '#6610f2', '#6f42c1', '#d63384', '#fd7e14', '#198754'];
    return colors[id % colors.length] || '#6c757d';
  }
}