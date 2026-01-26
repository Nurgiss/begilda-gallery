import { getDb, transaction } from '../db/index.js';
import { v4 as uuidv4 } from 'uuid';
import type { OrderRow, OrderItemRow, Order, OrderItem, CreateOrderInput, UpdateOrderInput } from '../types/db.js';

function toApiFormat(row: OrderRow | undefined, items: OrderItemRow[]): Order | null {
  if (!row) return null;
  return {
    id: row.id,
    fullName: row.full_name ?? undefined,
    email: row.email,
    phone: row.phone ?? undefined,
    deliveryType: row.delivery_type ?? undefined,
    pickupPoint: row.pickup_point_id ?? undefined,
    country: row.country ?? undefined,
    postalCode: row.postal_code ?? undefined,
    city: row.city ?? undefined,
    address: row.address ?? undefined,
    items: items.map((item) => ({
      itemId: item.item_id,
      itemType: item.item_type,
      title: item.title ?? undefined,
      price: item.price ?? undefined,
      quantity: item.quantity,
    })),
    totalAmount: row.total_amount ?? undefined,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at ?? undefined,
  };
}

function getOrderItems(db: ReturnType<typeof getDb>, orderId: string): OrderItemRow[] {
  return db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(orderId) as OrderItemRow[];
}

export function getAll(): Order[] {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all() as OrderRow[];
  return rows.map((row) => {
    const items = getOrderItems(db, row.id);
    return toApiFormat(row, items)!;
  });
}

export function getById(id: string): Order | null {
  const db = getDb();
  const row = db.prepare('SELECT * FROM orders WHERE id = ?').get(id) as OrderRow | undefined;
  if (!row) return null;
  const items = getOrderItems(db, id);
  return toApiFormat(row, items);
}

export function create(data: CreateOrderInput): Order {
  return transaction(() => {
    const db = getDb();
    // Generate short 8-char ID like the original
    const id = uuidv4().split('-')[0].toUpperCase();
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO orders (
        id, full_name, email, phone, delivery_type, pickup_point_id,
        country, postal_code, city, address, total_amount, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      data.fullName ?? null,
      data.email,
      data.phone ?? null,
      data.deliveryType ?? null,
      data.pickupPoint ?? null,
      data.country ?? null,
      data.postalCode ?? null,
      data.city ?? null,
      data.address ?? null,
      data.totalAmount ?? null,
      'pending',
      now
    );

    // Insert order items
    const insertItem = db.prepare(`
      INSERT INTO order_items (order_id, item_id, item_type, title, price, quantity)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    for (const item of data.items) {
      insertItem.run(
        id,
        item.itemId,
        item.itemType,
        item.title ?? null,
        item.price ?? null,
        item.quantity
      );
    }

    return getById(id)!;
  });
}

export function update(id: string, data: UpdateOrderInput): Order | null {
  return transaction(() => {
    const db = getDb();
    const existing = getById(id);
    if (!existing) return null;

    const now = new Date().toISOString();
    const fields: string[] = [];
    const values: (string | number | null)[] = [];

    if (data.fullName !== undefined) {
      fields.push('full_name = ?');
      values.push(data.fullName ?? null);
    }
    if (data.email !== undefined) {
      fields.push('email = ?');
      values.push(data.email);
    }
    if (data.phone !== undefined) {
      fields.push('phone = ?');
      values.push(data.phone ?? null);
    }
    if (data.deliveryType !== undefined) {
      fields.push('delivery_type = ?');
      values.push(data.deliveryType ?? null);
    }
    if (data.pickupPoint !== undefined) {
      fields.push('pickup_point_id = ?');
      values.push(data.pickupPoint ?? null);
    }
    if (data.country !== undefined) {
      fields.push('country = ?');
      values.push(data.country ?? null);
    }
    if (data.postalCode !== undefined) {
      fields.push('postal_code = ?');
      values.push(data.postalCode ?? null);
    }
    if (data.city !== undefined) {
      fields.push('city = ?');
      values.push(data.city ?? null);
    }
    if (data.address !== undefined) {
      fields.push('address = ?');
      values.push(data.address ?? null);
    }
    if (data.totalAmount !== undefined) {
      fields.push('total_amount = ?');
      values.push(data.totalAmount ?? null);
    }
    if (data.status !== undefined) {
      fields.push('status = ?');
      values.push(data.status);
    }

    if (fields.length > 0) {
      fields.push('updated_at = ?');
      values.push(now);
      values.push(id);
      db.prepare(`UPDATE orders SET ${fields.join(', ')} WHERE id = ?`).run(...values);
    }

    // Update items if provided
    if (data.items !== undefined) {
      db.prepare('DELETE FROM order_items WHERE order_id = ?').run(id);

      const insertItem = db.prepare(`
        INSERT INTO order_items (order_id, item_id, item_type, title, price, quantity)
        VALUES (?, ?, ?, ?, ?, ?)
      `);

      for (const item of data.items) {
        insertItem.run(
          id,
          item.itemId,
          item.itemType,
          item.title ?? null,
          item.price ?? null,
          item.quantity
        );
      }
    }

    return getById(id);
  });
}

export function remove(id: string): boolean {
  const db = getDb();
  const result = db.prepare('DELETE FROM orders WHERE id = ?').run(id);
  return result.changes > 0;
}
