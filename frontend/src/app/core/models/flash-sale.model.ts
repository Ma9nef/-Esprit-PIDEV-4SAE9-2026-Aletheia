// Correspond exactement à votre classe Java FlashSale
export interface FlashSale {
  id?: string;                    // @Id - optionnel car généré par MongoDB
  name: string;                    // Nom de la flash sale
  description: string;             // Description
  offerId: string;                 // Référence à l'offre associée

  // Période très courte
  startTime: Date;                 // LocalDateTime -> Date
  endTime: Date;                   // LocalDateTime -> Date

  // 🔥 Limitation par nombre d'utilisateurs
  maxUsers: number;                // Nombre maximum d'utilisateurs autorisés
  currentUsers: number;            // Nombre d'utilisateurs ayant déjà utilisé l'offre

  isActive: boolean;               // Statut d'activation
}

// DTO pour la création d'une flash sale
export interface CreateFlashSaleDTO {
  name: string;
  description: string;
  offerId: string;
  startTime: Date;
  endTime: Date;
  maxUsers: number;
  isActive: boolean;
}

// DTO pour la mise à jour d'une flash sale
export interface UpdateFlashSaleDTO {
  name?: string;
  description?: string;
  offerId?: string;
  startTime?: Date;
  endTime?: Date;
  maxUsers?: number;
  currentUsers?: number;
  isActive?: boolean;
}

// DTO pour la réponse après application d'une flash sale
export interface AppliedFlashSaleDTO {
  success: boolean;
  message: string;
  flashSaleId?: string;
  offerId?: string;
  userId?: string;
  remainingSpots?: number;
}

// DTO pour les statistiques d'une flash sale
export interface FlashSaleStats {
  totalUsers: number;
  availableSpots: number;
  percentageFilled: number;
  timeRemaining: number;           // en millisecondes
  isAvailable: boolean;
}

// Pour la recherche de flash sales
export interface FlashSaleFilters {
  isActive?: boolean;
  offerId?: string;
  startTimeFrom?: Date;
  startTimeTo?: Date;
  endTimeFrom?: Date;
  endTimeTo?: Date;
  hasAvailableSpots?: boolean;
}

// Helper functions pour manipuler les flash sales
export class FlashSaleHelper {

  // Vérifier si une flash sale est en cours
  static isOngoing(flashSale: FlashSale): boolean {
    const now = new Date();
    const start = new Date(flashSale.startTime);
    const end = new Date(flashSale.endTime);

    return flashSale.isActive &&
      now >= start &&
      now <= end;
  }

  // Vérifier si une flash sale est à venir
  static isUpcoming(flashSale: FlashSale): boolean {
    const now = new Date();
    const start = new Date(flashSale.startTime);

    return flashSale.isActive && now < start;
  }

  // Vérifier si une flash sale est terminée
  static isEnded(flashSale: FlashSale): boolean {
    const now = new Date();
    const end = new Date(flashSale.endTime);

    return !flashSale.isActive || now > end;
  }

  // Vérifier s'il reste des places
  static hasAvailableSpots(flashSale: FlashSale): boolean {
    return flashSale.currentUsers < flashSale.maxUsers;
  }

  // Obtenir le nombre de places restantes
  static getRemainingSpots(flashSale: FlashSale): number {
    return Math.max(0, flashSale.maxUsers - flashSale.currentUsers);
  }

  // Obtenir le pourcentage de places remplies
  static getFillPercentage(flashSale: FlashSale): number {
    return (flashSale.currentUsers / flashSale.maxUsers) * 100;
  }

  // Obtenir le temps restant en millisecondes
  static getTimeRemaining(flashSale: FlashSale): number {
    const now = new Date().getTime();
    const end = new Date(flashSale.endTime).getTime();
    return Math.max(0, end - now);
  }

  // Formater le temps restant
  static formatTimeRemaining(flashSale: FlashSale): string {
    const remaining = this.getTimeRemaining(flashSale);

    if (remaining <= 0) {
      return 'Terminé';
    }

    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  }

  // Obtenir le statut affichable
  static getDisplayStatus(flashSale: FlashSale): { text: string; class: string; color: string } {
    if (!flashSale.isActive) {
      return { text: 'Inactive', class: 'inactive', color: '#a0aec0' };
    }

    if (this.isEnded(flashSale)) {
      return { text: 'Terminée', class: 'ended', color: '#f56565' };
    }

    if (this.isUpcoming(flashSale)) {
      return { text: 'À venir', class: 'upcoming', color: '#ecc94b' };
    }

    if (!this.hasAvailableSpots(flashSale)) {
      return { text: 'Complète', class: 'full', color: '#ed8936' };
    }

    return { text: 'En cours', class: 'ongoing', color: '#48bb78' };
  }

  // Vérifier si un utilisateur peut participer
  static canUserParticipate(flashSale: FlashSale, userId: string, userAlreadyParticipated: boolean): boolean {
    return this.isOngoing(flashSale) &&
      this.hasAvailableSpots(flashSale) &&
      !userAlreadyParticipated;
  }

  // Créer un AppliedFlashSaleDTO pour un succès
  static createSuccessAppliedFlashSale(
    message: string,
    flashSaleId: string,
    offerId: string,
    userId: string,
    remainingSpots: number
  ): AppliedFlashSaleDTO {
    return {
      success: true,
      message,
      flashSaleId,
      offerId,
      userId,
      remainingSpots
    };
  }

  // Créer un AppliedFlashSaleDTO pour une erreur
  static createErrorAppliedFlashSale(message: string): AppliedFlashSaleDTO {
    return {
      success: false,
      message
    };
  }

  // Obtenir les statistiques
  static getStats(flashSale: FlashSale): FlashSaleStats {
    return {
      totalUsers: flashSale.currentUsers,
      availableSpots: this.getRemainingSpots(flashSale),
      percentageFilled: this.getFillPercentage(flashSale),
      timeRemaining: this.getTimeRemaining(flashSale),
      isAvailable: this.hasAvailableSpots(flashSale) && this.isOngoing(flashSale)
    };
  }
}

// Constantes pour les libellés
export const FLASH_SALE_STATUS_LABELS: Record<string, string> = {
  ongoing: 'En cours',
  upcoming: 'À venir',
  ended: 'Terminée',
  inactive: 'Inactive',
  full: 'Complète'
};

// Constantes pour les couleurs
export const FLASH_SALE_STATUS_COLORS: Record<string, string> = {
  ongoing: '#48bb78',
  upcoming: '#ecc94b',
  ended: '#f56565',
  inactive: '#a0aec0',
  full: '#ed8936'
};

// Options pour les filtres
export const FLASH_SALE_FILTER_OPTIONS = [
  { value: 'all', label: 'Toutes' },
  { value: 'ongoing', label: 'En cours' },
  { value: 'upcoming', label: 'À venir' },
  { value: 'available', label: 'Places disponibles' }
];

// Règles de validation
export const FLASH_SALE_VALIDATION_RULES = {
  name: {
    required: true,
    minlength: 3,
    maxlength: 100
  },
  description: {
    required: true,
    minlength: 10,
    maxlength: 500
  },
  maxUsers: {
    required: true,
    min: 1,
    max: 10000
  },
  period: {
    startTimeRequired: true,
    endTimeRequired: true,
    endTimeAfterStart: true,
    minDuration: 5 * 60 * 1000, // 5 minutes minimum
    maxDuration: 24 * 60 * 60 * 1000 // 24 heures maximum
  }
};
