import { Component, OnInit, OnDestroy } from '@angular/core';
import { AssessmentService } from '../../core/services/assessment.service';
import { CourseApiService } from '../../core/services/course-api.service';

@Component({
  selector: 'app-learner-assessment',
  templateUrl: './learner-assessment.component.html',
  styleUrls: ['./learner-assessment.component.css'],
})
export class LearnerAssessmentComponent implements OnInit, OnDestroy {
  assessments: any[] = [];
  courses: any[] = [];
  currentView: 'list' | 'taking' | 'result' = 'list';

  selectedAssessment: any = null;
  userAnswers: Record<number, number> = {};
  finalScore = 0;
  loading = false;

  currentQuestionIndex = 0;
  timeLeft: number = 0;
  timerInterval: any;

  constructor(
    private assessmentService: AssessmentService,
    private courseApiService: CourseApiService
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData() {
    this.courseApiService.getAllPublicCourses().subscribe((courseData) => {
      this.courses = courseData;
      this.assessmentService.getAllAssessments().subscribe((assessmentData) => {
        this.assessments = assessmentData;
      });
    });
  }

  getCourseTitle(assessment: any): string {
    const courseId = assessment.course?.id || assessment.courseId || assessment.course_id;
    if (!courseId) return 'General Assessment';
    const course = this.courses.find((c) => c.id === courseId);
    return course ? course.title : 'Course Loading...';
  }

  startAssessment(a: any) {
    this.selectedAssessment = a;
    this.userAnswers = {};
    this.currentQuestionIndex = 0;
    this.currentView = 'taking';
    this.startTimer(15);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  ngOnDestroy(): void {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }

  startTimer(minutes: number) {
    this.timeLeft = minutes * 60;
    this.timerInterval = setInterval(() => {
      if (this.timeLeft > 0) this.timeLeft--;
      else this.submitAssessment();
    }, 1000);
  }

  formatTime(): string {
    const mins = Math.floor(this.timeLeft / 60);
    const secs = this.timeLeft % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  selectOption(questionId: number, optionId: number) {
    this.userAnswers[questionId] = optionId;
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.selectedAssessment.questions.length - 1)
      this.currentQuestionIndex++;
  }

  prevQuestion() {
    if (this.currentQuestionIndex > 0) this.currentQuestionIndex--;
  }

  submitAssessment() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.loading = true;

    // Payload préparé pour le SubmissionController du Backend
    const payload = {
      assessmentId: this.selectedAssessment.id,
      learnerId: 1, // À remplacer par l'ID réel de l'utilisateur connecté
      answers: this.userAnswers, // Envoie { "idQuestion": idOption }
    };

    this.assessmentService.saveAssessmentResult(payload).subscribe({
      next: (res) => {
        // Le backend renvoie la Submission créée avec le score calculé
        this.finalScore = res.score; 
        this.currentView = 'result';
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur détaillée :', err);
        alert('Erreur lors de l\'enregistrement. Vérifiez que le Backend tourne sur le port 8081.');
        this.loading = false;
      },
    });
  }

  goBack() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.currentView = 'list';
    this.selectedAssessment = null;
    this.userAnswers = {};
  }
}