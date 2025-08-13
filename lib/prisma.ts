import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './db/schema';

const globalForDb = globalThis as unknown as {
  db: ReturnType<typeof drizzle> | undefined
}

const sqlite = new Database('./prisma/dev.db');
export const db = globalForDb.db ?? drizzle(sqlite, { schema });

if (process.env.NODE_ENV !== 'production') globalForDb.db = db;

// Export for backward compatibility (can be removed later)
export const prisma = db;
