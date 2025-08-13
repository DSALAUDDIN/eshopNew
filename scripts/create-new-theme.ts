#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import readline from 'readline'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const question = (query: string): Promise<string> =>
  new Promise(resolve => rl.question(query, resolve))

interface NewTheme {
  storeName: string
  description: string
  tagline: string
  colors: {
    primary: string
    secondary: string
    accent: string
    success: string
    warning: string
    error: string
  }
  fonts: {
    heading: string
    body: string
  }
  currency: {
    code: string
    symbol: string
  }
  features: {
    darkMode: boolean
    animations: boolean
    reviews: boolean
    wishlist: boolean
    multiLanguage: boolean
    newsletter: boolean
  }
  layout: {
    headerStyle: string
    footerStyle: string
    productCardStyle: string
  }
}

// Predefined color schemes
const colorSchemes = {
  'modern-blue': {
    primary: '#3b82f6',
    secondary: '#64748b',
    accent: '#06b6d4',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444'
  },
  'elegant-purple': {
    primary: '#8b5cf6',
    secondary: '#6b7280',
    accent: '#ec4899',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444'
  },
  'nature-green': {
    primary: '#059669',
    secondary: '#6b7280',
    accent: '#84cc16',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444'
  },
  'warm-orange': {
    primary: '#ea580c',
    secondary: '#6b7280',
    accent: '#f59e0b',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444'
  },
  'professional-slate': {
    primary: '#0f172a',
    secondary: '#475569',
    accent: '#3b82f6',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444'
  },
  'custom': {
    primary: '',
    secondary: '',
    accent: '',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444'
  }
}

// Font combinations
const fontCombinations = {
  'modern': { heading: 'Inter', body: 'Inter' },
  'elegant': { heading: 'Playfair Display', body: 'Source Sans Pro' },
  'clean': { heading: 'Roboto', body: 'Roboto' },
  'stylish': { heading: 'Montserrat', body: 'Open Sans' },
  'classic': { heading: 'Merriweather', body: 'Lato' },
  'custom': { heading: '', body: '' }
}

// Currency options
const currencies = {
  'USD': '$',
  'EUR': '€',
  'GBP': '£',
  'BDT': '৳',
  'INR': '₹',
  'JPY': '¥',
  'CAD': 'C$',
  'AUD': 'A$'
}

