// src/app/front-office/service/recommendation.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { MLPredictionResponse } from '../models/recommendation.model';
import { AppEvent } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class RecommendationService {
  private apiUrl = 'http://localhost:8090/api';

  constructor(private http: HttpClient) {}

  /**
   * Prédiction pour un utilisateur et un événement spécifique
   */
  getPredictions(userId: number, eventId: number, interactionType: string = 'CLICK', category: string = 'Conference'): Observable<MLPredictionResponse> {
    console.log(`🎯 Prédiction: user=${userId}, event=${eventId}`);
    
    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('eventId', eventId.toString())
      .set('interaction', interactionType)
      .set('category', category);
    
    return this.http.get<MLPredictionResponse>(`${this.apiUrl}/ml-test/predict`, { params })
      .pipe(
        catchError(error => {
          console.error(`❌ Erreur predict pour event ${eventId}:`, error.message);
          // Retourner une prédiction par défaut avec un score aléatoire pour simulation
          return of({
            user_id: userId,
            event_id: eventId,
            score: Math.random() * 0.6 + 0.2, // Score aléatoire entre 0.2 et 0.8
            will_like: Math.random() > 0.5,
            confidence: 0.7,
            threshold: 0.5
          });
        })
      );
  }

  /**
   * Prédire les scores pour les événements filtrés et retourner les meilleurs
   */
  predictEventsAndGetTop(userId: number, events: AppEvent[], topN: number = 6): Observable<{event: AppEvent, score: number, willLike: boolean}[]> {
    if (!events || events.length === 0) {
      console.log('📭 Aucun événement à prédire');
      return of([]);
    }

    console.log(`🎯 Prédiction pour ${events.length} événements, user=${userId}`);
    
    // Créer un tableau d'observables pour chaque prédiction
    const predictions$ = events.map(event => 
      this.getPredictions(userId, event.id, 'CLICK', 'Conference').pipe(
        map(prediction => ({
          event: event,
          score: prediction.score,
          willLike: prediction.will_like,
          confidence: prediction.confidence
        }))
      )
    );
    
    // Exécuter toutes les prédictions en parallèle
    return forkJoin(predictions$).pipe(
      map(results => {
        // Filtrer et trier par score décroissant
        const sortedResults = results
          .filter(result => result.score > 0.2) // Garder seulement ceux avec score > 0.2
          .sort((a, b) => b.score - a.score);
        
        console.log(`📊 Prédictions terminées: ${sortedResults.length} événements avec score > 0.2`);
        
        // Afficher les top scores dans la console
        sortedResults.slice(0, topN).forEach((result, index) => {
          console.log(`  ${index + 1}. ${result.event.title} - Score: ${(result.score * 100).toFixed(1)}%`);
        });
        
        // Retourner les top N résultats
        return sortedResults.slice(0, topN);
      }),
      catchError(error => {
        console.error('❌ Error in batch prediction:', error);
        return of([]);
      })
    );
  }

  /**
   * Récupère les recommandations basées sur le score ML (version originale)
   */
  getRecommendationsByMLScore(userId: number, limit: number = 10): Observable<AppEvent[]> {
    console.log(`🎯 Getting ML recommendations for user ${userId} with limit ${limit}`);
    
    const params = new HttpParams()
      .set('limit', limit.toString())
      .set('use_ml_score', 'true');
    
    return this.http.get<AppEvent[]>(`${this.apiUrl}/ml-test/recommendations/${userId}`, { params })
      .pipe(
        catchError(error => {
          console.error('❌ Error getting ML recommendations:', error);
          return of([]);
        })
      );
  }

  /**
   * Récupère les recommandations hybrides
   */
  getHybridRecommendations(userId: number, limit: number = 10): Observable<AppEvent[]> {
    console.log(`🎯 Getting hybrid recommendations for user ${userId}`);
    
    return this.http.get<AppEvent[]>(`${this.apiUrl}/recommendations/hybrid/${userId}?limit=${limit}`)
      .pipe(
        catchError(error => {
          console.error('❌ Error getting hybrid recommendations:', error);
          return of([]);
        })
      );
  }

  /**
   * Vérifie la santé du service ML
   */
  checkMLHealth(): Observable<any> {
    return this.http.get(`${this.apiUrl}/ml-test/health`)
      .pipe(
        catchError(error => {
          console.error('❌ ML health check failed:', error);
          return of({ ml_service_available: false });
        })
      );
  }
}