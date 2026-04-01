import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface FaceDetectionResult {
  class_name: 'visible' | 'covered' | 'no_face';
  confidence: number;
  probabilities: {
    visible: number;
    covered: number;
    no_face: number;
  };
  processing_time_ms: number;
  warning?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FaceDetectionService {
  
  private mlApiUrl = 'http://localhost:8000';
  
  constructor(private http: HttpClient) {}
  
  detectFace(imageBlob: Blob): Observable<FaceDetectionResult> {
    const formData = new FormData();
    formData.append('file', imageBlob, 'frame.jpg');
    
    return this.http.post<FaceDetectionResult>(
      `${this.mlApiUrl}/predict`, 
      formData
    );
  }
  
  checkHealth(): Observable<any> {
    return this.http.get(`${this.mlApiUrl}/health`);
  }
}