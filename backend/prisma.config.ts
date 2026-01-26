import path from 'node:path';
import { defineConfig } from 'prisma/config';

// Prisma 7 configuration for migrations and database management
// This file replaces the `url` property from datasource in schema.prisma

const dbPath = path.join(process.cwd(), 'data', 'gallery.db');
const dbUrl = `file:${dbPath}`;

export default defineConfig({
  schema: './prisma/schema.prisma',

  // Database URL for CLI commands (db push, migrate, etc.)
  datasource: {
    url: dbUrl,
  },
});
