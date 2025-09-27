export interface HeroFile {
  id: number;
  page: string;
  type: 'image' | 'video';
  url: string;
  thumbnailUrl?: string;
  alt?: string;
  title?: string;
  description?: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface HeroBackground {
  id: number;
  page: string;
  type: 'image' | 'video';
  url: string;
  thumbnailUrl?: string;
  fallbackUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HeroSection {
  id: number;
  page: string;
  title: string;
  subtitle?: string;
  description?: string;
  ctaText?: string;
  ctaUrl?: string;
  background: HeroBackground;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

