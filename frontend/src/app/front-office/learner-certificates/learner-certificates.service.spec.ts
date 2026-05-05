import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CertificateService } from 'src/app/core/services/certificate.service';
import { Certificate } from 'src/app/core/models/certificate.model';



describe('CertificateService', () => {
  let service: CertificateService;
  let httpMock: HttpTestingController;

  const apiUrl = '/pidev/certificate';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CertificateService]
    });

    service = TestBed.inject(CertificateService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call predictSuccess', () => {
    const mockResponse = { prediction: 'SUCCESS' };

    service.predictSuccess(5).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/ai/predict/5`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get all certificates', () => {
    const mockResponse = [{ id: 1 }, { id: 2 }];

    service.getAllCertificates().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/all`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should send email', () => {
    const mockResponse = { message: 'Email sent' };

    service.sendEmail(10, 'test@example.com').subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/10/send-email`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'test@example.com' });
    req.flush(mockResponse);
  });

  it('should upload certificate pdf', () => {
    const blob = new Blob(['fake pdf'], { type: 'application/pdf' });
    const mockResponse = 'uploaded successfully';

    service.uploadCertificatePdf(3, blob).subscribe(res => {
      expect(res).toBe(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/3/upload`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body instanceof FormData).toBeTrue();
    expect(req.request.responseType).toBe('text');
    req.flush(mockResponse);
  });

  it('should update certificate', () => {
    const certificate: Certificate = {
      id: 1
    } as Certificate;

    const mockResponse: Certificate = {
      id: 1
    } as Certificate;

    service.updateCertificate(1, certificate).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/update/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(certificate);
    req.flush(mockResponse);
  });

  it('should add certificate', () => {
    const mockResponse = { id: 7, message: 'Certificate generated' };

    service.addCertificate(15).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/generate/15`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});
    req.flush(mockResponse);
  });

  it('should download modern pdf', () => {
    const mockBlob = new Blob(['pdf'], { type: 'application/pdf' });

    service.downloadModernPdf(8).subscribe(res => {
      expect(res).toEqual(mockBlob);
    });

    const req = httpMock.expectOne(`${apiUrl}/export-modern/8`);
    expect(req.request.method).toBe('GET');
    expect(req.request.responseType).toBe('blob');
    req.flush(mockBlob);
  });

  it('should get stats', () => {
    const mockResponse = { total: 12, issued: 9 };

    service.getStats().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/analytics`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get certificate by code', () => {
    const mockCertificate: Certificate = {
      id: 4
    } as Certificate;

    service.getCertificateByCode('ABC123').subscribe(res => {
      expect(res).toEqual(mockCertificate);
    });

    const req = httpMock.expectOne(`${apiUrl}/verify/ABC123`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCertificate);
  });

  it('should delete certificate', () => {
    service.deleteCertificate(9).subscribe(res => {
      expect(res).toBeNull();
    });

    const req = httpMock.expectOne(`${apiUrl}/9`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should download certificate file', () => {
    const mockBlob = new Blob(['file'], { type: 'application/pdf' });

    service.downloadCertificateFile(11).subscribe(res => {
      expect(res).toEqual(mockBlob);
    });

    const req = httpMock.expectOne(`${apiUrl}/11/download`);
    expect(req.request.method).toBe('GET');
    expect(req.request.responseType).toBe('blob');
    req.flush(mockBlob);
  });

  it('should get certification prediction', () => {
    const mockResponse = { prediction: 'Eligible' };

    service.getCertificationPrediction(21).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/predict/21`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get AI career path', () => {
    const mockResponse = { nextStep: 'Advanced Java' };

    service.getAiCareerPath(14).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/14/ai-path`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});