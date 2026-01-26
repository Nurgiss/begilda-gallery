import { getDb } from '../db/index.js';
import { v4 as uuidv4 } from 'uuid';
import type { PaintingRow, Painting, CreatePaintingInput, UpdatePaintingInput } from '../types/db.js';

function toApiFormat(row: PaintingRow | undefined): Painting | null {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    artist: row.artist_name,
    year: row.year ?? undefined,
    price: row.price ?? undefined,
    priceUSD: row.price_usd ?? undefined,
    priceEUR: row.price_eur ?? undefined,
    image: row.image ?? undefined,
    imageUrl: row.image_url ?? undefined,
    description: row.description ?? undefined,
    dimensions: row.dimensions ?? undefined,
    size: row.size ?? undefined,
    medium: row.medium ?? undefined,
    category: row.category ?? undefined,
    availability: Boolean(row.availability),
    featured: Boolean(row.featured),
    exhibitionOnly: Boolean(row.exhibition_only),
    createdAt: row.created_at,
    updatedAt: row.updated_at ?? undefined,
  };
}

export function getAll(): Painting[] {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM paintings ORDER BY created_at DESC').all() as PaintingRow[];
  return rows.map((row) => toApiFormat(row)!);
}

export function getById(id: string): Painting | null {
  const db = getDb();
  const row = db.prepare('SELECT * FROM paintings WHERE id = ?').get(id) as PaintingRow | undefined;
  return toApiFormat(row);
}

export function create(data: CreatePaintingInput): Painting {
  const db = getDb();
  const id = uuidv4();
  const now = new Date().toISOString();

  // Try to find artist_id by name
  let artistId: string | null = null;
  if (data.artist) {
    const artist = db.prepare('SELECT id FROM artists WHERE name = ?').get(data.artist) as { id: string } | undefined;
    artistId = artist?.id ?? null;
  }

  db.prepare(`
    INSERT INTO paintings (
      id, title, artist_name, artist_id, year, price, price_usd, price_eur,
      image, image_url, description, dimensions, size, medium, category,
      availability, featured, exhibition_only, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    data.title,
    data.artist ?? null,
    artistId,
    data.year ?? null,
    data.price ?? null,
    data.priceUSD ?? null,
    data.priceEUR ?? null,
    data.image ?? null,
    data.imageUrl ?? null,
    data.description ?? null,
    data.dimensions ?? null,
    data.size ?? null,
    data.medium ?? null,
    data.category ?? null,
    data.availability !== false ? 1 : 0,
    data.featured ? 1 : 0,
    data.exhibitionOnly ? 1 : 0,
    now
  );

  return getById(id)!;
}

export function update(id: string, data: UpdatePaintingInput): Painting | null {
  const db = getDb();
  const existing = getById(id);
  if (!existing) return null;

  const now = new Date().toISOString();
  const fields: string[] = [];
  const values: (string | number | null)[] = [];

  const fieldMap: Record<string, string> = {
    title: 'title',
    artist: 'artist_name',
    year: 'year',
    price: 'price',
    priceUSD: 'price_usd',
    priceEUR: 'price_eur',
    image: 'image',
    imageUrl: 'image_url',
    description: 'description',
    dimensions: 'dimensions',
    size: 'size',
    medium: 'medium',
    category: 'category',
  };

  for (const [apiKey, dbKey] of Object.entries(fieldMap)) {
    const value = data[apiKey as keyof UpdatePaintingInput];
    if (value !== undefined) {
      fields.push(`${dbKey} = ?`);
      values.push(value as string | number | null);
    }
  }

  // Handle booleans separately
  if (data.availability !== undefined) {
    fields.push('availability = ?');
    values.push(data.availability ? 1 : 0);
  }
  if (data.featured !== undefined) {
    fields.push('featured = ?');
    values.push(data.featured ? 1 : 0);
  }
  if (data.exhibitionOnly !== undefined) {
    fields.push('exhibition_only = ?');
    values.push(data.exhibitionOnly ? 1 : 0);
  }

  // Update artist_id if artist name changed
  if (data.artist !== undefined) {
    let artistId: string | null = null;
    if (data.artist) {
      const artist = db.prepare('SELECT id FROM artists WHERE name = ?').get(data.artist) as { id: string } | undefined;
      artistId = artist?.id ?? null;
    }
    fields.push('artist_id = ?');
    values.push(artistId);
  }

  if (fields.length === 0) {
    return existing;
  }

  fields.push('updated_at = ?');
  values.push(now);
  values.push(id);

  db.prepare(`UPDATE paintings SET ${fields.join(', ')} WHERE id = ?`).run(...values);
  return getById(id);
}

export function remove(id: string): boolean {
  const db = getDb();
  const result = db.prepare('DELETE FROM paintings WHERE id = ?').run(id);
  return result.changes > 0;
}
