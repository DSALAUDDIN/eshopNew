#!/usr/bin/env node

import fs from 'fs'
import path from 'path'

function generateDynamicSettings() {
  console.log('⚙️ Generating dynamic settings from theme configuration...')

  try {
    // Read the template configuration
    const configPath = path.join(process.cwd(), 'config', 'template.json')
    if (!fs.existsSync(configPath)) {
      console.error('❌ Template configuration not found!')
      return
    }

    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))

    // Generate dynamic settings based on theme configuration
    const dynamicSettings = {
      site_name: config.branding.siteName,
      site_description: config.branding.siteDescription,
      site_logo: config.branding.logo || '/placeholder-logo.svg',
      hero_banner: config.branding.hero_banner || '/placeholder.jpg',
      contact_email: config.admin.email,
      contact_phone: '+8801534207276',
      contact_address: '123 Fashion Street, Style City, Dhaka',
      business_hours: 'Mon-Fri: 9AM-6PM, Sat: 10AM-4PM',
      currency: config.currency.code,
      shipping_fee: '10.00',
      free_shipping_threshold: '100.00',
      tax_rate: '0.08',
      delivery_days: '3-5 business days',
      express_delivery_fee: '15.00',
      currency_symbol: config.currency.symbol,
      // Theme colors for frontend use
      primary_color: config.theme.colors.primary,
      secondary_color: config.theme.colors.secondary,
      accent_color: config.theme.colors.accent,
      // Features from theme
      reviews_enabled: config.features.reviews,
      wishlist_enabled: config.features.wishlist,
      multi_language_enabled: config.features.multiLanguage,
      newsletter_enabled: config.features.newsletter,
      // Generated timestamp
      last_updated: new Date().toISOString(),
      generated_from_theme: true
    }

    // Write the settings file
    const settingsPath = path.join(process.cwd(), 'data', 'settings.json')

    // Ensure data directory exists
    const dataDir = path.dirname(settingsPath)
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }

    fs.writeFileSync(settingsPath, JSON.stringify(dynamicSettings, null, 2), 'utf8')

    console.log('✅ Dynamic settings generated successfully!')
    console.log(`🏪 Store: ${dynamicSettings.site_name}`)
    console.log(`📧 Contact: ${dynamicSettings.contact_email}`)
    console.log(`💰 Currency: ${dynamicSettings.currency} (${dynamicSettings.currency_symbol})`)
    console.log(`🎨 Primary Color: ${dynamicSettings.primary_color}`)
    console.log(`🎨 Secondary Color: ${dynamicSettings.secondary_color}`)
    console.log(`🔄 Settings now sync with theme configuration!`)

    return dynamicSettings

  } catch (error) {
    console.error('❌ Error generating dynamic settings:', error)
  }
}

if (require.main === module) {
  generateDynamicSettings()
}

export { generateDynamicSettings }
