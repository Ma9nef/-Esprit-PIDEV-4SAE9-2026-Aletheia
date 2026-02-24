import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnerCertificatesComponent } from './learner-certificates.component';

describe('LearnerCertificatesComponent', () => {
  let component: LearnerCertificatesComponent;
  let fixture: ComponentFixture<LearnerCertificatesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LearnerCertificatesComponent]
    });
    fixture = TestBed.createComponent(LearnerCertificatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
