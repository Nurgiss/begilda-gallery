export interface Painting {
  id: string | number;
  title: string;
  artist?: string;
  year: number;
  price: number;
  priceUSD?: number;
  priceEUR?: number;
  image: string;
  description: string;
  dimensions: string;
  medium: string;
  category?: string;
  availability: boolean;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
