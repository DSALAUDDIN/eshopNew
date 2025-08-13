import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import { join } from 'path'

const SETTINGS_FILE = join(process.cwd(), 'data', 'settings.json')
const TEMPLATE_FILE = join(process.cwd(), 'config', 'template.json')

interface Settings {
  site_name: string
  site_description: string
  site_logo: string
  hero_banner: string
  contact_email: string
  contact_phone: string
  contact_address: string
  business_hours: string
  currency: string
  currency_symbol: string
  shipping_fee: string
  free_shipping_threshold: string
  tax_rate: string
  delivery_days: string
  express_delivery_fee: string
  last_updated?: string
}

interface TemplateConfig {
  branding?: {
    siteName?: string
    siteDescription?: string
    logo?: string
    hero_banner?: string
  }
  currency?: {
    code?: string
    symbol?: string
  }
}

// Simple settings management without auth for testing
export async function GET(): Promise<NextResponse> {
  try {
    console.log('📖 Reading settings from:', SETTINGS_FILE)

    const data = await fs.readFile(SETTINGS_FILE, 'utf8')
    const settings: Settings = JSON.parse(data)

    console.log('✅ Settings loaded:', settings)
    return NextResponse.json(settings)
  } catch (error) {
    console.error('❌ Error reading settings:', error)

    // Return default settings if file doesn't exist
    const defaultSettings: Settings = {
      site_name: 'Southern Fashion & Décor',
      site_description: 'Premium fashion and home décor collection',
      site_logo: '/placeholder-logo.png',
      hero_banner: '/placeholder.jpg',
      contact_email: 'info@southernfashion.com',
      contact_phone: '+1 (555) 123-4567',
      contact_address: '123 Fashion Street, Style City, Dhaka',
      business_hours: 'Mon-Fri: 9AM-6PM, Sat: 10AM-4PM',
      currency: 'BDT',
      currency_symbol: '৳',
      shipping_fee: '10.00',
      free_shipping_threshold: '100.00',
      tax_rate: '0.08',
      delivery_days: '3-5 business days',
      express_delivery_fee: '15.00'
    }

    return NextResponse.json(defaultSettings)
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: Partial<Settings> = await request.json()
    console.log('💾 Saving settings:', body)

    // Ensure data directory exists
    const dataDir = join(process.cwd(), 'data')
    try {
      await fs.mkdir(dataDir, { recursive: true })
    } catch (error) {
      // Directory might already exist
    }

    // Add timestamp to settings
    const updatedSettings: Partial<Settings> = {
      ...body,
      last_updated: new Date().toISOString()
    }

    // Save settings to file
    await fs.writeFile(SETTINGS_FILE, JSON.stringify(updatedSettings, null, 2), 'utf8')

    // Also update template.json to keep theme system in sync
    try {
      let template: TemplateConfig = {}
      try {
        const templateData = await fs.readFile(TEMPLATE_FILE, 'utf8')
        template = JSON.parse(templateData) as TemplateConfig
      } catch (error) {
        console.log('Creating new template.json')
      }

      // Update template with settings data
      template.branding = {
        ...template.branding,
        siteName: body.site_name,
        siteDescription: body.site_description,
        logo: body.site_logo,
        hero_banner: body.hero_banner
      }

      template.currency = {
        ...template.currency,
        code: body.currency || 'BDT',
        symbol: body.currency_symbol || '৳'
      }

      await fs.writeFile(TEMPLATE_FILE, JSON.stringify(template, null, 2), 'utf8')
      console.log('✅ Template.json updated with settings')

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.log('⚠️ Could not update template.json:', errorMessage)
    }

    console.log('✅ Settings saved successfully')
    return NextResponse.json({ success: true })

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('❌ Error saving settings:', error)
    return NextResponse.json({ error: 'Failed to save settings: ' + errorMessage }, { status: 500 })
  }
}
