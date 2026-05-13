import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { AssessmentService } from '../../core/services/assessment.service';
import { CourseApiService } from '../../core/services/course-api.service';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-learner-assessment',
  templateUrl: './learner-assessment.component.html',
  styleUrls: ['./learner-assessment.component.css'],
})
export class LearnerAssessmentComponent implements OnInit, OnDestroy {
  assessments: any[] = [];
  courses: any[] = [];
  currentView: 'list' | 'taking' | 'result' | 'review' = 'list';

  selectedAssessment: any = null;
  userAnswers: Record<number, number> = {};
  finalScore = 0;
  loading = false;
  hasPassed = false;
  isCheated = false; // New flag for cheating detection

  correctCount = 0;
  wrongCount = 0;

  currentQuestionIndex = 0;
  timeLeft: number = 0;
  timerInterval: any;

  constructor(
    private assessmentService: AssessmentService,
    private courseApiService: CourseApiService
  ) {}

  // --- SECURITY LOGIC: Tab Switching Protection ---
  @HostListener('document:visibilitychange', ['$event'])
  handleVisibilityChange(event: Event) {
    if (this.currentView === 'taking' && document.hidden) {
      this.handleCheatingDetected();
    }
  }

  @HostListener('window:blur', ['$event'])
  onBlur(event: Event) {
    if (this.currentView === 'taking') {
      this.handleCheatingDetected();
    }
  }

  private handleCheatingDetected() {
    if (this.timerInterval) clearInterval(this.timerInterval);

    this.isCheated = true;
    this.finalScore = 0;
    this.correctCount = 0;
    this.wrongCount = this.getQuestionsArray().length;
    this.hasPassed = false;
    this.currentView = 'result';
  }
  // --- END SECURITY LOGIC ---

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

  private shuffle(array: any[]) {
    if (!array) return [];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  get progressPercentage(): number {
    const total = this.getQuestionsArray().length;
    if (total === 0) return 0;
    return ((this.currentQuestionIndex + 1) / total) * 100;
  }

  getCourseTitle(assessment: any): string {
    const courseId = assessment.course?.id || assessment.courseId;
    if (!courseId) return 'General Assessment';
    const course = this.courses.find((c) => c.id === courseId);
    return course ? course.title : 'Course Loading...';
  }

  startAssessment(a: any) {
    this.loading = true;
    this.isCheated = false; // Reset security flag
    this.assessmentService.getAssessmentById(a.id).subscribe({
      next: (fullAssessment) => {
        if (fullAssessment.questions) {
          fullAssessment.questions = this.shuffle(fullAssessment.questions);
          fullAssessment.questions.forEach((q: any) => {
            if (q.options) q.options = this.shuffle(q.options);
          });
        }
        this.selectedAssessment = fullAssessment;
        this.userAnswers = {};
        this.currentQuestionIndex = 0;
        this.currentView = 'taking';
        this.startTimer(15);
        this.loading = false;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: (err) => {
        console.error("Could not load questions", err);
        alert("Error: Impossible to load questions.");
        this.loading = false;
      }
    });
  }

  submitAssessment() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.loading = true;

    const payload = {
      assessmentId: this.selectedAssessment.id,
      learnerId: 1,
      answers: this.userAnswers,
    };

    this.assessmentService.saveAssessmentResult(payload).subscribe({
      next: (res) => {
        this.finalScore = res.score;
        const qTotal = this.getQuestionsArray().length;
        this.correctCount = res.correctAnswers !== undefined ? res.correctAnswers : Math.round((res.score / this.selectedAssessment.totalScore) * qTotal);
        this.wrongCount = qTotal - this.correctCount;

        this.hasPassed = this.finalScore >= (this.selectedAssessment.totalScore / 2);
        if (this.hasPassed) this.triggerCelebration();
        this.currentView = 'result';
        this.loading = false;
      },
      error: (err) => {
        console.error('Error submitting:', err);
        alert('Error during saving results.');
        this.loading = false;
      },
    });
  }

  goToReview() {
    this.currentQuestionIndex = 0;
    this.currentView = 'review';
  }

  triggerCelebration() {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff']
    });
  }

  getQuestionsArray(): any[] {
    if (!this.selectedAssessment) return [];
    return this.selectedAssessment.questions || this.selectedAssessment.assessmentQuestions || [];
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

  selectOption(questionId: number, optionId: number) { this.userAnswers[questionId] = optionId; }
  nextQuestion() { if (this.currentQuestionIndex < this.getQuestionsArray().length - 1) this.currentQuestionIndex++; }
  prevQuestion() { if (this.currentQuestionIndex > 0) this.currentQuestionIndex--; }

  goBack() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.currentView = 'list';
    this.selectedAssessment = null;
    this.userAnswers = {};
  }

  ngOnDestroy(): void { if (this.timerInterval) clearInterval(this.timerInterval); }
}
