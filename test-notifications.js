// Test script to check notifications in the database
const { drizzle } = require('drizzle-orm/better-sqlite3');
const Database = require('better-sqlite3');

const sqlite = new Database('./prisma/dev.db');
const db = drizzle(sqlite);

async function checkNotifications() {
  try {
    // Check if there are any admin notifications
    const notifications = await db.execute('SELECT * FROM admin_notifications ORDER BY created_at DESC');
    console.log('Admin Notifications:', notifications);

    // Check if there are any reviews
    const reviews = await db.execute('SELECT * FROM reviews ORDER BY created_at DESC LIMIT 5');
    console.log('Recent Reviews:', reviews);

    // Check if there are any orders
    const orders = await db.execute('SELECT * FROM orders ORDER BY created_at DESC LIMIT 5');
    console.log('Recent Orders:', orders);

  } catch (error) {
    console.error('Error checking notifications:', error);
  } finally {
    sqlite.close();
  }
}

checkNotifications();
