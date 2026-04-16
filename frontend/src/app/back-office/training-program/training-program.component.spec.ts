import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingProgramComponent } from './training-program.component';

describe('TrainingProgramComponent', () => {
  let component: TrainingProgramComponent;
  let fixture: ComponentFixture<TrainingProgramComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrainingProgramComponent]
    });
    fixture = TestBed.createComponent(TrainingProgramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
