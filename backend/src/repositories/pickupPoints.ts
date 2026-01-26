import { getDb } from '../db/index.js';
import { v4 as uuidv4 } from 'uuid';
import type { PickupPointRow, PickupPoint, CreatePickupPointInput, UpdatePickupPointInput } from '../types/db.js';

function toApiFormat(row: PickupPointRow | undefined): PickupPoint | null {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    address: row.address ?? undefined,
    city: row.city ?? undefined,
    phone: row.phone ?? undefined,
    workingHours: row.working_hours ?? undefined,
    isActive: Boolean(row.is_active),
    createdAt: row.created_at,
    updatedAt: row.updated_at ?? undefined,
  };
}

export function getAll(): PickupPoint[] {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM pickup_points ORDER BY name').all() as PickupPointRow[];
  return rows.map((row) => toApiFormat(row)!);
}

export function getById(id: string): PickupPoint | null {
  const db = getDb();
  const row = db.prepare('SELECT * FROM pickup_points WHERE id = ?').get(id) as PickupPointRow | undefined;
  return toApiFormat(row);
}

export function create(data: CreatePickupPointInput): PickupPoint {
  const db = getDb();
  const id = uuidv4();
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO pickup_points (id, name, address, city, phone, working_hours, is_active, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    data.name,
    data.address ?? null,
    data.city ?? null,
    data.phone ?? null,
    data.workingHours ?? null,
    data.isActive !== false ? 1 : 0,
    now
  );

  return getById(id)!;
}

export function update(id: string, data: UpdatePickupPointInput): PickupPoint | null {
  const db = getDb();
  const existing = getById(id);
  if (!existing) return null;

  const now = new Date().toISOString();
  const fields: string[] = [];
  const values: (string | number | null)[] = [];

  if (data.name !== undefined) {
    fields.push('name = ?');
    values.push(data.name);
  }
  if (data.address !== undefined) {
    fields.push('address = ?');
    values.push(data.address ?? null);
  }
  if (data.city !== undefined) {
    fields.push('city = ?');
    values.push(data.city ?? null);
  }
  if (data.phone !== undefined) {
    fields.push('phone = ?');
    values.push(data.phone ?? null);
  }
  if (data.workingHours !== undefined) {
    fields.push('working_hours = ?');
    values.push(data.workingHours ?? null);
  }
  if (data.isActive !== undefined) {
    fields.push('is_active = ?');
    values.push(data.isActive ? 1 : 0);
  }

  if (fields.length === 0) {
    return existing;
  }

  fields.push('updated_at = ?');
  values.push(now);
  values.push(id);

  db.prepare(`UPDATE pickup_points SET ${fields.join(', ')} WHERE id = ?`).run(...values);
  return getById(id);
}

export function remove(id: string): boolean {
  const db = getDb();
  const result = db.prepare('DELETE FROM pickup_points WHERE id = ?').run(id);
  return result.changes > 0;
}
