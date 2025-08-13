import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// Define the social media schema inline
const socialMediaSettings = sqliteTable('social_media_settings', {
  id: text('id').primaryKey(),
  platform: text('platform').notNull().unique(),
  url: text('url').notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

const sqlite = new Database('./prisma/dev.db');
const db = drizzle(sqlite);

async function checkSocialMedia() {
  try {
    console.log('🔍 Checking for existing social media settings...');

    const settings = await db.select().from(socialMediaSettings);
    console.log(`📱 Social media settings found: ${settings.length}`);

    if (settings.length > 0) {
      console.log('\n📋 Existing settings:');
      settings.forEach((setting, index) => {
        console.log(`${index + 1}. ${setting.platform}: ${setting.url} - ${setting.isActive ? '✅ Active' : '❌ Inactive'}`);
      });
    } else {
      console.log('❌ No social media settings found in database');
      console.log('💡 This is why Social Media Settings is showing empty');
      console.log('🚀 You need to create social media settings first!');
    }

  } catch (error) {
    console.error('❌ Error checking social media settings:', error.message);
  } finally {
    sqlite.close();
  }
}

checkSocialMedia();
