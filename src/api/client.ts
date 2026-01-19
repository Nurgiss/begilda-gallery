const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

function getHeaders() {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  try {
    const token = localStorage.getItem('adminToken');
    if (token) headers['Authorization'] = `Bearer ${token}`;
  } catch (e) {}
  return headers;
}

async function getJSON(path: string) {
  const res = await fetch(`${API_BASE}${path}`, { headers: getHeaders() });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

async function postJSON(path: string, data: any) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

async function putJSON(path: string, data: any) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

async function deleteJSON(path: string) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

// ==================== PAINTINGS ====================
export function getPaintings() {
  return getJSON('/paintings');
}

export function getPainting(id: string) {
  return getJSON(`/paintings/${id}`);
}

export function createPainting(data: any) {
  return postJSON('/paintings', data);
}

export function updatePainting(id: string, data: any) {
  return putJSON(`/paintings/${id}`, data);
}

export function deletePainting(id: string) {
  return deleteJSON(`/paintings/${id}`);
}

// ==================== EXHIBITIONS ====================
export function getExhibitions() {
  return getJSON('/exhibitions');
}

export function getExhibition(id: string) {
  return getJSON(`/exhibitions/${id}`);
}

export function createExhibition(data: any) {
  return postJSON('/exhibitions', data);
}

export function updateExhibition(id: string, data: any) {
  return putJSON(`/exhibitions/${id}`, data);
}

export function deleteExhibition(id: string) {
  return deleteJSON(`/exhibitions/${id}`);
}

// ==================== ARTISTS ====================
export function getArtists() {
  return getJSON('/artists');
}

export function getArtist(id: string) {
  return getJSON(`/artists/${id}`);
}

export function createArtist(data: any) {
  return postJSON('/artists', data);
}

export function updateArtist(id: string, data: any) {
  return putJSON(`/artists/${id}`, data);
}

export function deleteArtist(id: string) {
  return deleteJSON(`/artists/${id}`);
}

// ==================== NEWS ====================
export function getNews() {
  return getJSON('/news');
}

export function getNewsArticle(id: string) {
  return getJSON(`/news/${id}`);
}

export function createNews(data: any) {
  return postJSON('/news', data);
}

export function updateNews(id: string, data: any) {
  return putJSON(`/news/${id}`, data);
}

export function deleteNews(id: string) {
  return deleteJSON(`/news/${id}`);
}

// ==================== SHOP ====================
export function getShopItems() {
  return getJSON('/shop');
}

export function getShopItem(id: string) {
  return getJSON(`/shop/${id}`);
}

export function createShopItem(data: any) {
  return postJSON('/shop', data);
}

export function updateShopItem(id: string, data: any) {
  return putJSON(`/shop/${id}`, data);
}

export function deleteShopItem(id: string) {
  return deleteJSON(`/shop/${id}`);
}

// ==================== ORDERS ====================
export function getOrders() {
  return getJSON('/orders');
}

export function getOrder(id: string) {
  return getJSON(`/orders/${id}`);
}

export function createOrder(data: any) {
  return postJSON('/orders', data);
}

export function updateOrder(id: string, data: any) {
  return putJSON(`/orders/${id}`, data);
}

export function deleteOrder(id: string) {
  return deleteJSON(`/orders/${id}`);
}

// ==================== PICKUP POINTS ====================
export function getPickupPoints() {
  return getJSON('/pickup-points');
}

export function createPickupPoint(data: any) {
  return postJSON('/pickup-points', data);
}

export function updatePickupPoint(id: string, data: any) {
  return putJSON(`/pickup-points/${id}`, data);
}

export function deletePickupPoint(id: string) {
  return deleteJSON(`/pickup-points/${id}`);
}

// ==================== UPLOAD ====================
export async function uploadImage(file: File) {
  const fd = new FormData();
  fd.append('image', file);
  const headers = getHeaders();
  delete headers['Content-Type']; // Let browser set it for FormData

  // Backend exposes POST /api/upload
  const res = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    body: fd,
    headers,
  });
  if (!res.ok) throw new Error(`Upload failed ${res.status}`);
  return res.json();
}

export default {
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

