// src/app/front-office/service/sentiment.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { EventSentimentStats, CommentWithSentiment } from '../models/sentiment.model';

@Injectable({
  providedIn: 'root'
})
export class SentimentService {
  private apiUrl = 'http://localhost:8090/api/events/sentiments';

  constructor(private http: HttpClient) {}

  /**
   * Ajouter un commentaire avec analyse de sentiment (API réelle)
   */
  addCommentWithSentiment(comment: string, eventId: number, userId: number): Observable<CommentWithSentiment> {
    console.log(`📝 Envoi du commentaire pour l'événement ${eventId}`);
    
    return this.http.post<CommentWithSentiment>(`${this.apiUrl}/comment`, {
      comment,
      eventId,
      userId
    }).pipe(
      catchError(error => {
        console.error('❌ Erreur lors de l\'ajout du commentaire:', error);
        // Fallback en cas d'erreur
        return of({
          id: Math.floor(Math.random() * 10000),
          comment: comment,
          eventId: eventId,
          userId: userId,
          sentiment: this.mockSentimentAnalysis(comment),
          confidence: 0.75,
          positiveScore: 0.7,
          neutralScore: 0.2,
          negativeScore: 0.1,
          createdAt: new Date().toISOString()
        });
      })
    );
  }

  /**
   * Récupérer les commentaires d'un événement (API réelle)
   */
  getEventComments(eventId: number, page: number = 0, size: number = 20): Observable<any> {
    console.log(`📖 Chargement des commentaires pour l'événement ${eventId}, page ${page}`);
    
    return this.http.get(`${this.apiUrl}/event/${eventId}/comments?page=${page}&size=${size}`).pipe(
      catchError(error => {
        console.error('❌ Erreur chargement commentaires:', error);
        // Retourner une structure vide en cas d'erreur
        return of({
          eventId: eventId,
          stats: null,
          comments: [],
          currentPage: 0,
          totalPages: 1,
          totalComments: 0
        });
      })
    );
  }

  /**
   * Récupérer les statistiques de sentiment (API réelle)
   */
  getEventStats(eventId: number): Observable<EventSentimentStats> {
    console.log(`📊 Chargement des stats pour l'événement ${eventId}`);
    
    return this.http.get<EventSentimentStats>(`${this.apiUrl}/event/${eventId}/stats`).pipe(
      catchError(error => {
        console.error('❌ Erreur chargement stats:', error);
        // Fallback stats vides
        return of({
          eventId: eventId,
          totalComments: 0,
          positiveCount: 0,
          neutralCount: 0,
          negativeCount: 0,
          positivePercentage: 0,
          neutralPercentage: 0,
          negativePercentage: 0,
          overallSentimentScore: 0.5,
          sentimentLabel: "Neutre"
        });
      })
    );
  }

  /**
   * Vérifier si un utilisateur a déjà commenté (API réelle)
   */
  hasUserCommented(eventId: number, userId: number): Observable<{ hasCommented: boolean }> {
    console.log(`🔍 Vérification si l'utilisateur ${userId} a commenté l'événement ${eventId}`);
    
    return this.http.get<{ hasCommented: boolean }>(
      `${this.apiUrl}/event/${eventId}/user/${userId}/has-commented`
    ).pipe(
      catchError(error => {
        console.warn('⚠️ Impossible de vérifier le commentaire:', error);
        // Vérifier dans localStorage comme fallback
        const hasCommented = localStorage.getItem(`commented_${eventId}_${userId}`) === 'true';
        return of({ hasCommented: hasCommented });
      })
    );
  }

  // ==================== METHODES DE PARTAGE ====================

  /**
   * Générer un lien de partage pour les sentiments d'un événement
   */
  getShareableSentiment(eventId: number, includeComments: boolean = true): Observable<any> {
    return this.http.get(`${this.apiUrl}/event/${eventId}/share?includeComments=${includeComments}`).pipe(
      catchError(error => {
        console.error('❌ Erreur génération lien partage:', error);
        return of(null);
      })
    );
  }

  /**
   * Accéder aux sentiments via un token de partage
   */
  getSharedSentiment(token: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/share/${token}`).pipe(
      catchError(error => {
        console.error('❌ Erreur accès lien partagé:', error);
        return of(null);
      })
    );
  }

  /**
   * Récupérer les stats simplifiées pour partage
   */
  getSimpleShareStats(eventId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/event/${eventId}/share-stats`).pipe(
      catchError(error => {
        console.error('❌ Erreur chargement stats partage:', error);
        return of(null);
      })
    );
  }

  // ==================== METHODES PRIVEES (FALLBACK) ====================

  private mockSentimentAnalysis(comment: string): string {
    const positiveWords = ['super', 'excellent', 'génial', 'bien', 'bon', 'agréable', 'intéressant', 'utile'];
    const negativeWords = ['déçu', 'mauvais', 'médiocre', 'problème', 'dommage', 'chaotique', 'retard'];
    
    const lowerComment = comment.toLowerCase();
    let positiveCount = positiveWords.filter(word => lowerComment.includes(word)).length;
    let negativeCount = negativeWords.filter(word => lowerComment.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'POSITIVE';
    if (negativeCount > positiveCount) return 'NEGATIVE';
    return 'NEUTRAL';
  }
}