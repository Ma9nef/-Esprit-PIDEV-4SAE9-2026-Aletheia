import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssessmentService } from '../../core/services/assessment.service';


@Component({
  selector: 'app-assessment-form',
  templateUrl: './assessment-form.component.html',
  styleUrls: ['./assessment-form.component.css']
})
export class AssessmentFormComponent implements OnInit {
  isEditMode = false;
  assessment: any = {
    title: '',
    type: 'QUIZ',
    totalScore: 0,
    dueDate: '',
    questions: []
  };

  constructor(
    private assessmentService: AssessmentService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      this.assessmentService.getAssessmentById(id).subscribe(data => {
        this.assessment = data;
      });
    }
  }
  addQuestion() {
  if (!this.assessment.questions) this.assessment.questions = [];
  this.assessment.questions.push({
    text: '',
    points: 0,
    options: [] // This empty array triggers the sub-table
  });
}

addOption(qIndex: number) {
  if (!this.assessment.questions[qIndex].options) {
    this.assessment.questions[qIndex].options = [];
  }
  this.assessment.questions[qIndex].options.push({
    optionText: '',
    isCorrect: false
  });
}

removeQuestion(index: number) {
  this.assessment.questions.splice(index, 1);
}

removeOption(qIndex: number, oIndex: number) {
  this.assessment.questions[qIndex].options.splice(oIndex, 1);
}

 



 

  save() {
    if (this.isEditMode) {
      this.assessmentService.updateAssessment(this.assessment.id, this.assessment).subscribe(() => {
        this.router.navigate(['manage-assessments']);
      });
    } else {
      this.assessmentService.createAssessment(this.assessment).subscribe(() => {
        this.router.navigate(['manage-assessments']);
      });
    }
  }

  cancel() {
    this.router.navigate(['manage-assessments']);
  }
}