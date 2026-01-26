import { getDb } from '../db/index.js';
import { v4 as uuidv4 } from 'uuid';
import type { NewsRow, News, CreateNewsInput, UpdateNewsInput } from '../types/db.js';

function toApiFormat(row: NewsRow | undefined): News | null {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    excerpt: row.excerpt ?? undefined,
    content: row.content ?? undefined,
    image: row.image ?? undefined,
    date: row.date ?? undefined,
    category: row.category ?? undefined,
    instagramUrl: row.instagram_url ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at ?? undefined,
  };
}

export function getAll(): News[] {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM news ORDER BY date DESC, created_at DESC').all() as NewsRow[];
  return rows.map((row) => toApiFormat(row)!);
}

export function getById(id: string): News | null {
  const db = getDb();
  const row = db.prepare('SELECT * FROM news WHERE id = ?').get(id) as NewsRow | undefined;
  return toApiFormat(row);
}

export function create(data: CreateNewsInput): News {
  const db = getDb();
  const id = uuidv4();
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO news (id, title, excerpt, content, image, date, category, instagram_url, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    data.title,
    data.excerpt ?? null,
    data.content ?? null,
    data.image ?? null,
    data.date ?? null,
    data.category ?? null,
    data.instagramUrl ?? null,
    now
  );

  return getById(id)!;
}

export function update(id: string, data: UpdateNewsInput): News | null {
  const db = getDb();
  const existing = getById(id);
  if (!existing) return null;

  const now = new Date().toISOString();
  const fields: string[] = [];
  const values: (string | null)[] = [];

  if (data.title !== undefined) {
    fields.push('title = ?');
    values.push(data.title);
  }
  if (data.excerpt !== undefined) {
    fields.push('excerpt = ?');
    values.push(data.excerpt ?? null);
  }
  if (data.content !== undefined) {
    fields.push('content = ?');
    values.push(data.content ?? null);
  }
  if (data.image !== undefined) {
    fields.push('image = ?');
    values.push(data.image ?? null);
  }
  if (data.date !== undefined) {
    fields.push('date = ?');
    values.push(data.date ?? null);
  }
  if (data.category !== undefined) {
    fields.push('category = ?');
    values.push(data.category ?? null);
  }
  if (data.instagramUrl !== undefined) {
    fields.push('instagram_url = ?');
    values.push(data.instagramUrl ?? null);
  }

  if (fields.length === 0) {
    return existing;
  }

  fields.push('updated_at = ?');
  values.push(now);
  values.push(id);

  db.prepare(`UPDATE news SET ${fields.join(', ')} WHERE id = ?`).run(...values);
  return getById(id);
}

export function remove(id: string): boolean {
  const db = getDb();
  const result = db.prepare('DELETE FROM news WHERE id = ?').run(id);
  return result.changes > 0;
}
