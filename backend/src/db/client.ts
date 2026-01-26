import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Prisma Client Singleton (Prisma 7)
 *
 * Uses the better-sqlite3 adapter for direct database access.
 * Database file: data/gallery.db
 */

// Ensure data directory exists
const DATA_DIR = path.join(__dirname, '..', '..', 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, 'gallery.db');

// Create the Prisma adapter with URL
const adapter = new PrismaBetterSqlite3({
  url: `file:${DB_PATH}`,
});

// Prevent multiple instances in development with hot reloading
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
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
  fn: (tx: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$extends'>) => Promise<T>
): Promise<T> {
  return prisma.$transaction(fn);
}

export default prisma;
