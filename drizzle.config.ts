import type { Config } from 'drizzle-kit';

export default {
  schema: './lib/db/schema.ts',
  out: './lib/db/migrations',
  dialect: 'sqlite',
  dbCredentials: {
    url: './prisma/dev.db',
  },
  verbose: true,
  strict: true,
} satisfies Config;
