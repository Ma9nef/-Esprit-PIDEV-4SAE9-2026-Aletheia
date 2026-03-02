import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocationFormComponent } from './allocation-form';

describe('AllocationForm', () => {
  let component: AllocationFormComponent;
  let fixture: ComponentFixture<AllocationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllocationFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllocationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
