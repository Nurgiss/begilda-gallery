import type { Painting } from '@/types/models/Painting';
import type { Exhibition } from '@/types/models/Exhibition';
import type { Artist } from '@/types/models/Artist';
import type { News } from '@/types/models/News';
import type { ShopItem } from '@/types/models/ShopItem';
import type { Order } from '@/types/models/Order';
import type { PickupPoint } from '@/types/models/PickupPoint';
import type {
  LoginRequest,
  LoginResponse,
  CreatePaintingRequest,
  UpdatePaintingRequest,
  CreateExhibitionRequest,
  UpdateExhibitionRequest,
  CreateArtistRequest,
  UpdateArtistRequest,
  CreateNewsRequest,
  UpdateNewsRequest,
  CreateShopItemRequest,
  UpdateShopItemRequest,
  CreateOrderRequest,
  UpdateOrderRequest,
  CreatePickupPointRequest,
  UpdatePickupPointRequest,
  UploadResponse,
  DeleteResponse,
} from '@/types/api';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Auth error callback - set by AdminApp to handle logout on token expiry
let onAuthError: (() => void) | null = null;

export function setAuthErrorHandler(handler: () => void): void {
  onAuthError = handler;
}

export function clearAuthErrorHandler(): void {
  onAuthError = null;
}

function handleAuthError(): void {
  try {
    localStorage.removeItem('adminToken');
  } catch {
    // Ignore localStorage errors in SSR or restricted contexts
  }
  // Notify the app about auth failure (e.g., token expired)
  if (onAuthError) {
    onAuthError();
  }
}

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  try {
    const token = localStorage.getItem('adminToken');
    if (token) headers['Authorization'] = `Bearer ${token}`;
  } catch {
    // Ignore localStorage errors
  }
  return headers;
}

async function getJSON<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { headers: getHeaders() });
  if (res.status === 401 || res.status === 403) {
    handleAuthError();
  }
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json() as Promise<T>;
}

async function postJSON<TReq, TRes>(path: string, data: TReq): Promise<TRes> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  if (res.status === 401 || res.status === 403) {
    handleAuthError();
  }
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json() as Promise<TRes>;
}

async function putJSON<TReq, TRes>(path: string, data: TReq): Promise<TRes> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  if (res.status === 401 || res.status === 403) {
    handleAuthError();
  }
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json() as Promise<TRes>;
}

async function deleteJSON<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  if (res.status === 401 || res.status === 403) {
    handleAuthError();
  }
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json() as Promise<T>;
}

// ==================== AUTH ====================
export function login(username: string, password: string): Promise<LoginResponse> {
  return postJSON<LoginRequest, LoginResponse>('/auth/login', { username, password });
}

// ==================== PAINTINGS ====================
export function getPaintings(): Promise<Painting[]> {
  return getJSON<Painting[]>('/paintings');
}

export function getPainting(id: string): Promise<Painting> {
  return getJSON<Painting>(`/paintings/${id}`);
}

export function createPainting(data: CreatePaintingRequest): Promise<Painting> {
  return postJSON<CreatePaintingRequest, Painting>('/paintings', data);
}

export function updatePainting(id: string, data: UpdatePaintingRequest): Promise<Painting> {
  return putJSON<UpdatePaintingRequest, Painting>(`/paintings/${id}`, data);
}

export function deletePainting(id: string): Promise<DeleteResponse> {
  return deleteJSON<DeleteResponse>(`/paintings/${id}`);
}

// ==================== EXHIBITIONS ====================
export function getExhibitions(): Promise<Exhibition[]> {
  return getJSON<Exhibition[]>('/exhibitions');
}

export function getExhibition(id: string): Promise<Exhibition> {
  return getJSON<Exhibition>(`/exhibitions/${id}`);
}

export function createExhibition(data: CreateExhibitionRequest): Promise<Exhibition> {
  return postJSON<CreateExhibitionRequest, Exhibition>('/exhibitions', data);
}

export function updateExhibition(id: string, data: UpdateExhibitionRequest): Promise<Exhibition> {
  return putJSON<UpdateExhibitionRequest, Exhibition>(`/exhibitions/${id}`, data);
}

export function deleteExhibition(id: string): Promise<DeleteResponse> {
  return deleteJSON<DeleteResponse>(`/exhibitions/${id}`);
}

// ==================== ARTISTS ====================
export function getArtists(): Promise<Artist[]> {
  return getJSON<Artist[]>('/artists');
}

export function getArtist(id: string): Promise<Artist> {
  return getJSON<Artist>(`/artists/${id}`);
}

