import { prisma } from '../db/client.js';
import type { Artist as PrismaArtist } from '@prisma/client';
import type { Artist, CreateArtistInput, UpdateArtistInput } from '../types/db.js';

function toApiFormat(row: PrismaArtist): Artist {
  return {
    id: row.id,
    name: row.name,
    bio: row.bio ?? undefined,
    image: row.image ?? undefined,
    nationality: row.nationality ?? undefined,
    born: row.born ?? undefined,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt?.toISOString(),
  };
}

export async function getAll(): Promise<Artist[]> {
  const artists = await prisma.artist.findMany({
    orderBy: { name: 'asc' },
  });
  return artists.map(toApiFormat);
}

export async function getById(id: string): Promise<Artist | null> {
  const artist = await prisma.artist.findUnique({
    where: { id },
  });
  return artist ? toApiFormat(artist) : null;
}

export async function create(data: CreateArtistInput): Promise<Artist> {
  const artist = await prisma.artist.create({
    data: {
      name: data.name,
      bio: data.bio ?? null,
      image: data.image ?? null,
      nationality: data.nationality ?? null,
      born: data.born ?? null,
    },
  });
  return toApiFormat(artist);
}

export async function update(id: string, data: UpdateArtistInput): Promise<Artist | null> {
  const existing = await prisma.artist.findUnique({ where: { id } });
  if (!existing) return null;

  const artist = await prisma.artist.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.bio !== undefined && { bio: data.bio }),
      ...(data.image !== undefined && { image: data.image }),
      ...(data.nationality !== undefined && { nationality: data.nationality }),
      ...(data.born !== undefined && { born: data.born }),
    },
  });
  return toApiFormat(artist);
}

export async function remove(id: string): Promise<boolean> {
  try {
    await prisma.artist.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}
