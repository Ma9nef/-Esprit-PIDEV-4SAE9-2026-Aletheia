import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainerHomeComponent } from './trainer-home.component';

describe('TrainerHomeComponent', () => {
  let component: TrainerHomeComponent;
  let fixture: ComponentFixture<TrainerHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TrainerHomeComponent]
    });
    fixture = TestBed.createComponent(TrainerHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
