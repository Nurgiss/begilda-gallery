import { prisma, transaction } from '../db/client.js';
import type { Exhibition as PrismaExhibition } from '@prisma/client';
import type { Exhibition, CreateExhibitionInput, UpdateExhibitionInput } from '../types/db.js';

function toApiFormat(row: PrismaExhibition, paintingIds: string[]): Exhibition {
  return {
    id: row.id,
    title: row.title,
    artist: row.artist ?? undefined,
    location: row.location ?? undefined,
    dates: row.dates ?? undefined,
    description: row.description ?? undefined,
    image: row.image ?? undefined,
    imageUrl: row.imageUrl ?? undefined,
    status: row.status as 'current' | 'upcoming' | 'past',
    paintingIds,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt?.toISOString(),
  };
}

export async function getAll(): Promise<Exhibition[]> {
  const exhibitions = await prisma.exhibition.findMany({
    include: { paintings: { orderBy: { displayOrder: 'asc' } } },
    orderBy: { createdAt: 'desc' },
  });
  return exhibitions.map((ex) => toApiFormat(ex, ex.paintings.map((p) => p.paintingId)));
}

export async function getById(id: string): Promise<Exhibition | null> {
  const exhibition = await prisma.exhibition.findUnique({
    where: { id },
    include: { paintings: { orderBy: { displayOrder: 'asc' } } },
  });
  return exhibition ? toApiFormat(exhibition, exhibition.paintings.map((p) => p.paintingId)) : null;
}

export async function create(data: CreateExhibitionInput): Promise<Exhibition> {
  return transaction(async (tx) => {
    const exhibition = await tx.exhibition.create({
      data: {
        title: data.title,
        artist: data.artist ?? null,
        location: data.location ?? null,
        dates: data.dates ?? null,
        description: data.description ?? null,
        image: data.image ?? null,
        imageUrl: data.imageUrl ?? null,
        status: data.status ?? 'upcoming',
        paintings: {
          create: data.paintingIds?.map((paintingId, index) => ({
            paintingId,
            displayOrder: index,
          })) ?? [],
        },
      },
      include: { paintings: { orderBy: { displayOrder: 'asc' } } },
    });
    return toApiFormat(exhibition, exhibition.paintings.map((p) => p.paintingId));
  });
}

export async function update(id: string, data: UpdateExhibitionInput): Promise<Exhibition | null> {
  return transaction(async (tx) => {
    const existing = await tx.exhibition.findUnique({ where: { id } });
    if (!existing) return null;

    const exhibition = await tx.exhibition.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.artist !== undefined && { artist: data.artist }),
        ...(data.location !== undefined && { location: data.location }),
        ...(data.dates !== undefined && { dates: data.dates }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.image !== undefined && { image: data.image }),
        ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
        ...(data.status !== undefined && { status: data.status }),
      },
      include: { paintings: { orderBy: { displayOrder: 'asc' } } },
    });

    // Update painting associations if provided
    if (data.paintingIds !== undefined) {
      await tx.exhibitionPainting.deleteMany({ where: { exhibitionId: id } });
      if (data.paintingIds.length > 0) {
        await tx.exhibitionPainting.createMany({
          data: data.paintingIds.map((paintingId, index) => ({
            exhibitionId: id,
            paintingId,
            displayOrder: index,
          })),
        });
      }
      const updatedExhibition = await tx.exhibition.findUnique({
        where: { id },
        include: { paintings: { orderBy: { displayOrder: 'asc' } } },
      });
      return updatedExhibition ? toApiFormat(updatedExhibition, updatedExhibition.paintings.map((p) => p.paintingId)) : null;
    }

    return toApiFormat(exhibition, exhibition.paintings.map((p) => p.paintingId));
  });
}

export async function remove(id: string): Promise<boolean> {
  try {
    await prisma.exhibition.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
}
