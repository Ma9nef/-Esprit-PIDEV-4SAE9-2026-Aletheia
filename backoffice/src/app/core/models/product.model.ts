export type ProductType = 'BOOK' | 'EBOOK' | 'AUDIOBOOK' | 'MAGAZINE';

export interface Product {
  id?: number;
  title: string;
  description?: string;
  author?: string;
  type: ProductType;
  price: number;
  fileUrl?: string;
  coverImageUrl?: string;
  available: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductFilter {
  search?: string;
  type?: ProductType | null;
  available?: boolean | null;
}
