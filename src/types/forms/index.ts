// Form data types for admin managers
// These represent the shape of form state in admin components

export interface PaintingFormData {
  title: string;
  artist: string;
  year: number;
  priceUSD: number;
  dimensions: string;
  category: string;
  description: string;
  image: string;
  medium: string;
  availability: boolean;
  featured: boolean;
  exhibitionOnly: boolean;
}

export interface ExhibitionFormData {
  title: string;
  artist: string;
  location: string;
  dates: string;
  description: string;
  image: string;
  status: 'current' | 'upcoming' | 'past';
  paintingIds?: string[];
}

export interface ArtistFormData {
  name: string;
  bio: string;
  image: string;
  nationality: string;
  born: string;
}

export interface NewsFormData {
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  category: string;
  instagramUrl: string;
}

export interface ShopItemFormData {
  title: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

// Checkout form types
import type { DeliveryType } from '../common/DeliveryType';

export interface CheckoutFormData {
  fullName: string;
  email: string;
  phone: string;
  deliveryType: DeliveryType;
  pickupPoint: string;
  countryCode: string;
  country: string;
  postalCode: string;
  city: string;
  address: string;
}

export interface CheckoutFormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  pickupPoint?: string;
  country?: string;
  postalCode?: string;
  city?: string;
  address?: string;
}
