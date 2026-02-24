import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAssessmentsComponent } from './manage-assessments.component';

describe('ManageAssessmentsComponent', () => {
  let component: ManageAssessmentsComponent;
  let fixture: ComponentFixture<ManageAssessmentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageAssessmentsComponent]
    });
    fixture = TestBed.createComponent(ManageAssessmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
