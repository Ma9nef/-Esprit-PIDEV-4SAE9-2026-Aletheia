import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssessmentService } from '../../core/services/assessment.service';
import { CourseApiService, CoursePublicDTO } from '../../core/services/course-api.service';

@Component({
  selector: 'app-assessment-form',
  templateUrl: './assessment-form.component.html',
  styleUrls: ['./assessment-form.component.css']
})
export class AssessmentFormComponent implements OnInit {
  isEditMode = false;
  courses: CoursePublicDTO[] = [];

  assessment: any = {
    title: '',
    type: 'QUIZ',
    totalScore: 0,
    dueDate: '',
    course_id: null, // This binds to the dropdown
    questions: []
  };

  constructor(
    private assessmentService: AssessmentService,
    private courseApiService: CourseApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCourses();

    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      this.assessmentService.getAssessmentById(id).subscribe(data => {
        this.assessment = data;
        
        // ✅ FIX 1: If editing, extract the ID from the nested course object
        // so the dropdown shows the current value.
        if (data.course) {
          this.assessment.course_id = data.course.id;
        } else if (data.courseId) {
          this.assessment.course_id = data.courseId;
        }
      });
    }
  }

  loadCourses() {
    this.courseApiService.getAllPublicCourses().subscribe({
      next: (data) => {
        this.courses = data;
      },
      error: (err) => {
        console.error('Failed to load courses', err);
      }
    });
  }

  addQuestion() {
    if (!this.assessment.questions) this.assessment.questions = [];
    this.assessment.questions.push({
      text: '',
      points: 0,
      options: []
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
    // ✅ FIX 2: Create a payload to format the data for the Backend
    const payload = { ...this.assessment };

    // Transform 'course_id' into the structure Spring Boot likely expects
    if (this.assessment.course_id) {
      // 1. Send as nested object (Most standard for JPA Relationships)
      payload.course = { id: this.assessment.course_id };
      
      // 2. Also send as camelCase 'courseId' just in case your DTO uses that
      payload.courseId = this.assessment.course_id;
    } else {
      payload.course = null;
      payload.courseId = null;
    }

    console.log("Sending Payload:", payload); // Check console to verify structure

    if (this.isEditMode) {
      this.assessmentService.updateAssessment(this.assessment.id, payload).subscribe(() => {
        this.router.navigate(['manage-assessments']);
      });
    } else {
      this.assessmentService.createAssessment(payload).subscribe(() => {
        this.router.navigate(['manage-assessments']);
      });
    }
  }

  cancel() {
    this.router.navigate(['manage-assessments']);
  }
}