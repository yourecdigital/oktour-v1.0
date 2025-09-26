export interface Tour {
  id: number;
  title: string;
  description: string;
  price: number;
  duration: string;
  location: string;
  imageUrl?: string;
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TourCategory {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface TourFilter {
  category?: string;
  priceMin?: number;
  priceMax?: number;
  location?: string;
  isActive?: boolean;
}
