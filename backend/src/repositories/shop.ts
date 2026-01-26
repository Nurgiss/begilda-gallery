import { getDb } from '../db/index.js';
import { v4 as uuidv4 } from 'uuid';
import type { ShopItemRow, ShopItem, CreateShopItemInput, UpdateShopItemInput } from '../types/db.js';

function toApiFormat(row: ShopItemRow | undefined): ShopItem | null {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    artist: row.artist ?? undefined,
    price: row.price ?? undefined,
    priceUSD: row.price_usd ?? undefined,
    priceEUR: row.price_eur ?? undefined,
    image: row.image ?? undefined,
    imageUrl: row.image_url ?? undefined,
    category: row.category ?? undefined,
    description: row.description ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at ?? undefined,
  };
}

export function getAll(): ShopItem[] {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM shop_items ORDER BY created_at DESC').all() as ShopItemRow[];
  return rows.map((row) => toApiFormat(row)!);
}

export function getById(id: string): ShopItem | null {
  const db = getDb();
  const row = db.prepare('SELECT * FROM shop_items WHERE id = ?').get(id) as ShopItemRow | undefined;
  return toApiFormat(row);
}

export function create(data: CreateShopItemInput): ShopItem {
  const db = getDb();
  const id = uuidv4();
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO shop_items (id, title, artist, price, price_usd, price_eur, image, image_url, category, description, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    data.title,
    data.artist ?? null,
    data.price ?? null,
    data.priceUSD ?? null,
    data.priceEUR ?? null,
    data.image ?? null,
    data.imageUrl ?? null,
    data.category ?? null,
    data.description ?? null,
    now
  );

  return getById(id)!;
}

export function update(id: string, data: UpdateShopItemInput): ShopItem | null {
  const db = getDb();
  const existing = getById(id);
  if (!existing) return null;

  const now = new Date().toISOString();
  const fields: string[] = [];
  const values: (string | number | null)[] = [];

  if (data.title !== undefined) {
    fields.push('title = ?');
    values.push(data.title);
  }
  if (data.artist !== undefined) {
    fields.push('artist = ?');
    values.push(data.artist ?? null);
  }
  if (data.price !== undefined) {
    fields.push('price = ?');
    values.push(data.price ?? null);
  }
  if (data.priceUSD !== undefined) {
    fields.push('price_usd = ?');
    values.push(data.priceUSD ?? null);
  }
  if (data.priceEUR !== undefined) {
    fields.push('price_eur = ?');
    values.push(data.priceEUR ?? null);
  }
  if (data.image !== undefined) {
    fields.push('image = ?');
    values.push(data.image ?? null);
  }
  if (data.imageUrl !== undefined) {
    fields.push('image_url = ?');
    values.push(data.imageUrl ?? null);
  }
  if (data.category !== undefined) {
    fields.push('category = ?');
    values.push(data.category ?? null);
  }
  if (data.description !== undefined) {
    fields.push('description = ?');
    values.push(data.description ?? null);
  }

  if (fields.length === 0) {
    return existing;
  }

  fields.push('updated_at = ?');
  values.push(now);
  values.push(id);

  db.prepare(`UPDATE shop_items SET ${fields.join(', ')} WHERE id = ?`).run(...values);
  return getById(id);
}

export function remove(id: string): boolean {
  const db = getDb();
  const result = db.prepare('DELETE FROM shop_items WHERE id = ?').run(id);
  return result.changes > 0;
}
