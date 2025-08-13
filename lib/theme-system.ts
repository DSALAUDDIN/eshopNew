import { templateManager } from './template'
import type { Metadata } from 'next'

/**
 * Dynamic theme configuration that adapts based on template settings
 */
export const createDynamicTheme = () => {
  const theme = templateManager.getTheme()
  
  return {
    extend: {
      colors: {
        primary: {
          50: `hsl(from ${theme.colors.primary} h s 95%)`,
          100: `hsl(from ${theme.colors.primary} h s 90%)`,
          200: `hsl(from ${theme.colors.primary} h s 80%)`,
          300: `hsl(from ${theme.colors.primary} h s 70%)`,
          400: `hsl(from ${theme.colors.primary} h s 60%)`,
          500: theme.colors.primary,
          600: `hsl(from ${theme.colors.primary} h s 45%)`,
          700: `hsl(from ${theme.colors.primary} h s 35%)`,
          800: `hsl(from ${theme.colors.primary} h s 25%)`,
          900: `hsl(from ${theme.colors.primary} h s 15%)`,
          DEFAULT: theme.colors.primary,
        },
        secondary: {
          50: `hsl(from ${theme.colors.secondary} h s 95%)`,
          500: theme.colors.secondary,
          900: `hsl(from ${theme.colors.secondary} h s 15%)`,
          DEFAULT: theme.colors.secondary,
        },
        accent: {
          500: theme.colors.accent,
          DEFAULT: theme.colors.accent,
        }
      },
      fontFamily: {
        heading: [theme.fonts.heading, 'sans-serif'],
        body: [theme.fonts.body, 'sans-serif'],
        mono: [theme.fonts.mono || 'JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-soft': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  }
}

/**
 * Generate dynamic metadata for any page
 */
export const generatePageMetadata = (
  pageType: 'home' | 'product' | 'category' | 'admin' | 'auth',
  data?: any
): Metadata => {
  const branding = templateManager.getBranding()
  const baseUrl = process.env.SITE_URL || 'http://localhost:3000'
  
  const defaultMetadata: Metadata = {
    metadataBase: new URL(baseUrl),
    title: branding.siteName,
    description: branding.siteDescription,
    keywords: ['ecommerce', 'online store', 'shopping'],
    authors: [{ name: branding.siteName }],
    creator: branding.siteName,
    publisher: branding.siteName,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: baseUrl,
      siteName: branding.siteName,
      title: branding.siteName,
      description: branding.siteDescription,
      images: [
        {
          url: `${baseUrl}${branding.logo}`,
          width: 1200,
          height: 630,
          alt: branding.siteName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: branding.siteName,
      description: branding.siteDescription,
      images: [`${baseUrl}${branding.logo}`],
    },
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon-16x16.png',
      apple: '/apple-touch-icon.png',
    },
    manifest: '/site.webmanifest',
  }

  // Customize metadata based on page type
  switch (pageType) {
    case 'product':
      if (data) {
        return {
          ...defaultMetadata,
          title: `${data.name} | ${branding.siteName}`,
          description: data.description,
          openGraph: {
            ...defaultMetadata.openGraph,
            type: 'website', // Changed from 'product' to fix TypeScript error
            title: `${data.name} | ${branding.siteName}`,
            description: data.description,
            images: data.images?.map((img: string) => ({
              url: img,
              width: 800,
              height: 800,
              alt: data.name,
            })) || defaultMetadata.openGraph?.images,
          },
        }
      }
      break

    case 'category':
      if (data) {
        return {
          ...defaultMetadata,
          title: `${data.name} | ${branding.siteName}`,
          description: `Shop ${data.name} products at ${branding.siteName}`,
          openGraph: {
            ...defaultMetadata.openGraph,
            title: `${data.name} | ${branding.siteName}`,
            description: `Shop ${data.name} products at ${branding.siteName}`,
          },
        }
      }
      break

    case 'admin':
      return {
        ...defaultMetadata,
        title: `Admin Dashboard | ${branding.siteName}`,
        description: 'Store management dashboard',
        robots: {
          index: false,
          follow: false,
        },
      }

    case 'auth':
      return {
        ...defaultMetadata,
        title: `Account | ${branding.siteName}`,
        description: 'Sign in to your account',
      }
  }

  return defaultMetadata
}

/**
 * Performance monitoring utilities
 */
export class PerformanceMonitor {
  private static metrics = new Map<string, number[]>()

  static startTiming(label: string): () => number {
    const start = performance.now()

    return () => {
      const duration = performance.now() - start
      this.recordMetric(label, duration)
      return duration
    }
  }

  static recordMetric(label: string, value: number) {
    if (!this.metrics.has(label)) {
      this.metrics.set(label, [])
    }

    const values = this.metrics.get(label)!
    values.push(value)

    // Keep only last 100 measurements
    if (values.length > 100) {
      values.shift()
    }
  }

  static getMetrics(label: string) {
    const values = this.metrics.get(label) || []
    if (values.length === 0) return null

    const avg = values.reduce((a, b) => a + b, 0) / values.length
    const min = Math.min(...values)
    const max = Math.max(...values)

    return { avg, min, max, count: values.length }
  }

  static getAllMetrics() {
    const result: Record<string, any> = {}

    for (const [label, values] of this.metrics.entries()) {
      result[label] = this.getMetrics(label)
    }

    return result
  }
}

/**
 * Advanced caching utilities
 */
export class CacheManager {
  private static memoryCache = new Map<string, {
    data: any
    timestamp: number
    ttl: number
    tags: string[]
  }>()

  static set(
    key: string,
    data: any,
    ttlSeconds: number = 300,
    tags: string[] = []
  ) {
    this.memoryCache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlSeconds * 1000,
      tags
    })
  }

  static get<T = any>(key: string): T | null {
    const item = this.memoryCache.get(key)

    if (!item) return null

    if (Date.now() - item.timestamp > item.ttl) {
      this.memoryCache.delete(key)
      return null
    }

    return item.data as T
  }

  static invalidateByTag(tag: string) {
    for (const [key, item] of this.memoryCache.entries()) {
      if (item.tags.includes(tag)) {
        this.memoryCache.delete(key)
      }
    }
  }

  static clear() {
    this.memoryCache.clear()
  }

  static getStats() {
    const total = this.memoryCache.size
    const expired = Array.from(this.memoryCache.values())
      .filter(item => Date.now() - item.timestamp > item.ttl).length

    return {
      total,
      active: total - expired,
      expired
    }
  }
}

/**
 * Custom hook factory for template features
 */
export const createTemplateHooks = () => {
  const features = templateManager.getFeatures()
  const ecommerce = templateManager.getEcommerceConfig()

  return {
    useAuth: () => features.authentication,
    useReviews: () => features.reviews,
    useWishlist: () => features.wishlist,
    useSearch: () => features.search,
    useCurrency: () => ({
      code: ecommerce.currency,
      symbol: ecommerce.currencySymbol,
      format: (amount: number) =>
        new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: ecommerce.currency
        }).format(amount)
    }),
    useShipping: () => ({
      cost: ecommerce.shippingCost,
      freeThreshold: ecommerce.freeShippingThreshold,
      isFree: (total: number) => total >= ecommerce.freeShippingThreshold
    })
  }
}