export function createArtist(data: CreateArtistRequest): Promise<Artist> {
  return postJSON<CreateArtistRequest, Artist>('/artists', data);
}

export function updateArtist(id: string, data: UpdateArtistRequest): Promise<Artist> {
  return putJSON<UpdateArtistRequest, Artist>(`/artists/${id}`, data);
}

export function deleteArtist(id: string): Promise<DeleteResponse> {
  return deleteJSON<DeleteResponse>(`/artists/${id}`);
}

// ==================== NEWS ====================
export function getNews(): Promise<News[]> {
  return getJSON<News[]>('/news');
}

export function getNewsArticle(id: string): Promise<News> {
  return getJSON<News>(`/news/${id}`);
}

export function createNews(data: CreateNewsRequest): Promise<News> {
  return postJSON<CreateNewsRequest, News>('/news', data);
}

export function updateNews(id: string, data: UpdateNewsRequest): Promise<News> {
  return putJSON<UpdateNewsRequest, News>(`/news/${id}`, data);
}

export function deleteNews(id: string): Promise<DeleteResponse> {
  return deleteJSON<DeleteResponse>(`/news/${id}`);
}

// ==================== SHOP ====================
export function getShopItems(): Promise<ShopItem[]> {
  return getJSON<ShopItem[]>('/shop');
}

export function getShopItem(id: string): Promise<ShopItem> {
  return getJSON<ShopItem>(`/shop/${id}`);
}

export function createShopItem(data: CreateShopItemRequest): Promise<ShopItem> {
  return postJSON<CreateShopItemRequest, ShopItem>('/shop', data);
}

export function updateShopItem(id: string, data: UpdateShopItemRequest): Promise<ShopItem> {
  return putJSON<UpdateShopItemRequest, ShopItem>(`/shop/${id}`, data);
}

export function deleteShopItem(id: string): Promise<DeleteResponse> {
  return deleteJSON<DeleteResponse>(`/shop/${id}`);
}

// ==================== ORDERS ====================
export function getOrders(): Promise<Order[]> {
  return getJSON<Order[]>('/orders');
}

export function getOrder(id: string): Promise<Order> {
  return getJSON<Order>(`/orders/${id}`);
}

export function createOrder(data: CreateOrderRequest): Promise<Order> {
  return postJSON<CreateOrderRequest, Order>('/orders', data);
}

export function updateOrder(id: string, data: UpdateOrderRequest): Promise<Order> {
  return putJSON<UpdateOrderRequest, Order>(`/orders/${id}`, data);
}

export function deleteOrder(id: string): Promise<DeleteResponse> {
  return deleteJSON<DeleteResponse>(`/orders/${id}`);
}

// ==================== PICKUP POINTS ====================
export function getPickupPoints(): Promise<PickupPoint[]> {
  return getJSON<PickupPoint[]>('/pickup-points');
}

export function createPickupPoint(data: CreatePickupPointRequest): Promise<PickupPoint> {
  return postJSON<CreatePickupPointRequest, PickupPoint>('/pickup-points', data);
}

export function updatePickupPoint(id: string, data: UpdatePickupPointRequest): Promise<PickupPoint> {
  return putJSON<UpdatePickupPointRequest, PickupPoint>(`/pickup-points/${id}`, data);
}

export function deletePickupPoint(id: string): Promise<DeleteResponse> {
  return deleteJSON<DeleteResponse>(`/pickup-points/${id}`);
}

// ==================== UPLOAD ====================
export async function uploadImage(file: File): Promise<UploadResponse> {
  const fd = new FormData();
  fd.append('image', file);
  const headers = getHeaders();
  delete headers['Content-Type'];

  const res = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    body: fd,
    headers,
  });
  if (!res.ok) throw new Error(`Upload failed ${res.status}`);
  return res.json() as Promise<UploadResponse>;
}

export default {
  setAuthErrorHandler,
  clearAuthErrorHandler,
  login,
  getPaintings,
  getPainting,
  createPainting,
  updatePainting,
  deletePainting,
  getExhibitions,
  getExhibition,
  createExhibition,
  updateExhibition,
  deleteExhibition,
  getArtists,
  getArtist,
  createArtist,
  updateArtist,
  deleteArtist,
  getNews,
  getNewsArticle,
  createNews,
  updateNews,
  deleteNews,
  getShopItems,
  getShopItem,
  createShopItem,
  updateShopItem,
  deleteShopItem,
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
  getPickupPoints,
  createPickupPoint,
  updatePickupPoint,
  deletePickupPoint,
  uploadImage,
};
