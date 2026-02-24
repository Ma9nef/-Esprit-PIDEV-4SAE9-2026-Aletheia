import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCertificatesComponent } from './manage-certificates.component';

describe('ManageCertificatesComponent', () => {
  let component: ManageCertificatesComponent;
  let fixture: ComponentFixture<ManageCertificatesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageCertificatesComponent]
    });
    fixture = TestBed.createComponent(ManageCertificatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
