import { prisma } from '../db/client.js';
import { v4 as uuidv4 } from 'uuid';
import type { Order as PrismaOrder, OrderItem as PrismaOrderItem } from '@prisma/client';
import type { Order, CreateOrderInput, UpdateOrderInput } from '../types/db.js';

type OrderWithItems = PrismaOrder & { items: PrismaOrderItem[] };

function toApiFormat(row: OrderWithItems | null): Order | null {
  if (!row) return null;
  return {
    id: row.id,
    fullName: row.fullName ?? undefined,
    email: row.email,
    phone: row.phone ?? undefined,
    deliveryType: row.deliveryType ?? undefined,
    pickupPoint: row.pickupPointId ?? undefined,
    country: row.country ?? undefined,
    postalCode: row.postalCode ?? undefined,
    city: row.city ?? undefined,
    address: row.address ?? undefined,
    items: row.items.map((item) => ({
      itemId: item.itemId,
      itemType: item.itemType,
      title: item.title ?? undefined,
      price: item.price ?? undefined,
      quantity: item.quantity,
    })),
    totalAmount: row.totalAmount ?? undefined,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt?.toISOString(),
  };
}

export async function getAll(): Promise<Order[]> {
  const rows = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  });
  return rows.map((row) => toApiFormat(row)!);
}

export async function getById(id: string): Promise<Order | null> {
  const row = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
  return toApiFormat(row);
}

export async function create(data: CreateOrderInput): Promise<Order> {
  // Generate short 8-char ID like the original
  const id = uuidv4().split('-')[0].toUpperCase();

  const row = await prisma.order.create({
    data: {
      id,
      fullName: data.fullName ?? null,
      email: data.email,
      phone: data.phone ?? null,
      deliveryType: data.deliveryType ?? null,
      pickupPointId: data.pickupPoint ?? null,
      country: data.country ?? null,
      postalCode: data.postalCode ?? null,
      city: data.city ?? null,
      address: data.address ?? null,
      totalAmount: data.totalAmount ?? null,
      status: 'pending',
      items: {
        create: data.items.map((item) => ({
          itemId: item.itemId,
          itemType: item.itemType,
          title: item.title ?? null,
          price: item.price ?? null,
          quantity: item.quantity,
        })),
      },
    },
    include: { items: true },
  });

  return toApiFormat(row)!;
}

export async function update(id: string, data: UpdateOrderInput): Promise<Order | null> {
  const existing = await getById(id);
  if (!existing) return null;

  const updateData: Record<string, any> = {};

  if (data.fullName !== undefined) updateData.fullName = data.fullName ?? null;
  if (data.email !== undefined) updateData.email = data.email;
  if (data.phone !== undefined) updateData.phone = data.phone ?? null;
  if (data.deliveryType !== undefined) updateData.deliveryType = data.deliveryType ?? null;
  if (data.pickupPoint !== undefined) updateData.pickupPointId = data.pickupPoint ?? null;
  if (data.country !== undefined) updateData.country = data.country ?? null;
  if (data.postalCode !== undefined) updateData.postalCode = data.postalCode ?? null;
  if (data.city !== undefined) updateData.city = data.city ?? null;
  if (data.address !== undefined) updateData.address = data.address ?? null;
  if (data.totalAmount !== undefined) updateData.totalAmount = data.totalAmount ?? null;
  if (data.status !== undefined) updateData.status = data.status;

  // Update items if provided
  if (data.items !== undefined) {
    updateData.items = {
      deleteMany: {},
      create: data.items.map((item) => ({
        itemId: item.itemId,
        itemType: item.itemType,
        title: item.title ?? null,
        price: item.price ?? null,
        quantity: item.quantity,
      })),
    };
  }

  const row = await prisma.order.update({
    where: { id },
    data: updateData,
    include: { items: true },
  });

  return toApiFormat(row);
}

export async function remove(id: string): Promise<boolean> {
  try {
    await prisma.order.delete({
      where: { id },
    });
    return true;
  } catch {
    return false;
  }
}
