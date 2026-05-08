import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CertificateService } from './certificate.service';
import { Certificate } from '../models/certificate.model';

describe('CertificateService', () => {
  let service: CertificateService;
  let httpMock: HttpTestingController;

  const API = 'http://localhost:8089/pidev/certificate';

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

  it('should predict success', () => {
    const mockResponse = { prediction: 'SUCCESS' };

    service.predictSuccess(1).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${API}/ai/predict/1`);
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });

  it('should get all certificates', () => {
    const mockResponse = [{ id: 1 }];

    service.getAllCertificates().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${API}/all`);
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });

  it('should send email', () => {
    const mockResponse = { message: 'sent' };

    service.sendEmail(3, 'test@example.com').subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${API}/3/send-email`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'test@example.com' });

    req.flush(mockResponse);
  });

  it('should upload certificate pdf', () => {
    const blob = new Blob(['pdf'], { type: 'application/pdf' });

    service.uploadCertificatePdf(4, blob).subscribe(res => {
      expect(res).toBe('uploaded');
    });

    const req = httpMock.expectOne(`${API}/4/upload`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body instanceof FormData).toBeTrue();
    expect(req.request.responseType).toBe('text');

    req.flush('uploaded');
  });

  it('should update certificate', () => {
    const certificate: Certificate = { id: 6 } as Certificate;

    service.updateCertificate(6, certificate).subscribe(res => {
      expect(res).toEqual(certificate);
    });

    const req = httpMock.expectOne(`${API}/update/6`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(certificate);

    req.flush(certificate);
  });

  it('should add certificate', () => {
    const mockResponse = { id: 10 };

    service.addCertificate(15).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${API}/generate/15`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});

    req.flush(mockResponse);
  });

  it('should download modern pdf', () => {
    const blob = new Blob(['pdf'], { type: 'application/pdf' });

    service.downloadModernPdf(7).subscribe(res => {
      expect(res).toEqual(blob);
    });

    const req = httpMock.expectOne(`${API}/export-modern/7`);
    expect(req.request.method).toBe('GET');
    expect(req.request.responseType).toBe('blob');

    req.flush(blob);
  });

  it('should get stats', () => {
    const mockStats = { total: 5 };

    service.getStats().subscribe(res => {
      expect(res).toEqual(mockStats);
    });

    const req = httpMock.expectOne(`${API}/analytics`);
    expect(req.request.method).toBe('GET');

    req.flush(mockStats);
  });

  it('should get certificate by code', () => {
    const certificate: Certificate = { id: 9 } as Certificate;

    service.getCertificateByCode('ABC123').subscribe(res => {
      expect(res).toEqual(certificate);
    });

    const req = httpMock.expectOne(`${API}/verify/ABC123`);
    expect(req.request.method).toBe('GET');

    req.flush(certificate);
  });

  it('should delete certificate', () => {
    service.deleteCertificate(12).subscribe(res => {
      expect(res).toBeNull();
    });

    const req = httpMock.expectOne(`${API}/12`);
    expect(req.request.method).toBe('DELETE');

    req.flush(null);
  });

  it('should download certificate file', () => {
    const blob = new Blob(['file'], { type: 'application/pdf' });

    service.downloadCertificateFile(13).subscribe(res => {
      expect(res).toEqual(blob);
    });

    const req = httpMock.expectOne(`${API}/13/download`);
    expect(req.request.method).toBe('GET');
    expect(req.request.responseType).toBe('blob');

    req.flush(blob);
  });

  it('should get certification prediction', () => {
    const mockResponse = { eligible: true };

    service.getCertificationPrediction(18).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${API}/predict/18`);
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });

  it('should get AI career path', () => {
    const mockResponse = { path: 'Advanced Java' };

    service.getAiCareerPath(20).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${API}/20/ai-path`);
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });
});