async function createNewTheme() {
  console.log('🎨 Welcome to the E-Commerce Theme Creator!')
  console.log('Let\'s create a beautiful new theme for your store...\n')

  try {
    // Store Information
    console.log('📋 STORE INFORMATION')
    console.log('='.repeat(50))
    const storeName = await question('🏪 Store Name: ') || 'My Amazing Store'
    const description = await question('📝 Store Description: ') || 'Quality products for everyone'
    const tagline = await question('✨ Store Tagline: ') || 'Your trusted shopping destination'

    // Color Scheme Selection
    console.log('\n🎨 COLOR SCHEME')
    console.log('='.repeat(50))
    console.log('Choose a color scheme:')
    console.log('1. Modern Blue - Professional and trustworthy')
    console.log('2. Elegant Purple - Luxury and sophistication')
    console.log('3. Nature Green - Fresh and eco-friendly')
    console.log('4. Warm Orange - Energetic and welcoming')
    console.log('5. Professional Slate - Minimal and modern')
    console.log('6. Custom Colors - Design your own')

    const colorChoice = await question('\n🎯 Select color scheme (1-6): ') || '1'
    const colorSchemeKeys = Object.keys(colorSchemes)
    const selectedScheme = colorSchemes[colorSchemeKeys[parseInt(colorChoice) - 1] as keyof typeof colorSchemes] || colorSchemes['modern-blue']

    let colors = { ...selectedScheme }

    if (colorChoice === '6') {
      console.log('\n🖌️ Custom Color Configuration:')
      colors.primary = await question('Primary Color (hex): ') || '#3b82f6'
      colors.secondary = await question('Secondary Color (hex): ') || '#64748b'
      colors.accent = await question('Accent Color (hex): ') || '#06b6d4'
    }

    // Font Selection
    console.log('\n📝 TYPOGRAPHY')
    console.log('='.repeat(50))
    console.log('Choose a font combination:')
    console.log('1. Modern - Inter (clean and readable)')
    console.log('2. Elegant - Playfair Display + Source Sans Pro')
    console.log('3. Clean - Roboto (Google\'s favorite)')
    console.log('4. Stylish - Montserrat + Open Sans')
    console.log('5. Classic - Merriweather + Lato')
    console.log('6. Custom Fonts')

    const fontChoice = await question('\n🎯 Select font combination (1-6): ') || '1'
    const fontKeys = Object.keys(fontCombinations)
    const selectedFonts = fontCombinations[fontKeys[parseInt(fontChoice) - 1] as keyof typeof fontCombinations] || fontCombinations['modern']

    let fonts = { ...selectedFonts }

    if (fontChoice === '6') {
      console.log('\n📖 Custom Font Configuration:')
      fonts.heading = await question('Heading Font: ') || 'Inter'
      fonts.body = await question('Body Font: ') || 'Inter'
    }

    // Admin Configuration
    console.log('\n👤 ADMIN SETUP')
    console.log('='.repeat(50))
    const adminName = await question('👤 Admin Name: ') || 'Admin'
    const adminEmail = await question('📧 Admin Email (or press Enter for auto): ') || `admin@${storeName.toLowerCase().replace(/\s+/g, '')}.com`
    const adminPassword = await question('🔑 Admin Password: ') || 'admin123'

    // Currency Selection
    console.log('\n💰 CURRENCY')
    console.log('='.repeat(50))
    console.log('Available currencies:', Object.keys(currencies).join(', '))
    const currencyCode = (await question('💵 Currency Code (e.g., USD, EUR, BDT): ') || 'USD').toUpperCase()
    const currencySymbol = currencies[currencyCode as keyof typeof currencies] || '$'

    // Features Selection
    console.log('\n⚙️ FEATURES')
    console.log('='.repeat(50))
    const features = {
      darkMode: (await question('🌙 Enable Dark Mode? (y/n): ')).toLowerCase() === 'y',
      animations: (await question('✨ Enable Smooth Animations? (y/n): ')).toLowerCase() === 'y',
      reviews: (await question('⭐ Enable Product Reviews? (y/n): ')).toLowerCase() === 'y',
      wishlist: (await question('❤️ Enable Wishlist? (y/n): ')).toLowerCase() === 'y',
      multiLanguage: (await question('🌍 Enable Multi-language? (y/n): ')).toLowerCase() === 'y',
      newsletter: (await question('📧 Enable Newsletter Signup? (y/n): ')).toLowerCase() === 'y'
    }

    // Layout Preferences
    console.log('\n🎭 LAYOUT STYLE')
    console.log('='.repeat(50))
    console.log('Header Styles: 1=Minimal, 2=Classic, 3=Modern')
    const headerStyle = await question('🔝 Header Style (1-3): ') || '2'

    console.log('Footer Styles: 1=Simple, 2=Detailed, 3=Minimal')
    const footerStyle = await question('🔻 Footer Style (1-3): ') || '2'

    console.log('Product Card Styles: 1=Clean, 2=Modern, 3=Elegant')
    const productCardStyle = await question('🛍️ Product Card Style (1-3): ') || '2'

    const newTheme: NewTheme = {
      storeName,
      description,
      tagline,
      colors,
      fonts,
      currency: {
        code: currencyCode,
        symbol: currencySymbol
      },
      features,
      layout: {
        headerStyle: ['minimal', 'classic', 'modern'][parseInt(headerStyle) - 1] || 'classic',
        footerStyle: ['simple', 'detailed', 'minimal'][parseInt(footerStyle) - 1] || 'detailed',
        productCardStyle: ['clean', 'modern', 'elegant'][parseInt(productCardStyle) - 1] || 'modern'
      }
    }

    console.log('\n📋 THEME PREVIEW')
    console.log('='.repeat(50))
    console.log(`🏪 Store: ${newTheme.storeName}`)
    console.log(`📝 Description: ${newTheme.description}`)
    console.log(`🎨 Primary Color: ${newTheme.colors.primary}`)
    console.log(`📖 Fonts: ${newTheme.fonts.heading} / ${newTheme.fonts.body}`)
    console.log(`💰 Currency: ${newTheme.currency.code} (${newTheme.currency.symbol})`)
    console.log(`⚙️ Features: ${Object.entries(newTheme.features).filter(([_, enabled]) => enabled).map(([name]) => name).join(', ')}`)

    const confirm = await question('\n✅ Apply this theme? (y/n): ')

    if (confirm.toLowerCase() === 'y') {
      await applyNewTheme(newTheme, adminEmail, adminPassword)
      console.log('\n🎉 Theme created and applied successfully!')
      console.log('🔄 Run "npm run dev" to see your new theme!')
    } else {
      console.log('❌ Theme creation cancelled.')
    }

  } catch (error) {
    console.error('❌ Error creating theme:', error)
  } finally {
    rl.close()
  }
}

