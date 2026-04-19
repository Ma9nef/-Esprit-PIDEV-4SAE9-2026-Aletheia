import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Certificate } from '../models/certificate.model';

@Injectable({
  providedIn: 'root'
})
export class CertificateService {
  // API Gateway
  private apiUrl = 'http://localhost:8089/pidev/certificate';

  constructor(private http: HttpClient) {}

  predictSuccess(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/ai/predict/${userId}`);
  }

  getAllCertificates(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/all`);
  }

  sendEmail(certId: number, email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${certId}/send-email`, { email });
  }

  uploadCertificatePdf(id: number, blob: Blob): Observable<string> {
    const formData = new FormData();
    formData.append('file', blob, `certificate_${id}.pdf`);

    return this.http.post(`${this.apiUrl}/${id}/upload`, formData, {
      responseType: 'text'
    });
  }

  updateCertificate(id: number, certificate: Certificate): Observable<Certificate> {
    return this.http.put<Certificate>(`${this.apiUrl}/update/${id}`, certificate);
  }

  addCertificate(enrollmentId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/generate/${enrollmentId}`, {});
  }

  downloadModernPdf(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export-modern/${id}`, {
      responseType: 'blob'
    });
  }

  getStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/analytics`);
  }

  getCertificateByCode(code: string): Observable<Certificate> {
    return this.http.get<Certificate>(`${this.apiUrl}/verify/${code}`);
  }

  deleteCertificate(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  downloadCertificateFile(id: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/download`, {
      responseType: 'blob'
    });
  }

  getCertificationPrediction(enrollmentId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/predict/${enrollmentId}`);
  }

  getAiCareerPath(enrollmentId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${enrollmentId}/ai-path`);
  }
}
