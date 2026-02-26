import { Component, OnInit } from '@angular/core';
import { AssessmentService } from '../../core/services/assessment.service';
import { NgClass } from '@angular/common';
@Component({
  selector: 'app-learner-assessment',
  templateUrl: './learner-assessment.component.html',
  styleUrls: ['./learner-assessment.component.css'],

})
export class LearnerAssessmentComponent implements OnInit {
  assessments: any[] = [];
  currentView: string = 'list';
  loading: boolean = false;
 
  constructor(private assessmentService: AssessmentService) {}

  ngOnInit(): void {
    this.loadAssessments();
  }

  loadAssessments() {
    this.assessmentService.getAllAssessments().subscribe(data => {
      this.assessments = data;
    });
  }

  startAssessment(a: any) {
    console.log("Démarrage de l'examen", a);
    // Ajoutez votre logique ici pour changer de vue
  }
}