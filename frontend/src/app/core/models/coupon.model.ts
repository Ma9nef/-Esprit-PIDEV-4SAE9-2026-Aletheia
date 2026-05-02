// Import des enums nécessaires
import { OfferStatus } from './offer.model';

// Correspond à votre enum OfferStatus dans le backend
// (à définir si pas déjà fait dans offer.model.ts)

// Correspond à votre entité Coupon et CouponResponseDTO
export interface Coupon {
  id: string;                       // @Id
  code: string;                      // @Indexed(unique = true)
  offerId: string;                   // Référence à l'offre associée
  description: string;

  // Type de coupon
  isUnique: boolean;                  // true = usage unique / false = partagé

  // Si coupon personnel
  assignedUserId?: string;            // Utilisateur assigné (si code personnel)

  // Restrictions
  validFrom: Date;                    // LocalDateTime -> Date
  validUntil: Date;                    // LocalDateTime -> Date
  remainingUses?: number;              // Pour codes partagés
  maxUses?: number;                     // Nombre maximum d'utilisations

  // Statut
  status: OfferStatus;                  // ACTIVE, INACTIVE, EXPIRED, SCHEDULED

  // Métadonnées
  createdAt: Date;                      // LocalDateTime -> Date
  updatedAt?: Date;                      // LocalDateTime -> Date
}

// Correspond à votre CouponRequestDTO
export interface CouponRequestDTO {
  code: string;
  offerId: string;
  description: string;
  isUnique: boolean;                    // true = usage unique / false = partagé
  assignedUserId?: string;               // Si coupon personnel
  validFrom: Date;                        // LocalDateTime -> Date
  validUntil: Date;                        // LocalDateTime -> Date
  maxUses?: number;                         // Nombre maximum d'utilisations
}

// Correspond à votre AppliedCouponDTO
export interface AppliedCouponDTO {
  success: boolean;
  message: string;
  couponCode?: string;
  originalPrice?: number;
  finalPrice?: number;
  discountAmount?: number;
}

// DTO pour la mise à jour d'un coupon (tous les champs optionnels)
export interface UpdateCouponDTO {
  code?: string;
  offerId?: string;
  description?: string;
  isUnique?: boolean;
  assignedUserId?: string;
  validFrom?: Date;
  validUntil?: Date;
  remainingUses?: number;
  maxUses?: number;
  status?: OfferStatus;
}

// Pour la recherche de coupons
export interface CouponFilters {
  code?: string;
  offerId?: string;
  isUnique?: boolean;
  assignedUserId?: string;
  status?: OfferStatus;
  validFrom?: Date;
  validUntil?: Date;
  isActive?: boolean;
}

// Helper functions pour manipuler les coupons
export class CouponHelper {

  // Vérifier si un coupon est actif et valide
  static isValid(coupon: Coupon): boolean {
    const now = new Date();
    const validFrom = new Date(coupon.validFrom);
    const validUntil = new Date(coupon.validUntil);

    return coupon.status === OfferStatus.ACTIVE &&
      now >= validFrom &&
      now <= validUntil;
  }

  // Vérifier si un coupon est disponible (pas épuisé)
  static isAvailable(coupon: Coupon): boolean {
    if (!this.isValid(coupon)) {
      return false;
    }

    // Pour les codes partagés, vérifier s'il reste des utilisations
    if (!coupon.isUnique && coupon.remainingUses !== undefined) {
      return coupon.remainingUses > 0;
    }

    return true;
  }

  // Vérifier si un coupon est utilisable par un utilisateur spécifique
  static isAvailableForUser(coupon: Coupon, userId: string): boolean {
    if (!this.isAvailable(coupon)) {
      return false;
    }

    // Si c'est un code personnel, vérifier l'utilisateur assigné
    if (coupon.assignedUserId) {
      return coupon.assignedUserId === userId;
    }

    // Pour les codes non personnels, accessible à tous
    return true;
  }