async function applyNewTheme(theme: NewTheme, adminEmail: string, adminPassword: string) {
  // 1. Create template configuration
  const templateConfig = {
    template: {
      name: 'E-Commerce Master Template',
      version: '2.0.0',
      author: 'Theme Creator',
      description: 'Custom generated theme'
    },
    branding: {
      siteName: theme.storeName,
      siteDescription: theme.description,
      tagline: theme.tagline,
      logo: '/placeholder-logo.svg',
      favicon: '/favicon.ico'
    },
    theme: {
      colors: theme.colors,
      fonts: theme.fonts,
      borderRadius: '0.5rem',
      spacing: {
        container: '1200px',
        section: '5rem'
      }
    },
    features: {
      authentication: true,
      reviews: theme.features.reviews,
      wishlist: theme.features.wishlist,
      search: true,
      filters: true,
      multiLanguage: theme.features.multiLanguage,
      darkMode: theme.features.darkMode,
      animations: theme.features.animations,
      newsletter: theme.features.newsletter,
      analytics: true,
      seo: true
    },
    layout: {
      header: {
        type: theme.layout.headerStyle,
        showSearch: true,
        showWishlist: theme.features.wishlist,
        showCart: true,
        showAuth: true
      },
      footer: {
        type: theme.layout.footerStyle,
        showSocialLinks: true,
        showNewsletter: theme.features.newsletter,
        showFooterPages: true
      },
      sidebar: {
        showCategories: true,
        showFilters: true,
        showRecentProducts: true
      }
    },
    ecommerce: {
      currency: theme.currency.code,
      currencySymbol: theme.currency.symbol,
      taxRate: 0.1,
      shippingCost: 10,
      freeShippingThreshold: 50,
      itemsPerPage: 12,
      maxCartItems: 99,
      allowGuestCheckout: true
    },
    admin: {
      itemsPerPage: 20,
      enableBulkActions: true,
      enableExport: true,
      enableImport: true
    },
    email: {
      enabled: false,
      orderConfirmation: true,
      welcomeEmail: true,
      resetPassword: true
    },
    social: {
      facebook: '',
      instagram: '',
      twitter: '',
      youtube: '',
      tiktok: '',
      pinterest: ''
    }
  }

  // Save template configuration
  const configDir = path.join(process.cwd(), 'config')
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true })
  }

  fs.writeFileSync(
    path.join(configDir, 'template.json'),
    JSON.stringify(templateConfig, null, 2)
  )

  // 2. Apply theme using existing customization script
  const { applyFullCustomization } = await import('./apply-customization.js')
  await applyFullCustomization()

  // 2.1. FORCE APPLY PRIMARY COLOR FROM THEME - MUST HAPPEN
  console.log('🎨 Forcing primary color application from theme...')
  const { applyPrimaryColorFromTheme } = await import('./apply-theme-colors.js')
  await applyPrimaryColorFromTheme()

  // 3. Update environment file
  const envContent = `# Environment Configuration
# Generated by E-Commerce Theme Creator

# ===== DATABASE =====
DATABASE_URL="file:./dev.db"

# ===== AUTHENTICATION =====
JWT_SECRET="${generateRandomString(64)}"

# ===== ADMIN CREDENTIALS =====
ADMIN_EMAIL="${adminEmail}"
ADMIN_PASSWORD="${adminPassword}"

# ===== SITE CONFIGURATION =====
SITE_NAME="${theme.storeName}"
SITE_DESCRIPTION="${theme.description}"
SITE_URL="http://localhost:3000"

# ===== THEME SETTINGS =====
THEME_PRIMARY_COLOR="${theme.colors.primary}"
THEME_FONT_HEADING="${theme.fonts.heading}"
THEME_FONT_BODY="${theme.fonts.body}"

# ===== E-COMMERCE =====
DEFAULT_CURRENCY="${theme.currency.code}"
DEFAULT_CURRENCY_SYMBOL="${theme.currency.symbol}"

# ===== FEATURES =====
ENABLE_DARK_MODE="${theme.features.darkMode}"
ENABLE_ANIMATIONS="${theme.features.animations}"
ENABLE_REVIEWS="${theme.features.reviews}"
ENABLE_WISHLIST="${theme.features.wishlist}"
ENABLE_MULTI_LANGUAGE="${theme.features.multiLanguage}"
ENABLE_NEWSLETTER="${theme.features.newsletter}"
`

  fs.writeFileSync(path.join(process.cwd(), '.env'), envContent)

  // 4. Create a theme summary
  const themeSummary = `# ${theme.storeName} - Theme Summary

Generated on: ${new Date().toLocaleString()}

## Theme Configuration

### Store Information
- **Name**: ${theme.storeName}
- **Description**: ${theme.description}
- **Tagline**: ${theme.tagline}

### Colors
- **Primary**: ${theme.colors.primary}
- **Secondary**: ${theme.colors.secondary}
- **Accent**: ${theme.colors.accent}

### Typography
- **Heading Font**: ${theme.fonts.heading}
- **Body Font**: ${theme.fonts.body}

### Currency
- **Code**: ${theme.currency.code}
- **Symbol**: ${theme.currency.symbol}

### Features Enabled
${Object.entries(theme.features).map(([feature, enabled]) => `- **${feature}**: ${enabled ? '✅' : '❌'}`).join('\n')}

### Layout Style
- **Header**: ${theme.layout.headerStyle}
- **Footer**: ${theme.layout.footerStyle}
- **Product Cards**: ${theme.layout.productCardStyle}

## Next Steps

1. Run \`npm run dev\` to start your store
2. Visit http://localhost:3000 to see your theme
3. Access admin panel at http://localhost:3000/admin
4. Customize further by editing \`config/template.json\`

---
*Generated by E-Commerce Theme Creator*
`

  // 5. Create admin user in database automatically
  console.log('👤 Creating admin user in database...')
  try {
    const { PrismaClient } = await import('@prisma/client')
    const bcrypt = await import('bcryptjs')
    const prisma = new PrismaClient()

    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail }
    })

    if (!existingAdmin) {
      // Hash the password
      const hashedPassword = await bcrypt.hash(adminPassword, 12)

      // Create admin user
      await prisma.user.create({
        data: {
          email: adminEmail,
          name: `${theme.storeName} Admin`,
          password: hashedPassword,
          role: 'SUPER_ADMIN',
          isTradeCustomer: false
        }
      })
      console.log('✅ Admin user created successfully!')
    } else {
      console.log('✅ Admin user already exists!')
    }

    await prisma.$disconnect()
  } catch (error) {
    console.error('⚠️ Admin user will be created on first login:', error)
  }

  fs.writeFileSync(path.join(process.cwd(), 'THEME_SUMMARY.md'), themeSummary)
}

function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

if (require.main === module) {
  createNewTheme()
}

export { createNewTheme }
