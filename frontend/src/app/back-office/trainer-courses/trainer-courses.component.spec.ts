import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainerCoursesComponent } from './trainer-courses.component';

describe('TrainerCoursesComponent', () => {
  let component: TrainerCoursesComponent;
  let fixture: ComponentFixture<TrainerCoursesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrainerCoursesComponent]
    });
    fixture = TestBed.createComponent(TrainerCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
