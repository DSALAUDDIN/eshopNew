#!/usr/bin/env node

import { db } from '@/lib/prisma'
import { users } from '@/lib/db/schema'
import bcrypt from 'bcryptjs'
import fs from 'fs'
import path from 'path'
import { eq } from 'drizzle-orm'

function loadThemeConfig() {
  try {
    const configPath = path.join(process.cwd(), 'config', 'template.json')
    const configData = fs.readFileSync(configPath, 'utf8')
    return JSON.parse(configData)
  } catch (error) {
    console.error('❌ Could not load theme config:', error)
    return null
  }
}

function generateThemeBasedCredentials(themeConfig: any) {
  const storeName = themeConfig.branding?.siteName || 'store'
  const cleanStoreName = storeName.toLowerCase().replace(/\s+/g, '')

  return {
    email: `admin@${cleanStoreName}.com`,
    password: 'admin123', // You can make this more complex if needed
    name: `${storeName} Admin`
  }
}

async function createAdminUser() {
  try {
    console.log('🔑 Setting up admin user based on theme...')

    // Load theme configuration
    const themeConfig = loadThemeConfig()
    if (!themeConfig) {
      console.error('❌ Could not load theme configuration')
      return
    }

    // Generate credentials based on theme
    const credentials = generateThemeBasedCredentials(themeConfig)
    console.log(`🏪 Store: ${themeConfig.branding.siteName}`)
    console.log(`📧 Generated Admin Email: ${credentials.email}`)

    // Check if admin user already exists
    const existingAdmin = await db
      .select()
      .from(users)
      .where(eq(users.email, credentials.email))
      .execute()

    if (existingAdmin.length > 0) {
      console.log('✅ Admin user already exists!')
      console.log(`📧 Email: ${credentials.email}`)
      console.log(`🔑 Password: ${credentials.password}`)
      return
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(credentials.password, 12)

    // Create admin user
    const adminUser = await db
      .insert(users)
      .values({
        email: credentials.email,
        name: credentials.name,
        password: hashedPassword,
        role: 'SUPER_ADMIN',
        isTradeCustomer: false
      })
      .returning()
      .execute()

    console.log('🎉 Admin user created successfully!')
    console.log(`🏪 Store: ${themeConfig.branding.siteName}`)
    console.log(`📧 Email: ${credentials.email}`)
    console.log(`🔑 Password: ${credentials.password}`)
    console.log(`👤 User ID: ${adminUser[0].id}`)
    console.log(`🎨 Theme: ${themeConfig.theme.colors.primary}`)

    // Update .env file with the theme-based credentials
    const envPath = path.join(process.cwd(), '.env')
    let envContent = fs.readFileSync(envPath, 'utf8')

    // Update admin credentials in .env
    envContent = envContent.replace(
      /ADMIN_EMAIL=.*/,
      `ADMIN_EMAIL="${credentials.email}"`
    )
    envContent = envContent.replace(
      /ADMIN_PASSWORD=.*/,
      `ADMIN_PASSWORD="${credentials.password}"`
    )

    fs.writeFileSync(envPath, envContent)
    console.log('✅ Updated .env file with theme-based credentials')

  } catch (error) {
    console.error('❌ Error creating admin user:', error)
  }
}

if (require.main === module) {
  createAdminUser()
}

export { createAdminUser }
