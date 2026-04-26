// subscription-plan.model.ts
// Modèles TypeScript pour les plans d'abonnement, correspondant aux entités et DTOs Spring Boot backend.

/**
 * Entité représentant un plan d'abonnement (tel que stocké en base).
 * Correspond à la classe `SubscriptionPlan` de l'entité MongoDB.
 */
export interface SubscriptionPlan {
  id: string;                       // Identifiant technique
  name: string;                      // Nom du plan (ex: "PREMIUM_MENSUEL")
  description?: string;               // Description (optionnelle)
  price: number;                      // Prix (Double -> number)
  durationDays: number;               // Durée en jours
  maxCourses?: number;                 // Nombre max de cours (optionnel, selon plan)
  certificationIncluded: boolean;      // Certifications incluses ?
  isActive: boolean;                   // Plan actif ou non
  createdAt: Date;                     // Date de création
  updatedAt: Date;                     // Date de dernière modification
}

/**
 * Requête pour créer ou mettre à jour un plan d'abonnement.
 * Correspond à `SubscriptionPlanRequestDTO` côté backend.
 */
export interface SubscriptionPlanRequest {
  name: string;                        // Nom du plan (ex: "PREMIUM_MENSUEL")
  description?: string;                 // Description du plan
  price: number;                        // Prix
  durationDays: number;                 // Durée en jours (30, 365, etc.)
  maxCourses?: number;                   // Nombre max de cours accessibles (optionnel)
  certificationIncluded?: boolean;       // Certifications incluses ? (par défaut false)
  isActive?: boolean;                    // Plan actif ? (par défaut true)
}

/**
 * Réponse de l'API après création/modification ou récupération d'un plan.
 * Correspond à `SubscriptionPlanResponseDTO` côté backend.
 */
export interface SubscriptionPlanResponse {
  success: boolean;                     // Indique si l'opération a réussi
  message: string;                       // Message d'information ou d'erreur
  planId: string;                       // ID du plan (si succès)
  name?: string;                          // Nom du plan
  description?: string;                   // Description
  price?: number;                         // Prix
  durationDays?: number;                   // Durée en jours
  maxCourses?: number;                     // Nombre max de cours
  certificationIncluded?: boolean;         // Certifications incluses ?
  isActive?: boolean;                      // Plan actif ?
}
