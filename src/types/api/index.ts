import type { Painting } from '../models/Painting';
import type { Exhibition } from '../models/Exhibition';
import type { Artist } from '../models/Artist';
import type { News } from '../models/News';
import type { ShopItem } from '../models/ShopItem';
import type { Order } from '../models/Order';
import type { PickupPoint } from '../models/PickupPoint';

// Auth
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user?: {
    id: string;
    username: string;
  };
}

// Paintings
export type CreatePaintingRequest = Omit<Painting, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdatePaintingRequest = Partial<CreatePaintingRequest>;

// Exhibitions
export type CreateExhibitionRequest = Omit<Exhibition, 'id'>;
export type UpdateExhibitionRequest = Partial<CreateExhibitionRequest>;

// Artists
export type CreateArtistRequest = Omit<Artist, 'id'>;
export type UpdateArtistRequest = Partial<CreateArtistRequest>;

// News
export type CreateNewsRequest = Omit<News, 'id'>;
export type UpdateNewsRequest = Partial<CreateNewsRequest>;

// Shop Items
export type CreateShopItemRequest = Omit<ShopItem, 'id'>;
export type UpdateShopItemRequest = Partial<CreateShopItemRequest>;

// Orders
export type CreateOrderRequest = Omit<Order, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateOrderRequest = Partial<Omit<Order, 'id' | 'createdAt'>>;

// Pickup Points
export type CreatePickupPointRequest = Omit<PickupPoint, 'id' | 'createdAt'>;
export type UpdatePickupPointRequest = Partial<CreatePickupPointRequest>;

// Upload
export interface UploadResponse {
  url: string;
  original?: string;
  thumb?: string;
  webp?: string;
}

// Generic API response types
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export interface DeleteResponse {
  success: boolean;
}
