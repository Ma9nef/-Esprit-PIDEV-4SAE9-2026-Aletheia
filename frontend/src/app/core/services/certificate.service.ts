import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Certificate } from '../models/certificate.model';

@Injectable({
  providedIn: 'root'
})
export class CertificateService {
predictSuccess(userId: number): Observable<any> {
  return this.http.get(`${this.apiUrl}/ai/predict/${userId}`);
}



  // ✅ Port 8081 + context-path /pidev
  private apiUrl = 'http://localhost:8081/pidev/certificate';

  constructor(private http: HttpClient) {}

 getAllCertificates(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/all`);
}
sendEmail(certId: number, email: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/${certId}/send-email`, { email });
}
// Add this to your CertificateService
// inside certificate.service.ts
uploadCertificatePdf(id: number, blob: Blob): Observable<string> {
  const formData = new FormData();
  // Ensure the key name "file" matches the @RequestParam("file") in Java
  formData.append('file', blob, `certificate_${id}.pdf`);

  return this.http.post(`http://localhost:8081/pidev/certificate/${id}/upload`, formData, {
    responseType: 'text'  // <--- THIS IS THE KEY FIX
  });
}
  // Get by code

   updateCertificate(id: number, certificate: Certificate): Observable<Certificate> {
    return this.http.put<Certificate>(`${this.apiUrl}/update/${id}`, certificate);
  }
// Angular Service (Your current code)
addCertificate(enrollmentId: number): Observable<any> {
    // REMOVE responseType: 'text'. Your controller returns a JSON Map.
    return this.http.post<any>(`${this.apiUrl}/generate/${enrollmentId}`, {});
}
  // Call the modern export
downloadModernPdf(id: number): Observable<Blob> {
  return this.http.get(`${this.apiUrl}/export-modern/${id}`, { responseType: 'blob' });
}

// Call the analytics
getStats(): Observable<any> {
  return this.http.get(`${this.apiUrl}/analytics`);
}
getCertificateByCode(code: string): Observable<Certificate> {
    return this.http.get<Certificate>(`${this.apiUrl}/verify/${code}`)
  }
  deleteCertificate(id: number): Observable<void> {
  // Matches @DeleteMapping("/pidev/certificate/{id}")
  return this.http.delete<void>(`${this.apiUrl}/${id}`);
}
// inside CertificateService
downloadCertificateFile(id: number): Observable<Blob> {
  return this.http.get(`http://localhost:8081/pidev/certificate/${id}/download`, {
    responseType: 'blob' // This is the most important part
  });
}
 getCertificationPrediction(enrollmentId: number): Observable<any> {
    // This matches the @GetMapping("/predict/{enrollmentId}") in your Java Controller
    return this.http.get<any>(`${this.apiUrl}/predict/${enrollmentId}`);
  }
   getAiCareerPath(enrollmentId: number): Observable<any> {
    // CORRECTION : On utilise ${this.apiUrl} qui contient déjà /pidev/certificate
    // L'URL finale sera : http://localhost:8081/pidev/certificate/8/ai-path
    return this.http.get(`${this.apiUrl}/${enrollmentId}/ai-path`);
  }

}
