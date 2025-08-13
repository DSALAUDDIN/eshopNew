import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// Define the footer pages schema inline
const footerPages = sqliteTable('footer_pages', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  content: text('content').notNull(),
  metaTitle: text('meta_title'),
  metaDescription: text('meta_description'),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

const sqlite = new Database('./prisma/dev.db');
const db = drizzle(sqlite);

async function checkFooterPages() {
  try {
    console.log('🔍 Checking for existing footer pages...');

    const pages = await db.select().from(footerPages);
    console.log(`📄 Footer pages found: ${pages.length}`);

    if (pages.length > 0) {
      console.log('\n📋 Existing pages:');
      pages.forEach((page, index) => {
        console.log(`${index + 1}. ${page.title} (/${page.slug}) - ${page.isActive ? '✅ Active' : '❌ Inactive'}`);
      });
    } else {
      console.log('❌ No footer pages found in database');
      console.log('💡 This is why footer editing is showing "No footer pages found"');
      console.log('🚀 You need to create footer pages first!');
    }

  } catch (error) {
    console.error('❌ Error checking footer pages:', error.message);
  } finally {
    sqlite.close();
  }
}

checkFooterPages();
