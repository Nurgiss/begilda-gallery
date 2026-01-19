export interface Artwork {
  id: string | number;
  title: string;
  artist?: string;
  year: string;
  medium: string;
  dimensions: string;
  image: string;
  price?: number;
  priceUSD?: number;
  priceEUR?: number;
  exhibitionId?: string | number;
  category?: string;
  availability?: boolean;
  featured?: boolean;
}
