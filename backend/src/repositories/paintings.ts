import { prisma } from '../db/client.js';
import type { Painting as PrismaPainting } from '@prisma/client';
import type { Painting, CreatePaintingInput, UpdatePaintingInput } from '../types/db.js';

/**
 * Convert Prisma model to API format
 */
function toApiFormat(row: PrismaPainting): Painting {
  return {
    id: row.id,
    title: row.title,
    artist: row.artistName ?? undefined,
    year: row.year ?? undefined,
    price: row.price ?? undefined,
    priceUSD: row.priceUsd ?? undefined,
    priceEUR: row.priceEur ?? undefined,
    image: row.image ?? undefined,
    imageUrl: row.imageUrl ?? undefined,
    description: row.description ?? undefined,
    dimensions: row.dimensions ?? undefined,
    size: row.size ?? undefined,
    medium: row.medium ?? undefined,
    category: row.category ?? undefined,
    availability: row.availability,
    featured: row.featured,
    exhibitionOnly: row.exhibitionOnly,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt?.toISOString(),
  };
}

export async function getAll(): Promise<Painting[]> {
  const paintings = await prisma.painting.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return paintings.map(toApiFormat);
}

export async function getById(id: string): Promise<Painting | null> {
  const painting = await prisma.painting.findUnique({
    where: { id },
  });
  return painting ? toApiFormat(painting) : null;
}

export async function create(data: CreatePaintingInput): Promise<Painting> {
  // Find artist_id by name if provided
  let artistId: string | null = null;
  if (data.artist) {
    const artist = await prisma.artist.findFirst({
      where: { name: data.artist },
    });
    artistId = artist?.id ?? null;
  }

  const painting = await prisma.painting.create({
    data: {
      title: data.title,
      artistName: data.artist ?? null,
      artistId,
      year: data.year ?? null,
      price: data.price ?? null,
      priceUsd: data.priceUSD ?? null,
      priceEur: data.priceEUR ?? null,
      image: data.image ?? null,
      imageUrl: data.imageUrl ?? null,
      description: data.description ?? null,
      dimensions: data.dimensions ?? null,
      size: data.size ?? null,
      medium: data.medium ?? null,
      category: data.category ?? null,
      availability: data.availability !== false,
      featured: data.featured ?? false,
      exhibitionOnly: data.exhibitionOnly ?? false,
    },
  });

  return toApiFormat(painting);
}

export async function update(id: string, data: UpdatePaintingInput): Promise<Painting | null> {
  const existing = await prisma.painting.findUnique({ where: { id } });
  if (!existing) return null;

  // Find artist_id if artist name is being updated
  let artistId: string | null | undefined = undefined;
  if (data.artist !== undefined) {
    if (data.artist) {
      const artist = await prisma.artist.findFirst({
        where: { name: data.artist },
      });
      artistId = artist?.id ?? null;
    } else {
      artistId = null;
    }
  }

  const painting = await prisma.painting.update({
    where: { id },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.artist !== undefined && { artistName: data.artist }),
      ...(artistId !== undefined && { artistId }),
      ...(data.year !== undefined && { year: data.year }),
      ...(data.price !== undefined && { price: data.price }),
      ...(data.priceUSD !== undefined && { priceUsd: data.priceUSD }),
      ...(data.priceEUR !== undefined && { priceEur: data.priceEUR }),
      ...(data.image !== undefined && { image: data.image }),
      ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.dimensions !== undefined && { dimensions: data.dimensions }),
      ...(data.size !== undefined && { size: data.size }),
      ...(data.medium !== undefined && { medium: data.medium }),
      ...(data.category !== undefined && { category: data.category }),
      ...(data.availability !== undefined && { availability: data.availability }),
      ...(data.featured !== undefined && { featured: data.featured }),
      ...(data.exhibitionOnly !== undefined && { exhibitionOnly: data.exhibitionOnly }),
    },
  });

  return toApiFormat(painting);
}

export async function remove(id: string): Promise<boolean> {
  try {
    await prisma.painting.delete({
      where: { id },
    });
    return true;
  } catch {
    return false;
  }
}
