import { getDb } from '../db/index.js';
import { v4 as uuidv4 } from 'uuid';
import type { ArtistRow, Artist, CreateArtistInput, UpdateArtistInput } from '../types/db.js';

function toApiFormat(row: ArtistRow | undefined): Artist | null {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    bio: row.bio,
    image: row.image,
    nationality: row.nationality,
    born: row.born,
    specialty: row.specialty,
    createdAt: row.created_at,
    updatedAt: row.updated_at ?? undefined,
  };
}

export function getAll(): Artist[] {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM artists ORDER BY name').all() as ArtistRow[];
  return rows.map((row) => toApiFormat(row)!);
}

export function getById(id: string): Artist | null {
  const db = getDb();
  const row = db.prepare('SELECT * FROM artists WHERE id = ?').get(id) as ArtistRow | undefined;
  return toApiFormat(row);
}

export function create(data: CreateArtistInput): Artist {
  const db = getDb();
  const id = uuidv4();
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO artists (id, name, bio, image, nationality, born, specialty, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    data.name,
    data.bio ?? null,
    data.image ?? null,
    data.nationality ?? null,
    data.born ?? null,
    data.specialty ?? null,
    now
  );

  return getById(id)!;
}

export function update(id: string, data: UpdateArtistInput): Artist | null {
  const db = getDb();
  const existing = getById(id);
  if (!existing) return null;

  const now = new Date().toISOString();
  const fields: string[] = [];
  const values: (string | null)[] = [];

  if (data.name !== undefined) {
    fields.push('name = ?');
    values.push(data.name);
  }
  if (data.bio !== undefined) {
    fields.push('bio = ?');
    values.push(data.bio ?? null);
  }
  if (data.image !== undefined) {
    fields.push('image = ?');
    values.push(data.image ?? null);
  }
  if (data.nationality !== undefined) {
    fields.push('nationality = ?');
    values.push(data.nationality ?? null);
  }
  if (data.born !== undefined) {
    fields.push('born = ?');
    values.push(data.born ?? null);
  }
  if (data.specialty !== undefined) {
    fields.push('specialty = ?');
    values.push(data.specialty ?? null);
  }

  if (fields.length === 0) {
    return existing;
  }

  fields.push('updated_at = ?');
  values.push(now);
  values.push(id);

  db.prepare(`UPDATE artists SET ${fields.join(', ')} WHERE id = ?`).run(...values);
  return getById(id);
}

export function remove(id: string): boolean {
  const db = getDb();
  const result = db.prepare('DELETE FROM artists WHERE id = ?').run(id);
  return result.changes > 0;
}
