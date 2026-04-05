// subscription.model.ts
// Modèles TypeScript pour les abonnements, correspondant aux DTOs Spring Boot backend.

/**
 * Représente une demande de création ou mise à jour d'abonnement.
 * Correspond à `SubscriptionRequestDTO` côté backend.
 */
export interface SubscriptionRequest {
  userId: string;               // ID de l'utilisateur
  planId: string;                // ID du plan souscrit
  startDate?: Date;              // Date de début (optionnelle, si absente = maintenant)
  endDate?: Date;                // Date de fin (optionnelle, si absente = calculée depuis le plan)
  status?: string;               // Statut : ACTIVE, EXPIRED, CANCELED, PENDING (par défaut "PENDING")
}

export interface SubscriptionCheckoutRequest {
  userId: string;
  planId: string;
  successUrl: string;
  cancelUrl: string;
}

export interface SubscriptionCheckoutResponse {
  success: boolean;
  message: string;
  checkoutUrl?: string;
  sessionId?: string;
  paymentId?: string;
  subscriptionId?: string;
}

/**
 * Réponse après création ou modification d'un abonnement.
 * Correspond à `SubscriptionResponseDTO` côté backend.
 */
export interface SubscriptionResponse {
  success: boolean;              // Indique si l'opération a réussi
  message: string;               // Message d'information ou d'erreur
  subscriptionId?: string;       // ID de l'abonnement créé
  subscriptionNumber?: string;   // Numéro unique de l'abonnement
  userId?: string;               // ID de l'utilisateur
  planId?: string;
  planName?: string;             // Nom du plan souscrit
  planDescription?: string;
  planPrice?: number;
  durationDays?: number;
  maxCourses?: number;
  certificationIncluded?: boolean;
  planActive?: boolean;
  startDate?: Date;              // Date de début effective
  endDate?: Date;                // Date de fin effective
  status?: string;               // Statut actuel
  daysRemaining?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SubscriptionPaymentHistory {
  paymentId: string;
  userId: string;
  planId: string;
  planName?: string;
  subscriptionId?: string;
  subscriptionNumber?: string;
  amount?: number;
  currency?: string;
  provider?: string;
  status?: string;
  transactionReference?: string;
  failureReason?: string;
  createdAt?: Date;
  updatedAt?: Date;
  paidAt?: Date;
}

/**
 * Informations sur l'abonnement actif d'un utilisateur.
 * Correspond à `UserSubscriptionDTO` côté backend.
 */
export interface UserSubscription {
  hasActiveSubscription: boolean;   // Indique si l'utilisateur a un abonnement actif
  subscriptionId?: string;          // ID de l'abonnement (si actif)
  planName?: string;                // Nom du plan (si actif)
  startDate?: Date;                 // Date de début (si actif)
  endDate?: Date;                   // Date de fin (si actif)
  daysRemaining?: number;           // Jours restants (si actif)
  coursesUsed?: number;             // Nombre de cours utilisés (si applicable)
  coursesLimit?: number;            // Limite de cours (si applicable)
  canGetCertification?: boolean;    // Possibilité d'obtenir une certification (si applicable)
}

/**
 * (Optionnel) Représentation complète d'un abonnement telle que stockée côté backend.
 * Peut être utile si l'API renvoie l'entité complète dans certains cas.
 * Correspond à la classe `Subscription` de l'entité MongoDB.
 */
export interface Subscription {
  id: string;                       // Identifiant technique
  userId: string;                   // Référence à l'utilisateur
  planId: string;                   // Référence au plan
  subscriptionNumber: string;       // Numéro unique
  startDate: Date;                  // Date de début
  endDate: Date;                    // Date de fin
  status: string;                   // ACTIVE, EXPIRED, CANCELED, PENDING
  createdAt: Date;                  // Date de création
  updatedAt: Date;                  // Date de dernière modification
}
