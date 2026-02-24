import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Certificate } from '../models/certificate.model';

@Injectable({
  providedIn: 'root'
})
export class CertificateService {
 

  // ✅ Port 8081 + context-path /pidev
  private apiUrl = 'http://localhost:8081/pidev/certificate';

  constructor(private http: HttpClient) {}

 getAllCertificates(): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/all`);
}

  // Get by code
  
   updateCertificate(id: number, certificate: Certificate): Observable<Certificate> {
    return this.http.put<Certificate>(`${this.apiUrl}/update/${id}`, certificate);
  }
  addCertificate(enrollmentId: number): Observable<string> {
    // On ajoute { responseType: 'text' as 'json' } pour dire à Angular 
    // de ne pas essayer de parser le retour comme du JSON.
    return this.http.post<string>(
      `${this.apiUrl}/generate/${enrollmentId}`, 
      {}, 
      { responseType: 'text' as 'json' }
    );
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

}
