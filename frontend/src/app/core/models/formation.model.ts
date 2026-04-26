export interface Formation {
  id: number;
  instructorId: number;
  title: string;
  description: string;
  duration: number;
  capacity: number;
  archived: boolean;

  location?: string;
  startDate?: string;
  endDate?: string;
  level?: string;
  objective?: string;
  prerequisites?: string;

  productId?: number;
  productTitle?: string;
  productDescription?: string;
  productAuthor?: string;
  productType?: string;
  productPrice?: number;
  productFileUrl?: string;
  productCoverImageUrl?: string;
}
