// Database row types (snake_case, matches SQL schema)
// These types represent the raw data from SQLite

export interface ArtistRow {
  id: string;
  name: string;
  bio: string | null;
  image: string | null;
  nationality: string | null;
  born: string | null;
  specialty: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface PaintingRow {
  id: string;
  title: string;
  artist_id: string | null;
  artist_name: string | null;
  year: number | null;
  price: number | null;
  price_usd: number | null;
  price_eur: number | null;
  image: string | null;
  image_url: string | null;
  description: string | null;
  dimensions: string | null;
  size: string | null;
  medium: string | null;
  category: string | null;
  availability: number; // SQLite boolean (0/1)
  featured: number;
  exhibition_only: number;
  created_at: string;
  updated_at: string | null;
}

export interface ExhibitionRow {
  id: string;
  title: string;
  artist: string | null;
  location: string | null;
  dates: string | null;
  description: string | null;
  image: string | null;
  image_url: string | null;
  status: 'current' | 'upcoming' | 'past';
  created_at: string;
  updated_at: string | null;
}

export interface ExhibitionPaintingRow {
  exhibition_id: string;
  painting_id: string;
  display_order: number;
}

export interface NewsRow {
  id: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  image: string | null;
  date: string | null;
  category: string | null;
  instagram_url: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface ShopItemRow {
  id: string;
  title: string;
  artist: string | null;
  price: number | null;
  price_usd: number | null;
  price_eur: number | null;
  image: string | null;
  image_url: string | null;
  category: string | null;
  description: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface PickupPointRow {
  id: string;
  name: string;
  address: string | null;
  city: string | null;
  phone: string | null;
  working_hours: string | null;
  is_active: number; // SQLite boolean
  created_at: string;
  updated_at: string | null;
}

export interface OrderRow {
  id: string;
  full_name: string | null;
  email: string;
  phone: string | null;
  delivery_type: 'pickup' | 'delivery' | null;
  pickup_point_id: string | null;
  country: string | null;
  postal_code: string | null;
  city: string | null;
  address: string | null;
  total_amount: number | null;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string | null;
}

export interface OrderItemRow {
  id: number;
  order_id: string;
  item_id: string;
  item_type: 'painting' | 'shop';
  title: string | null;
  price: number | null;
  quantity: number;
}

// API response types (camelCase, matches frontend expectations)
// These are used when returning data to the client

export interface Artist {
  id: string;
  name: string;
  bio?: string | null;
  image?: string | null;
  nationality?: string | null;
  born?: string | null;
  specialty?: string | null;
  createdAt?: string;
  updatedAt?: string | null;
}

export interface Painting {
  id: string;
  title: string;
  artist?: string | null;
  year?: number | null;
  price?: number | null;
  priceUSD?: number | null;
  priceEUR?: number | null;
  image?: string | null;
  imageUrl?: string | null;
  description?: string | null;
  dimensions?: string | null;
  size?: string | null;
  medium?: string | null;
  category?: string | null;
  availability?: boolean;
  featured?: boolean;
  exhibitionOnly?: boolean;
  createdAt?: string;
  updatedAt?: string | null;
}

export interface Exhibition {
  id: string;
  title: string;
  artist?: string | null;
  location?: string | null;
  dates?: string | null;
  description?: string | null;
  image?: string | null;
  imageUrl?: string | null;
  status?: 'current' | 'upcoming' | 'past';
  paintingIds?: string[];
  createdAt?: string;
  updatedAt?: string | null;
}

export interface News {
  id: string;
  title: string;
  excerpt?: string | null;
  content?: string | null;
  image?: string | null;
  date?: string | null;
  category?: string | null;
  instagramUrl?: string | null;
  createdAt?: string;
  updatedAt?: string | null;
}

export interface ShopItem {
  id: string;
  title: string;
  artist?: string | null;
  price?: number | null;
  priceUSD?: number | null;
  priceEUR?: number | null;
  image?: string | null;
  imageUrl?: string | null;
  category?: string | null;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string | null;
}

export interface PickupPoint {
  id: string;
  name: string;
  address?: string | null;
  city?: string | null;
  phone?: string | null;
  workingHours?: string | null;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string | null;
}

export interface OrderItem {
  itemId: string;
  itemType: 'painting' | 'shop';
  title?: string | null;
  price?: number | null;
  quantity: number;
}

export interface Order {
  id: string;
  fullName?: string | null;
  email: string;
  phone?: string | null;
  deliveryType?: 'pickup' | 'delivery' | null;
  pickupPoint?: string | null;
  country?: string | null;
  postalCode?: string | null;
  city?: string | null;
  address?: string | null;
  items: OrderItem[];
  totalAmount?: number | null;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  createdAt?: string;
  updatedAt?: string | null;
}

// Input types for create/update operations
export type CreateArtistInput = Omit<Artist, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateArtistInput = Partial<CreateArtistInput>;

export type CreatePaintingInput = Omit<Painting, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdatePaintingInput = Partial<CreatePaintingInput>;

export type CreateExhibitionInput = Omit<Exhibition, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateExhibitionInput = Partial<CreateExhibitionInput>;

export type CreateNewsInput = Omit<News, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateNewsInput = Partial<CreateNewsInput>;

export type CreateShopItemInput = Omit<ShopItem, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateShopItemInput = Partial<CreateShopItemInput>;

export type CreatePickupPointInput = Omit<PickupPoint, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdatePickupPointInput = Partial<CreatePickupPointInput>;

export type CreateOrderInput = Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'status'>;
export type UpdateOrderInput = Partial<Omit<Order, 'id' | 'createdAt'>>;
