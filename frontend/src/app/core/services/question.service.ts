import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Question } from '../models/question.model';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private apiUrl = 'http://localhost:8081/pidev/questions';

  constructor(private http: HttpClient) {}

  addQuestion(assessmentId: number, question: Question): Observable<Question> {
    return this.http.post<Question>(`${this.apiUrl}/add-to-assessment/${assessmentId}`, question);
  }

  getQuestionsByAssessment(assessmentId: number): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.apiUrl}/assessment/${assessmentId}`);
  }

  updateQuestion(id: number, question: Question): Observable<Question> {
    return this.http.put<Question>(`${this.apiUrl}/${id}`, question);
  }

  deleteQuestion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
