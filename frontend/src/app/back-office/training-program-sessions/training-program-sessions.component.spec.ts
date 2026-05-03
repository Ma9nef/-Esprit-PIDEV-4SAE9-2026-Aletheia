import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingProgramSessionsComponent } from './training-program-sessions.component';

describe('TrainingProgramSessionsComponent', () => {
  let component: TrainingProgramSessionsComponent;
  let fixture: ComponentFixture<TrainingProgramSessionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrainingProgramSessionsComponent]
    });
    fixture = TestBed.createComponent(TrainingProgramSessionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
