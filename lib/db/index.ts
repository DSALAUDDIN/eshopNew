import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';

const sqlite = new Database('./prisma/dev.db');
export const db = drizzle(sqlite, { schema });

export type DB = typeof db;
