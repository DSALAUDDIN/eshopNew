// Simple script to create a fresh database for Drizzle
import { unlinkSync, existsSync } from 'fs'
import { execSync } from 'child_process'

const dbPath = './prisma/dev.db'

console.log('🗄️ Setting up fresh database for Drizzle...')

// Try to remove the existing database
try {
  if (existsSync(dbPath)) {
    unlinkSync(dbPath)
    console.log('✅ Removed existing database')
  }
} catch (error) {
  console.log('⚠️ Could not remove existing database (might be in use)')
  console.log('Please close any database connections and run this script again')
  process.exit(1)
}

// Create fresh database with Drizzle schema
try {
  console.log('📋 Pushing Drizzle schema...')
  execSync('npx drizzle-kit push', { stdio: 'inherit' })
  console.log('✅ Database schema created successfully!')

  console.log('🌱 Running seed script...')
  execSync('npm run db:seed', { stdio: 'inherit' })
  console.log('✅ Database seeded successfully!')

  console.log('🎉 Drizzle migration completed!')
} catch (error) {
  console.error('❌ Error during migration:', error)
  process.exit(1)
}
