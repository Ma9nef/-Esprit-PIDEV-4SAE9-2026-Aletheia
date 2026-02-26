import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// 1. Imports for Assessment
import { AssessmentService } from '../../core/services/assessment.service';
import { Assessment } from '../../core/models/assessment.model';

// 2. Imports for Course
import { CourseApiService, CoursePublicDTO } from '../../core/services/course-api.service';

@Component({
  selector: 'app-manage-assessments',
  templateUrl: './manage-assessments.component.html',
  styleUrls: ['./manage-assessments.component.css']
})
export class ManageAssessmentsComponent implements OnInit {
  assessments: Assessment[] = [];
  courses: CoursePublicDTO[] = [];
  searchTerm: string = '';

  constructor(
    private assessmentService: AssessmentService,
    private courseApiService: CourseApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCourses(); // Load courses first, then assessments
  }

  loadData() {
    console.log('Loading assessments...');
    this.assessmentService.getAllAssessments().subscribe({
      next: (data) => {
        this.assessments = data;
        console.log('All assessments loaded:', this.assessments);
        
        if (this.assessments.length > 0) {
          console.log('First assessment DETAILED structure:', JSON.stringify(this.assessments[0], null, 2));
          
          // Check each assessment for course data
          this.assessments.forEach((assessment, index) => {
            console.log(`Assessment ${index} (${assessment.title}):`, {
              hasCourse: !!assessment.course,
              hasCourseId: !!assessment.courseId,
              hasCourse_id: !!assessment.course_id,
              courseObject: assessment.course,
              courseId: assessment.courseId,
              course_id: assessment.course_id,
              fullObject: assessment
            });
          });
        } else {
          console.log('No assessments loaded');
        }
      },
      error: (err) => {
        console.error('Error loading assessments', err);
      }
    });
  }

  loadCourses() {
    console.log('Loading courses...');
    this.courseApiService.getAllPublicCourses().subscribe({
      next: (data) => {
        this.courses = data;
        console.log('Courses loaded:', this.courses);
        
        if (this.courses.length > 0) {
          console.log('Available course IDs:', this.courses.map(c => c.id));
        } else {
          console.log('No courses loaded - this might be the issue!');
        }
        
        this.loadData(); // Load assessments after courses are loaded
      },
      error: (err) => {
        console.error('Error loading courses', err);
        this.loadData(); // Still load assessments even if courses fail
      }
    });
  }

  // Helper function to extract course ID regardless of the structure
  getCourseId(assessment: Assessment): number | null {
    console.log('Getting course ID for assessment:', assessment.title, assessment);
    
    if (assessment.course?.id) {
      console.log('Found course.id:', assessment.course.id);
      return assessment.course.id;
    } else if (assessment.courseId) {
      console.log('Found courseId:', assessment.courseId);
      return assessment.courseId;
    } else if (assessment.course_id) {
      console.log('Found course_id:', assessment.course_id);
      return assessment.course_id;
    }
    
    console.log('No course ID found for assessment:', assessment.title);
    return null;
  }

  // Get course name for display
  getCourseName(assessment: Assessment): string {
    const courseId = this.getCourseId(assessment);
    console.log(`Looking for course with ID ${courseId} in courses list:`, this.courses);
    
    if (!courseId) return 'Not Assigned';
    
    const course = this.courses.find(c => c.id === courseId);
    console.log('Found course:', course);
    
    return course ? course.title : 'Unknown ID';
  }

  // Get course description for tooltip
  getCourseDescription(assessment: Assessment): string {
    const courseId = this.getCourseId(assessment);
    if (!courseId) return '';
    const course = this.courses.find(c => c.id === courseId);
    return course ? course.description : '';
  }

  delete(id: number) {
    if(confirm('Are you sure you want to delete this record?')) {
      this.assessmentService.deleteAssessment(id).subscribe({
        next: () => {
          this.loadData();
        },
        error: (err) => {
          console.error('Error deleting assessment', err);
        }
      });
    }
  }

  copy(assessment: Assessment) {
    // Create a deep copy to avoid reference issues
    const copyOfAssessment = JSON.parse(JSON.stringify(assessment));
    delete copyOfAssessment.id; // Backend generates new ID
    copyOfAssessment.title = copyOfAssessment.title + " (Copy)";
    
    // Preserve the course relationship
    if (assessment.course?.id) {
      copyOfAssessment.course = { id: assessment.course.id };
      copyOfAssessment.courseId = assessment.course.id;
      copyOfAssessment.course_id = assessment.course.id;
    } else if (assessment.courseId) {
      copyOfAssessment.course = { id: assessment.courseId };
      copyOfAssessment.courseId = assessment.courseId;
      copyOfAssessment.course_id = assessment.courseId;
    } else if (assessment.course_id) {
      copyOfAssessment.course = { id: assessment.course_id };
      copyOfAssessment.courseId = assessment.course_id;
      copyOfAssessment.course_id = assessment.course_id;
    }
    
    this.assessmentService.createAssessment(copyOfAssessment).subscribe({
      next: () => {
        this.loadData();
      },
      error: (err) => {
        console.error('Error copying assessment', err);
      }
    });
  }

  edit(id: number) {
    this.router.navigate(['/edit-assessment', id]);
  }

  navigateToAdd() {
    this.router.navigate(['/add-assessment']);
  }
}