export interface Painting {
  id: string | number;
  title: string;
  artist?: string;
  year: string;
  price: number;
  priceUSD?: number;
  priceEUR?: number;
  image: string;
  imageUrl?: string;
  description: string;
  dimensions: string;
  size?: string;
  medium: string;
  category?: string;
  availability: boolean;
  featured?: boolean;
  exhibitionOnly?: boolean;
  hidden?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