  // Obtenir le statut affichable du coupon
  static getDisplayStatus(coupon: Coupon): { text: string; class: string; color: string } {
    const now = new Date();
    const validFrom = new Date(coupon.validFrom);
    const validUntil = new Date(coupon.validUntil);

    if (coupon.status === OfferStatus.INACTIVE) {
      return { text: 'Inactif', class: 'inactive', color: '#a0aec0' };
    }

    if (coupon.status === OfferStatus.EXPIRED || now > validUntil) {
      return { text: 'Expiré', class: 'expired', color: '#f56565' };
    }

    if (now < validFrom) {
      return { text: 'Planifié', class: 'scheduled', color: '#ecc94b' };
    }

    if (!coupon.isUnique && coupon.remainingUses !== undefined && coupon.remainingUses <= 0) {
      return { text: 'Épuisé', class: 'exhausted', color: '#ed8936' };
    }

    return { text: 'Actif', class: 'active', color: '#48bb78' };
  }

  // Formater le type de coupon pour l'affichage
  static getCouponTypeLabel(coupon: Coupon): string {
    if (coupon.assignedUserId) {
      return 'Personnel';
    }
    return coupon.isUnique ? 'Unique' : 'Partagé';
  }

  // Obtenir le nombre d'utilisations restantes
  static getRemainingUses(coupon: Coupon): number | string {
    if (coupon.isUnique) {
      return 'Usage unique';
    }
    if (coupon.remainingUses !== undefined) {
      return coupon.remainingUses;
    }
    if (coupon.maxUses !== undefined) {
      return coupon.maxUses;
    }
    return 'Illimité';
  }

  // Créer un AppliedCouponDTO pour un succès
  static createSuccessAppliedCoupon(
    message: string,
    couponCode: string,
    originalPrice: number,
    finalPrice: number
  ): AppliedCouponDTO {
    return {
      success: true,
      message,
      couponCode,
      originalPrice,
      finalPrice,
      discountAmount: originalPrice - finalPrice
    };
  }

  // Créer un AppliedCouponDTO pour une erreur
  static createErrorAppliedCoupon(message: string): AppliedCouponDTO {
    return {
      success: false,
      message
    };
  }

  // Convertir un Coupon en format pour formulaire
  static couponToFormValue(coupon: Coupon): any {
    return {
      code: coupon.code,
      offerId: coupon.offerId,
      description: coupon.description,
      isUnique: coupon.isUnique,
      assignedUserId: coupon.assignedUserId || '',
      validFrom: coupon.validFrom,
      validUntil: coupon.validUntil,
      maxUses: coupon.maxUses || '',
      status: coupon.status
    };
  }
}

// Constantes pour les libellés
export const COUPON_STATUS_LABELS: Record<OfferStatus, string> = {
  [OfferStatus.ACTIVE]: 'Actif',
  [OfferStatus.INACTIVE]: 'Inactif',
  [OfferStatus.EXPIRED]: 'Expiré',
  [OfferStatus.SCHEDULED]: 'Planifié'
};

// Constantes pour les couleurs des statuts
export const COUPON_STATUS_COLORS: Record<OfferStatus, string> = {
  [OfferStatus.ACTIVE]: '#48bb78',
  [OfferStatus.INACTIVE]: '#a0aec0',
  [OfferStatus.EXPIRED]: '#f56565',
  [OfferStatus.SCHEDULED]: '#ecc94b'
};

// Options pour les types de coupon dans les formulaires
export interface CouponTypeOption {
  value: boolean;
  label: string;
  description: string;
  requiresUser: boolean;
}

export const COUPON_TYPE_OPTIONS: CouponTypeOption[] = [
  {
    value: false,
    label: 'Code partagé',
    description: 'Utilisable par plusieurs utilisateurs',
    requiresUser: false
  },
  {
    value: true,
    label: 'Code unique',
    description: 'Code à usage unique (non personnel)',
    requiresUser: false
  }
];

// Règles de validation
export const COUPON_VALIDATION_RULES = {
  code: {
    required: true,
    minlength: 3,
    maxlength: 50,
    pattern: '^[A-Z0-9_-]+$'
  },
  description: {
    required: true,
    minlength: 5,
    maxlength: 200
  },
  maxUses: {
    min: 1,
    max: 999999
  }
};
