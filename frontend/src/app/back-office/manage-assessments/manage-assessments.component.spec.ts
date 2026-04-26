import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ManageAssessmentsComponent } from './manage-assessments.component';
import { AssessmentService } from '../../core/services/assessment.service';
import { CourseApiService, CoursePublicDTO } from '../../core/services/course-api.service';
import { Assessment } from '../../core/models/assessment.model';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ManageAssessmentsComponent', () => {
  let component: ManageAssessmentsComponent;
  let fixture: ComponentFixture<ManageAssessmentsComponent>;

  // Spies representing our Database Access layer (Services)
  let assessmentServiceSpy: jasmine.SpyObj<AssessmentService>;
  let courseApiServiceSpy: jasmine.SpyObj<CourseApiService>;
  let routerSpy: jasmine.SpyObj<Router>;

const mockCoursesFromDb: CoursePublicDTO[] = [
  { 
    id: 101, 
    title: 'Mathematics', 
    description: 'Math', 
    instructorName: 'Dr. Smith',
    price: 0,              // Added
    durationHours: 10,     // Added
    createdAt: new Date().toISOString()  // Added (Check if your interface spells it createdAt)
  },
  { 
    id: 102, 
    title: 'History', 
    description: 'History', 
    instructorName: 'Prof. Jones',
    price: 0,              // Added
    durationHours: 5,      // Added
    createdAt: new Date().toISOString()  // Added
  }
];

const mockAssessmentsFromDb: Assessment[] = [
  { 
    id: 1, 
    title: 'Algebra Quiz', 
    type: 'QUIZ', 
    totalScore: 80, 
    courseId: 101, 
    dueDate: new Date(), 
    timeLimit: 60 // Added this
  },
  { 
    id: 2, 
    title: 'WW2 Essay', 
    type: 'ASSIGNMENT', 
    totalScore: 20, 
    courseId: 102, 
    dueDate: new Date(), 
    timeLimit: 0 // Added this (0 for no limit)
  }
];
  beforeEach(async () => {
    assessmentServiceSpy = jasmine.createSpyObj('AssessmentService', ['getAllAssessments', 'deleteAssessment']);
    courseApiServiceSpy = jasmine.createSpyObj('CourseApiService', ['getAllPublicCourses']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [ManageAssessmentsComponent],
      providers: [
        { provide: AssessmentService, useValue: assessmentServiceSpy },
        { provide: CourseApiService, useValue: courseApiServiceSpy },
        { provide: Router, useValue: routerSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ManageAssessmentsComponent);
    component = fixture.componentInstance;
  });

  it('should be created successfully', () => {
    expect(component).toBeTruthy();
  });

  describe('Database Data Fetching (Success)', () => {
    it('should populate assessments and courses when the database returns data', () => {
      // GIVEN: Database returns successful results
      courseApiServiceSpy.getAllPublicCourses.and.returnValue(of(mockCoursesFromDb));
      assessmentServiceSpy.getAllAssessments.and.returnValue(of(mockAssessmentsFromDb));

      // WHEN: Component initializes
      fixture.detectChanges(); 

      // THEN: Data should be mapped to the component variables
      expect(component.assessments.length).toBe(2);
      expect(component.courses.length).toBe(2);
      expect(component.loading).toBeFalse();
      expect(component.stats.total).toBe(2);
    });

    it('should calculate the average score correctly based on DB values', () => {
      courseApiServiceSpy.getAllPublicCourses.and.returnValue(of(mockCoursesFromDb));
      assessmentServiceSpy.getAllAssessments.and.returnValue(of(mockAssessmentsFromDb));

      fixture.detectChanges();

      // (80 + 20) / 2 = 50
      expect(component.stats.avgScore).toBe(50);
    });
  });

  describe('Database Data Fetching (Failures/Errors)', () => {
    it('should handle database connection error for assessments', () => {
      // GIVEN: Course API works, but Assessment API crashes (500 error)
      courseApiServiceSpy.getAllPublicCourses.and.returnValue(of(mockCoursesFromDb));
      assessmentServiceSpy.getAllAssessments.and.returnValue(throwError(() => new Error('DB Connection Failed')));

      // Spy on console.error to check if error was logged
      spyOn(console, 'error');

      // WHEN
      fixture.detectChanges();

      // THEN
      expect(component.assessments).toEqual([]);
      expect(component.loading).toBeFalse();
      expect(console.error).toHaveBeenCalled();
    });

    it('should handle case where database returns no assessments (empty set)', () => {
      courseApiServiceSpy.getAllPublicCourses.and.returnValue(of(mockCoursesFromDb));
      assessmentServiceSpy.getAllAssessments.and.returnValue(of([]));

      fixture.detectChanges();

      expect(component.assessments.length).toBe(0);
      expect(component.stats.total).toBe(0);
    });
  });

  describe('Database Modifications (Delete)', () => {
    it('should update the list after a successful database deletion', () => {
      // 1. Initial Load
      courseApiServiceSpy.getAllPublicCourses.and.returnValue(of(mockCoursesFromDb));
      assessmentServiceSpy.getAllAssessments.and.returnValue(of(mockAssessmentsFromDb));
      fixture.detectChanges();

      // 2. Mock user confirming delete
      spyOn(window, 'confirm').and.returnValue(true);
      
      // 3. Mock Delete API success
      assessmentServiceSpy.deleteAssessment.and.returnValue(of(null as any));
      
      // 4. Act
      component.delete(1);

      // 5. Assert: It should call the DB delete and then call reload (getAllAssessments)
      expect(assessmentServiceSpy.deleteAssessment).toHaveBeenCalledWith(1);
      expect(assessmentServiceSpy.getAllAssessments).toHaveBeenCalledTimes(2);
    });
  });

  describe('Real-time Search (Filtering Data)', () => {
    it('should filter data locally without re-querying the database', fakeAsync(() => {
      courseApiServiceSpy.getAllPublicCourses.and.returnValue(of(mockCoursesFromDb));
      assessmentServiceSpy.getAllAssessments.and.returnValue(of(mockAssessmentsFromDb));
      fixture.detectChanges();

      // Type "Algebra" into search
      component.onSearchChange('Algebra');
      tick(300); // Pass debounceTime
      fixture.detectChanges();

      const results = component.filteredAndSortedAssessments;
      expect(results.length).toBe(1);
      expect(results[0].title).toBe('Algebra Quiz');
      // Ensure we didn't call the API again (search is client-side)
      expect(assessmentServiceSpy.getAllAssessments).toHaveBeenCalledTimes(1);
    }));
  });

  describe('Relational Data Mapping', () => {
    it('should map a Course ID from the assessment to a Course Title from the course database', () => {
      component.courses = mockCoursesFromDb;
      const testAssessment = { courseId: 102 } as Assessment;
      
      const courseName = component.getCourseName(testAssessment);
      
      expect(courseName).toBe('History');
    });

    it('should return "N/A" if assessment has no course link', () => {
      const orphanAssessment = { title: 'No Course' } as Assessment;
      expect(component.getCourseName(orphanAssessment)).toBe('N/A');
    });
  });
});