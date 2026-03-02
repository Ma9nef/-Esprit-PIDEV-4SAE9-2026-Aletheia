import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllocationDetailComponent } from './allocation-detail';

describe('AllocationDetailComponent', () => {
  let component: AllocationDetailComponent;
  let fixture: ComponentFixture<AllocationDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllocationDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllocationDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
