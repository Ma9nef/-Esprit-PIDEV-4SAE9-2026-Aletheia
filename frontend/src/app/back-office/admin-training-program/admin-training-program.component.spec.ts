import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTrainingProgramComponent } from './admin-training-program.component';

describe('AdminTrainingProgramComponent', () => {
  let component: AdminTrainingProgramComponent;
  let fixture: ComponentFixture<AdminTrainingProgramComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminTrainingProgramComponent]
    });
    fixture = TestBed.createComponent(AdminTrainingProgramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
