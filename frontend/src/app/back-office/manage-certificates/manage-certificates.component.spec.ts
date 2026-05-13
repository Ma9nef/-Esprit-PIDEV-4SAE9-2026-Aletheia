import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { of, throwError } from 'rxjs';
import { ElementRef } from '@angular/core';

import { ManageCertificatesComponent } from './manage-certificates.component';
import { CertificateService } from '../../core/services/certificate.service';
import { EnrollmentService } from '../../core/services/enrollment.service';
import { UserService } from 'src/app/core/services/user.service';

// ─────────────────────────────────────────────────────────────
// GLOBAL MOCKS
// ─────────────────────────────────────────────────────────────

const mockSignaturePad = {
  clear: jasmine.createSpy('clear'),
  toDataURL: jasmine.createSpy('toDataURL').and.returnValue('data:image/png;base64,ABC'),
  fromDataURL: jasmine.createSpy('fromDataURL'),
};

const mockModalInstance = {
  show: jasmine.createSpy('show'),
  hide: jasmine.createSpy('hide'),
};

// Mocking Bootstrap's Modal globally
const mockBootstrap = {
  Modal: class {
    constructor() { return mockModalInstance; }
    show = mockModalInstance.show;
    hide = mockModalInstance.hide;
    static getInstance = jasmine.createSpy('getInstance').and.returnValue(mockModalInstance);
  },
};

describe('ManageCertificatesComponent', () => {
  let component: ManageCertificatesComponent;
  let fixture: ComponentFixture<ManageCertificatesComponent>;
  let certServiceSpy: jasmine.SpyObj<CertificateService>;
  let enrollmentServiceSpy: jasmine.SpyObj<EnrollmentService>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    certServiceSpy = jasmine.createSpyObj('CertificateService', [
      'getAllCertificates', 'addCertificate', 'deleteCertificate', 'getCertificationPrediction'
    ]);
    enrollmentServiceSpy = jasmine.createSpyObj('EnrollmentService', ['getAllEnrollments']);
    userServiceSpy = jasmine.createSpyObj('UserService', ['getAllUsers', 'saveSignature']);

    // Default Success Returns
    certServiceSpy.getAllCertificates.and.returnValue(of([]));
    certServiceSpy.addCertificate.and.returnValue(of(undefined));
    certServiceSpy.deleteCertificate.and.returnValue(of(undefined));
    certServiceSpy.getCertificationPrediction.and.returnValue(of({ score: 85 }));
    enrollmentServiceSpy.getAllEnrollments.and.returnValue(of([]));
    userServiceSpy.getAllUsers.and.returnValue(of([]));
    userServiceSpy.saveSignature.and.returnValue(of({ success: true }));

    (window as any)['bootstrap'] = mockBootstrap;

    await TestBed.configureTestingModule({
      declarations: [ManageCertificatesComponent],
      imports: [FormsModule],
      providers: [
        DatePipe,
        { provide: CertificateService, useValue: certServiceSpy },
        { provide: EnrollmentService, useValue: enrollmentServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageCertificatesComponent);
    component = fixture.componentInstance;

    // Manually satisfy ViewChild canvas
    component.signatureCanvas = new ElementRef(document.createElement('canvas'));

    // Inject SignaturePad mock during AfterViewInit
    spyOn(component, 'ngAfterViewInit').and.callFake(() => {
      (component as any).signaturePad = mockSignaturePad;
    });

    fixture.detectChanges(); 
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Certificate Management', () => {
    it('should call addCertificate and refresh the list on success', fakeAsync(() => {
      component.newEnrollmentId = 11;
      spyOn(window, 'alert');
      
      component.confirmAdd();
      tick();

      expect(certServiceSpy.addCertificate).toHaveBeenCalledWith(11);
      expect(certServiceSpy.getAllCertificates).toHaveBeenCalled();
      expect(mockModalInstance.hide).toHaveBeenCalled();
    }));

    it('should handle errors during certificate addition', fakeAsync(() => {
      certServiceSpy.addCertificate.and.returnValue(throwError(() => new Error('API Error')));
      spyOn(window, 'alert');
      
      component.confirmAdd();
      tick();

      expect(window.alert).toHaveBeenCalledWith(jasmine.stringMatching(/error/i));
    }));

    it('should delete when user confirms', fakeAsync(() => {
      spyOn(window, 'confirm').and.returnValue(true);
      
      component.onDelete(100);
      tick();

      expect(certServiceSpy.deleteCertificate).toHaveBeenCalledWith(100);
    }));
  });

  describe('Signature Logic', () => {
    it('should save signature and show success alert', fakeAsync(() => {
      spyOn(window, 'alert');
      component.selectedUserId = 1;

      component.saveSignature();
      tick();

      expect(userServiceSpy.saveSignature).toHaveBeenCalledWith(1, 'data:image/png;base64,ABC');
      expect(window.alert).toHaveBeenCalledWith(jasmine.stringMatching(/saved/i));
    }));

    it('should clear the signature pad when clearSignature is called', () => {
      component.clearSignature();
      expect(mockSignaturePad.clear).toHaveBeenCalled();
    });
  });

  describe('AI Prediction', () => {
    it('should update state after prediction result is returned', fakeAsync(() => {
      component.selectedEnrollmentIdForPredict = 10;
      
      component.predictCertificationSuccess();
      tick();

      expect(certServiceSpy.getCertificationPrediction).toHaveBeenCalledWith(10);
      expect(component.successResult).toBeDefined();
      expect(component.successResult.score).toBe(85);
    }));
  });
});