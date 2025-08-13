import fs from 'fs'
import path from 'path'

interface TemplateConfig {
  template: {
    name: string
    version: string
    author: string
    description: string
  }
  branding: {
    siteName: string
    siteDescription: string
    tagline: string
    logo: string
    favicon: string
  }
  theme: {
    colors: {
      primary: string
      secondary: string
      accent: string
      success: string
      warning: string
      error: string
      background: string
      foreground: string
    }
    fonts: {
      heading: string
      body: string
      mono: string
    }
    borderRadius: string
    spacing: {
      container: string
      section: string
    }
  }
  features: {
    authentication: boolean
    reviews: boolean
    wishlist: boolean
    search: boolean
    filters: boolean
    multiLanguage: boolean
    multiCurrency: boolean
    analytics: boolean
    seo: boolean
  }
  layout: {
    header: {
      type: string
      showSearch: boolean
      showWishlist: boolean
      showCart: boolean
      showAuth: boolean
    }
    footer: {
      type: string
      showSocialLinks: boolean
      showNewsletter: boolean
      showFooterPages: boolean
    }
    sidebar: {
      showCategories: boolean
      showFilters: boolean
      showRecentProducts: boolean
    }
  }
  ecommerce: {
    currency: string
    currencySymbol: string
    taxRate: number
    shippingCost: number
    freeShippingThreshold: number
    itemsPerPage: number
    maxCartItems: number
    allowGuestCheckout: boolean
  }
  admin: {
    itemsPerPage: number
    enableBulkActions: boolean
    enableExport: boolean
    enableImport: boolean
  }
  email: {
    enabled: boolean
    orderConfirmation: boolean
    welcomeEmail: boolean
    resetPassword: boolean
  }
  social: {
    facebook: string
    instagram: string
    twitter: string
    youtube: string
    tiktok: string
    pinterest: string
  }
}

class TemplateManager {
  private configPath: string
  private config: TemplateConfig | null = null

  constructor() {
    this.configPath = path.join(process.cwd(), 'config', 'template.json')
  }

  private loadConfig(): TemplateConfig {
    if (this.config) return this.config

    try {
      const configData = fs.readFileSync(this.configPath, 'utf8')
      this.config = JSON.parse(configData)
      return this.config!
    } catch (error) {
      console.warn('Failed to load template config, using defaults:', error)
      this.config = this.getDefaultConfig()
      return this.config
    }
  }

  private getDefaultConfig(): TemplateConfig {
    return {
      template: {
        name: 'E-Commerce Master Template',
        version: '1.0.0',
        author: 'Your Company',
        description: 'High-performance e-commerce template'
      },
      branding: {
        siteName: 'Your Store',
        siteDescription: 'Amazing products for everyone',
        tagline: 'Quality products, exceptional service',
        logo: '/placeholder-logo.svg',
        favicon: '/favicon.ico'
      },
      theme: {
        colors: {
          primary: '#3b82f6',
          secondary: '#64748b',
          accent: '#f59e0b',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          background: '#ffffff',
          foreground: '#0f172a'
        },
        fonts: {
          heading: 'Inter',
          body: 'Inter',
          mono: 'JetBrains Mono'
        },
        borderRadius: '0.5rem',
        spacing: {
          container: '1200px',
          section: '5rem'
        }
      },
      features: {
        authentication: true,
        reviews: true,
        wishlist: true,
        search: true,
        filters: true,
        multiLanguage: false,
        multiCurrency: false,
        analytics: true,
        seo: true
      },
      layout: {
        header: {
          type: 'default',
          showSearch: true,
          showWishlist: true,
          showCart: true,
          showAuth: true
        },
        footer: {
          type: 'default',
          showSocialLinks: true,
          showNewsletter: true,
          showFooterPages: true
        },
        sidebar: {
          showCategories: true,
          showFilters: true,
          showRecentProducts: true
        }
      },
      ecommerce: {
        currency: 'USD',
        currencySymbol: '$',
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
  }

  public getConfig(): TemplateConfig {
    return this.loadConfig()
  }

  public updateConfig(updates: Partial<TemplateConfig>): void {
    this.config = { ...this.loadConfig(), ...updates }
    this.saveConfig()
  }

  public getBranding() {
    return this.loadConfig().branding
  }

  public getTheme() {
    return this.loadConfig().theme
  }

  public getFeatures() {
    return this.loadConfig().features
  }

  public getEcommerceConfig() {
    return this.loadConfig().ecommerce
  }

  public getSocialLinks() {
    return this.loadConfig().social
  }

  public getLayout() {
    return this.loadConfig().layout
  }

  private saveConfig(): void {
    if (!this.config) return

    try {
      const configDir = path.dirname(this.configPath)
      if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true })
      }
      fs.writeFileSync(this.configPath, JSON.stringify(this.config, null, 2))
    } catch (error) {
      console.error('Failed to save template config:', error)
    }
  }

  public generateTailwindColors(): Record<string, any> {
    const colors = this.loadConfig().theme.colors
    return {
      primary: {
        DEFAULT: colors.primary,
        50: this.lightenColor(colors.primary, 95),
        100: this.lightenColor(colors.primary, 90),
        200: this.lightenColor(colors.primary, 80),
        300: this.lightenColor(colors.primary, 70),
        400: this.lightenColor(colors.primary, 60),
        500: colors.primary,
        600: this.darkenColor(colors.primary, 10),
        700: this.darkenColor(colors.primary, 20),
        800: this.darkenColor(colors.primary, 30),
        900: this.darkenColor(colors.primary, 40),
      },
      secondary: {
        DEFAULT: colors.secondary,
        50: this.lightenColor(colors.secondary, 95),
        500: colors.secondary,
        900: this.darkenColor(colors.secondary, 40),
      }
    }
  }

  private lightenColor(color: string, percent: number): string {
    // Simple implementation - you could use a proper color library here
    return color
  }

  private darkenColor(color: string, percent: number): string {
    // Simple implementation - you could use a proper color library here
    return color
  }
}

// Create and export the singleton instance
export const templateManager = new TemplateManager()
export type { TemplateConfig }
