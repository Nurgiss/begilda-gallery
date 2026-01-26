import { getDb, transaction } from '../db/index.js';
import { v4 as uuidv4 } from 'uuid';
import type { ExhibitionRow, Exhibition, CreateExhibitionInput, UpdateExhibitionInput } from '../types/db.js';

function toApiFormat(row: ExhibitionRow | undefined, paintingIds: string[]): Exhibition | null {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    artist: row.artist ?? undefined,
    location: row.location ?? undefined,
    dates: row.dates ?? undefined,
    description: row.description ?? undefined,
    image: row.image ?? undefined,
    imageUrl: row.image_url ?? undefined,
    status: row.status,
    paintingIds,
    createdAt: row.created_at,
    updatedAt: row.updated_at ?? undefined,
  };
}

function getPaintingIds(db: ReturnType<typeof getDb>, exhibitionId: string): string[] {
  const rows = db.prepare(
    'SELECT painting_id FROM exhibition_paintings WHERE exhibition_id = ? ORDER BY display_order'
  ).all(exhibitionId) as { painting_id: string }[];
  return rows.map((r) => r.painting_id);
}

export function getAll(): Exhibition[] {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM exhibitions ORDER BY created_at DESC').all() as ExhibitionRow[];
  return rows.map((row) => {
    const paintingIds = getPaintingIds(db, row.id);
    return toApiFormat(row, paintingIds)!;
  });
}

export function getById(id: string): Exhibition | null {
  const db = getDb();
  const row = db.prepare('SELECT * FROM exhibitions WHERE id = ?').get(id) as ExhibitionRow | undefined;
  if (!row) return null;
  const paintingIds = getPaintingIds(db, id);
  return toApiFormat(row, paintingIds);
}

export function create(data: CreateExhibitionInput): Exhibition {
  return transaction(() => {
    const db = getDb();
    const id = uuidv4();
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO exhibitions (id, title, artist, location, dates, description, image, image_url, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      data.title,
      data.artist ?? null,
      data.location ?? null,
      data.dates ?? null,
      data.description ?? null,
      data.image ?? null,
      data.imageUrl ?? null,
      data.status ?? 'upcoming',
      now
    );

    // Insert painting associations
    if (data.paintingIds?.length) {
      const insertPainting = db.prepare(
        'INSERT INTO exhibition_paintings (exhibition_id, painting_id, display_order) VALUES (?, ?, ?)'
      );
      data.paintingIds.forEach((paintingId, index) => {
        insertPainting.run(id, paintingId, index);
      });
    }

    return getById(id)!;
  });
}

export function update(id: string, data: UpdateExhibitionInput): Exhibition | null {
  return transaction(() => {
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
    if (data.artist !== undefined) {
      fields.push('artist = ?');
      values.push(data.artist ?? null);
    }
    if (data.location !== undefined) {
      fields.push('location = ?');
      values.push(data.location ?? null);
    }
    if (data.dates !== undefined) {
      fields.push('dates = ?');
      values.push(data.dates ?? null);
    }
    if (data.description !== undefined) {
      fields.push('description = ?');
      values.push(data.description ?? null);
    }
    if (data.image !== undefined) {
      fields.push('image = ?');
      values.push(data.image ?? null);
    }
    if (data.imageUrl !== undefined) {
      fields.push('image_url = ?');
      values.push(data.imageUrl ?? null);
    }
    if (data.status !== undefined) {
      fields.push('status = ?');
      values.push(data.status);
    }

    if (fields.length > 0) {
      fields.push('updated_at = ?');
      values.push(now);
      values.push(id);
      db.prepare(`UPDATE exhibitions SET ${fields.join(', ')} WHERE id = ?`).run(...values);
    }

    // Update painting associations if provided
    if (data.paintingIds !== undefined) {
      db.prepare('DELETE FROM exhibition_paintings WHERE exhibition_id = ?').run(id);

      if (data.paintingIds?.length) {
        const insertPainting = db.prepare(
          'INSERT INTO exhibition_paintings (exhibition_id, painting_id, display_order) VALUES (?, ?, ?)'
        );
        data.paintingIds.forEach((paintingId, index) => {
          insertPainting.run(id, paintingId, index);
        });
      }
    }

    return getById(id);
  });
}

export function remove(id: string): boolean {
  const db = getDb();
  const result = db.prepare('DELETE FROM exhibitions WHERE id = ?').run(id);
  return result.changes > 0;
}
