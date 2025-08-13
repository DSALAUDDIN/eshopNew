// This file is deprecated - all product data now comes from live API
// Products are fetched from /api/products endpoint
// Keep only utility functions if needed for TypeScript

import type { Product } from "./types"

// Export empty array for backwards compatibility
export const products: Product[] = []

// These functions are deprecated - use the store methods instead
// export const getProductsByCategory = (category: string) => {
//   Use fetchProducts({ category }) from the store instead
// }

// export const getProductsBySubcategory = (subcategory: string) => {
//   Use fetchProducts({ subcategory }) from the store instead
// }

// export const searchProducts = (query: string) => {
//   Use fetchProducts({ search: query }) from the store instead
// }
