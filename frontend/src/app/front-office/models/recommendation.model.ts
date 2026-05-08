// src/app/front-office/models/recommendation.model.ts
import { AppEvent } from './event.model';

export interface MLPredictionResponse {
  user_id: number;
  event_id: number;
  score: number;
  will_like: boolean;
  confidence: number;
  threshold: number;
}

export interface RecommendedEvent extends AppEvent {
  recommendationScore: number;
  willLike: boolean;
}
export interface MLHealthResponse {
  ml_service_available: boolean;
  ml_api_url: string;
}


export interface PredictionRequest {
  userId: number;
  eventId: number;
  interactionType: string;
  category: string;
  weight?: number;
}