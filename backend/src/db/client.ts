import { PrismaClient } from '@prisma/client';

/**
 * Prisma Client Singleton
 * 
 * Provides a single PrismaClient instance for the entire application.
 * Configured via DATABASE_URL in .env:
 * - SQLite: file:./data/gallery.db
 * - PostgreSQL: postgresql://user:password@localhost:5432/begilda_gallery
 */

// Prevent multiple instances in development with hot reloading
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

/**
 * Disconnect from database
 * Call this on server shutdown
 */
export async function disconnect(): Promise<void> {
  await prisma.$disconnect();
}

/**
 * Transaction helper for atomic operations
 * Usage: await transaction(async (tx) => { ... })
 */
export async function transaction<T>(
  fn: (tx: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'>) => Promise<T>
): Promise<T> {
  return prisma.$transaction(fn);
}

export default prisma;
