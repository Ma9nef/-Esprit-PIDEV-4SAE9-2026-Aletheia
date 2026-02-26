import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnerAssessmentComponent } from './learner-assessment.component';

describe('LearnerAssessmentComponent', () => {
  let component: LearnerAssessmentComponent;
  let fixture: ComponentFixture<LearnerAssessmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LearnerAssessmentComponent]
    });
    fixture = TestBed.createComponent(LearnerAssessmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
