// Enum pour le type d'offre
export enum OfferType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED = 'FIXED_AMOUNT'
}

// Enum pour le statut
export enum OfferStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  EXPIRED = 'EXPIRED',
  SCHEDULED = 'SCHEDULED'
}


// Interface de base correspondant à l'entité backend
export interface Offer {
  id: string;
  name: string;
  description: string;
  type: OfferType;
  value: number;
  courseIds?: string[];
  categoryIds?: string[];
  userIds?: string[];
  startDate: Date;
  endDate: Date;
  maxUses?: number;
  maxUsesPerUser?: number;
  currentUses: number;
  status: OfferStatus;
  createdAt: Date;
  updatedAt: Date;
}

// Correspond exactement à votre OfferResponseDTO backend
export interface OfferResponseDTO {
  id: string;
  name: string;
  description: string;
  type: OfferType;
  value: number;
  courseIds?: string[];
  categoryIds?: string[];
  userIds?: string[];
  startDate: Date;
  endDate: Date;
  maxUses?: number;
  maxUsesPerUser?: number;
  currentUses: number;
  status: OfferStatus;
  createdAt: Date;
  updatedAt: Date;
}

// Correspond exactement à votre OfferRequestDTO backend
export interface OfferRequestDTO {
  name: string;
  description: string;
  type: OfferType;
  value: number;
  courseIds?: string[];
  categoryIds?: string[];
  userIds?: string[];
  startDate: Date;
  endDate: Date;
  maxUses?: number;
  maxUsesPerUser?: number;
}

// Correspond exactement à votre AppliedOfferDTO backend
export interface AppliedOfferDTO {
  originalPrice: number;
  finalPrice: number;
  totalDiscount: number;
  discountPercentage: number;
  success: boolean;
  messages: string[];
  appliedOffers?: Array<{
    offerId: string;
    offerName: string;
    offerType: string;
    discountValue: number;
    description: string;
  }>;
}
