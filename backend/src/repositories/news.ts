import { prisma } from '../db/client.js';
import type { News as PrismaNews } from '@prisma/client';
import type { News, CreateNewsInput, UpdateNewsInput } from '../types/db.js';

function toApiFormat(row: PrismaNews | null): News | null {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    excerpt: row.excerpt ?? undefined,
    content: row.content ?? undefined,
    image: row.image ?? undefined,
    date: row.date ?? undefined,
    category: row.category ?? undefined,
    instagramUrl: row.instagramUrl ?? undefined,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt?.toISOString(),
  };
}

export async function getAll(): Promise<News[]> {
  const rows = await prisma.news.findMany({
    orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
  });
  return rows.map((row) => toApiFormat(row)!);
}

export async function getById(id: string): Promise<News | null> {
  const row = await prisma.news.findUnique({
    where: { id },
  });
  return toApiFormat(row);
}

export async function create(data: CreateNewsInput): Promise<News> {
  const row = await prisma.news.create({
    data: {
      title: data.title,
      excerpt: data.excerpt ?? null,
      content: data.content ?? null,
      image: data.image ?? null,
      date: data.date ?? null,
      category: data.category ?? null,
      instagramUrl: data.instagramUrl ?? null,
    },
  });

  return toApiFormat(row)!;
}

export async function update(id: string, data: UpdateNewsInput): Promise<News | null> {
  const existing = await getById(id);
  if (!existing) return null;

  const updateData: Record<string, any> = {};

  if (data.title !== undefined) updateData.title = data.title;
  if (data.excerpt !== undefined) updateData.excerpt = data.excerpt ?? null;
  if (data.content !== undefined) updateData.content = data.content ?? null;
  if (data.image !== undefined) updateData.image = data.image ?? null;
  if (data.date !== undefined) updateData.date = data.date ?? null;
  if (data.category !== undefined) updateData.category = data.category ?? null;
  if (data.instagramUrl !== undefined) updateData.instagramUrl = data.instagramUrl ?? null;

  if (Object.keys(updateData).length === 0) {
    return existing;
  }

  const row = await prisma.news.update({
    where: { id },
    data: updateData,
  });

  return toApiFormat(row);
}

export async function remove(id: string): Promise<boolean> {
  try {
    await prisma.news.delete({
      where: { id },
    });
    return true;
  } catch {
    return false;
  }
}
