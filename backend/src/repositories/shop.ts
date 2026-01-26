import { prisma } from '../db/client.js';
import type { ShopItem as PrismaShopItem } from '@prisma/client';
import type { ShopItem, CreateShopItemInput, UpdateShopItemInput } from '../types/db.js';

function toApiFormat(row: PrismaShopItem | null): ShopItem | null {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    artist: row.artist ?? undefined,
    price: row.price ?? undefined,
    priceUSD: row.priceUsd ?? undefined,
    priceEUR: row.priceEur ?? undefined,
    image: row.image ?? undefined,
    imageUrl: row.imageUrl ?? undefined,
    category: row.category ?? undefined,
    description: row.description ?? undefined,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt?.toISOString(),
  };
}

export async function getAll(): Promise<ShopItem[]> {
  const rows = await prisma.shopItem.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return rows.map((row) => toApiFormat(row)!);
}

export async function getById(id: string): Promise<ShopItem | null> {
  const row = await prisma.shopItem.findUnique({
    where: { id },
  });
  return toApiFormat(row);
}

export async function create(data: CreateShopItemInput): Promise<ShopItem> {
  const row = await prisma.shopItem.create({
    data: {
      title: data.title,
      artist: data.artist ?? null,
      price: data.price ?? null,
      priceUsd: data.priceUSD ?? null,
      priceEur: data.priceEUR ?? null,
      image: data.image ?? null,
      imageUrl: data.imageUrl ?? null,
      category: data.category ?? null,
      description: data.description ?? null,
    },
  });

  return toApiFormat(row)!;
}

export async function update(id: string, data: UpdateShopItemInput): Promise<ShopItem | null> {
  const existing = await getById(id);
  if (!existing) return null;

  const updateData: Record<string, any> = {};

  if (data.title !== undefined) updateData.title = data.title;
  if (data.artist !== undefined) updateData.artist = data.artist ?? null;
  if (data.price !== undefined) updateData.price = data.price ?? null;
  if (data.priceUSD !== undefined) updateData.priceUsd = data.priceUSD ?? null;
  if (data.priceEUR !== undefined) updateData.priceEur = data.priceEUR ?? null;
  if (data.image !== undefined) updateData.image = data.image ?? null;
  if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl ?? null;
  if (data.category !== undefined) updateData.category = data.category ?? null;
  if (data.description !== undefined) updateData.description = data.description ?? null;

  if (Object.keys(updateData).length === 0) {
    return existing;
  }

  const row = await prisma.shopItem.update({
    where: { id },
    data: updateData,
  });

  return toApiFormat(row);
}

export async function remove(id: string): Promise<boolean> {
  try {
    await prisma.shopItem.delete({
      where: { id },
    });
    return true;
  } catch {
    return false;
  }
}
