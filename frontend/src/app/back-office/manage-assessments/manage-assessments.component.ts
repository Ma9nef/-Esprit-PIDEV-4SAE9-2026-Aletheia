import { Component, OnInit } from '@angular/core';
import { AssessmentService } from   '../../core/services/assessment.service';
import { Assessment } from  '../../core/models/assessment.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-assessments',
  templateUrl: './manage-assessments.component.html',
  styleUrls: ['./manage-assessments.component.css']
})
export class ManageAssessmentsComponent implements OnInit {
  assessments: Assessment[] = [];
  searchTerm: string = '';

  constructor(
    private assessmentService: AssessmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.assessmentService.getAllAssessments().subscribe(data => {
      this.assessments = data;
    });
  }

  delete(id: number) {
    if(confirm('Are you sure you want to delete this record?')) {
      this.assessmentService.deleteAssessment(id).subscribe(() => {
        this.loadData();
      });
    }
  }


  copy(assessment: Assessment) {
    const copyOfAssessment = { ...assessment };
    delete copyOfAssessment.id; // Backend generates new ID
    copyOfAssessment.title = copyOfAssessment.title + " (Copy)";
    
    this.assessmentService.createAssessment(copyOfAssessment).subscribe(() => {
      this.loadData();
    });
  }

  edit(id: number) {
    this.router.navigate(['/edit-assessment', id]);
  }

  navigateToAdd() {
    this.router.navigate(['/add-assessment']);
  }
}