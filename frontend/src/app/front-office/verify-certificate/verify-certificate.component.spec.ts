import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyCertificateComponent } from './verify-certificate.component';

describe('VerifyCertificateComponent', () => {
  let component: VerifyCertificateComponent;
  let fixture: ComponentFixture<VerifyCertificateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerifyCertificateComponent]
    });
    fixture = TestBed.createComponent(VerifyCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
