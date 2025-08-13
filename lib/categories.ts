// This file is deprecated - all category data now comes from live API
// Categories are fetched from /api/categories endpoint
// Keep only the interface definitions for TypeScript

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  isActive: boolean
  subcategories: Subcategory[]
  _count?: {
    products: number
  }
}

export interface Subcategory {
  id: string
  name: string
  slug: string
  categoryId: string
  isActive: boolean
  _count?: {
    products: number
  }
}

// Export empty array for backwards compatibility
export const categories: Category[] = []
