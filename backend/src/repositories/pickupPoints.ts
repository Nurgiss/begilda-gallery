import { prisma } from '../db/client.js';
import type { PickupPoint as PrismaPickupPoint } from '@prisma/client';
import type { PickupPoint, CreatePickupPointInput, UpdatePickupPointInput } from '../types/db.js';

function toApiFormat(row: PrismaPickupPoint | null): PickupPoint | null {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    address: row.address ?? undefined,
    city: row.city ?? undefined,
    phone: row.phone ?? undefined,
    workingHours: row.workingHours ?? undefined,
    isActive: row.isActive,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt?.toISOString(),
  };
}

export async function getAll(): Promise<PickupPoint[]> {
  const rows = await prisma.pickupPoint.findMany({
    orderBy: { name: 'asc' },
  });
  return rows.map((row) => toApiFormat(row)!);
}

export async function getById(id: string): Promise<PickupPoint | null> {
  const row = await prisma.pickupPoint.findUnique({
    where: { id },
  });
  return toApiFormat(row);
}

export async function create(data: CreatePickupPointInput): Promise<PickupPoint> {
  const row = await prisma.pickupPoint.create({
    data: {
      name: data.name,
      address: data.address ?? null,
      city: data.city ?? null,
      phone: data.phone ?? null,
      workingHours: data.workingHours ?? null,
      isActive: data.isActive !== false,
    },
  });

  return toApiFormat(row)!;
}

export async function update(id: string, data: UpdatePickupPointInput): Promise<PickupPoint | null> {
  const existing = await getById(id);
  if (!existing) return null;

  const updateData: Record<string, any> = {};

  if (data.name !== undefined) updateData.name = data.name;
  if (data.address !== undefined) updateData.address = data.address ?? null;
  if (data.city !== undefined) updateData.city = data.city ?? null;
  if (data.phone !== undefined) updateData.phone = data.phone ?? null;
  if (data.workingHours !== undefined) updateData.workingHours = data.workingHours ?? null;
  if (data.isActive !== undefined) updateData.isActive = data.isActive;

  if (Object.keys(updateData).length === 0) {
    return existing;
  }

  const row = await prisma.pickupPoint.update({
    where: { id },
    data: updateData,
  });

  return toApiFormat(row);
}

export async function remove(id: string): Promise<boolean> {
  try {
    await prisma.pickupPoint.delete({
      where: { id },
    });
    return true;
  } catch {
    return false;
  }
}
