'use client'

import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ProductGrid } from '@/components/product-grid'
import { useStore } from '@/lib/store'
import { Search, Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Product } from '@/lib/types'

type SortBy = 'relevance' | 'price-low' | 'price-high' | 'name' | 'newest'

/** If your Product doesn't include these fields, we extend it here (non-breaking). */
type ProductExt = Product & {
  categoryId?: string | number
  createdAt?: string | number | Date
}

interface CategoryItem {
  id: string | number
  name: string
}

function parsePriceRange(range: string): [number, number | null] {
  if (!range || range === 'all') return [0, null]
  if (range.includes('-')) {
    const [min, max] = range.split('-').map((v) => Number(v))
    return [isFinite(min) ? min : 0, isFinite(max) ? max : null]
  }
  const min = Number(range)
  return [isFinite(min) ? min : 0, null]
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const queryFromUrl = searchParams.get('q') ?? ''

  // Narrow the store slice (2-step cast to avoid TS2352)
  const {
    products: storeProducts,
    fetchProducts,
    loading,
    categories: storeCategories,
    fetchCategories,
    addToCart,
  } = (useStore() as unknown) as {
    products: ProductExt[]
    fetchProducts: () => void | Promise<void>
    loading: boolean
    categories: CategoryItem[]
    fetchCategories: () => void | Promise<void>
    addToCart: (product: Product, qty: number) => void
  }

  const [searchQuery, setSearchQuery] = useState<string>(queryFromUrl)
  const [selectedCategory, setSelectedCategory] = useState<string>('') // '' | 'all' | id
  const [priceRange, setPriceRange] = useState<string>('')             // '' | 'all' | "min-max" | "5000"
  const [sortBy, setSortBy] = useState<SortBy>('relevance')

  const products = storeProducts ?? []
  const categories = storeCategories ?? []

  const handleViewDetails = (product: Product) => {
    router.push(`/product/${product.id}`)
  }

  // Match ProductGrid’s (product, event?) signature
  const handleAddToCart = (product: Product, _event?: React.MouseEvent<HTMLButtonElement>) => {
    addToCart(product, 1)
  }

  useEffect(() => {
    fetchProducts?.()
    fetchCategories?.()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setSearchQuery(queryFromUrl)
  }, [queryFromUrl])

  const filteredProducts: ProductExt[] = useMemo(() => {
    let result = [...products]

    // Text search
    const q = searchQuery.trim().toLowerCase()
    if (q) {
      const terms = q.split(/\s+/)
      result = result.filter((p) => {
        const searchable = `${p.name ?? ''} ${(p as any).description ?? ''} ${(p as any).sku ?? ''}`.toLowerCase()
        return terms.some((t) => searchable.includes(t))
      })
    }

    // Category filter
    if (selectedCategory && selectedCategory !== 'all') {
      result = result.filter((p) => String(p.categoryId ?? '') === String(selectedCategory))
    }

    // Price range filter
    if (priceRange && priceRange !== 'all') {
      const [min, max] = parsePriceRange(priceRange)
      result = result.filter((p) => {
        const price = Number((p as any).price || 0)
        return max !== null ? price >= min && price <= max : price >= min
      })
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => Number((a as any).price) - Number((b as any).price))
        break
      case 'price-high':
        result.sort((a, b) => Number((b as any).price) - Number((a as any).price))
        break
      case 'name':
        result.sort((a, b) => String(a.name ?? '').localeCompare(String(b.name ?? '')))
        break
      case 'newest':
        result.sort((a, b) => {
          const at = new Date(a.createdAt ?? 0).getTime()
          const bt = new Date(b.createdAt ?? 0).getTime()
          return bt - at
        })
        break
      case 'relevance':
      default:
        break
    }

    return result
  }, [products, searchQuery, selectedCategory, priceRange, sortBy])

  const clearFilters = () => {
    setSelectedCategory('all')
    setPriceRange('all')
    setSortBy('relevance')
  }

  const hasActiveFilters =
      ((selectedCategory && selectedCategory !== 'all') ||
          (priceRange && priceRange !== 'all') ||
          sortBy !== 'relevance')

  if (loading) {
    return (
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="container mx-auto px-4">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
    )
  }

  return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* Search Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {searchQuery ? `Search Results for "${searchQuery}"` : 'Search Products'}
            </h1>

            {/* Search Bar */}
            <div className="max-w-2xl mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                    placeholder="Search for products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                />
              </div>
            </div>

            {/* Results Count & Clear */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
                {searchQuery && ` for "${searchQuery}"`}
              </p>

              {hasActiveFilters && (
                  <Button
                      variant="outline"
                      size="sm"
                      onClick={clearFilters}
                      className="text-sm"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear Filters
                  </Button>
              )}
            </div>
          </div>

          {/* Filters */}
          <Card className="mb-8">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Category */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Category
                  </label>
                  <Select value={selectedCategory} onValueChange={(v: string) => setSelectedCategory(v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                          <SelectItem key={String(category.id)} value={String(category.id)}>
                            {category.name}
                          </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Price Range
                  </label>
                  <Select value={priceRange} onValueChange={(v: string) => setPriceRange(v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Prices" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Prices</SelectItem>
                      <SelectItem value="0-500">Under ৳500</SelectItem>
                      <SelectItem value="500-1000">৳500 - ৳1,000</SelectItem>
                      <SelectItem value="1000-2000">৳1,000 - ৳2,000</SelectItem>
                      <SelectItem value="2000-5000">৳2,000 - ৳5,000</SelectItem>
                      <SelectItem value="5000">Above ৳5,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Sort By
                  </label>
                  <Select value={sortBy} onValueChange={(v: SortBy) => setSortBy(v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Relevance</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="name">Name A-Z</SelectItem>
                      <SelectItem value="newest">Newest First</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Reset */}
                <div className="flex items-end">
                  <Button
                      onClick={clearFilters}
                      variant="outline"
                      className="w-full"
                      disabled={!hasActiveFilters}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </div>

              {/* Active Filters */}
              {hasActiveFilters && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {selectedCategory && selectedCategory !== 'all' && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          Category: {categories.find((c) => String(c.id) === String(selectedCategory))?.name ?? 'Unknown'}
                          <button
                              type="button"
                              onClick={() => setSelectedCategory('all')}
                              aria-label="Clear category filter"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                    )}
                    {priceRange && priceRange !== 'all' && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          Price: {priceRange === '5000' ? 'Above ৳5,000' : `৳${priceRange.replace('-', ' - ৳')}`}
                          <button
                              type="button"
                              onClick={() => setPriceRange('all')}
                              aria-label="Clear price filter"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                    )}
                    {sortBy !== 'relevance' && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          Sort: {sortBy === 'price-low' ? 'Price Low–High'
                            : sortBy === 'price-high' ? 'Price High–Low'
                                : sortBy === 'name' ? 'Name A–Z'
                                    : 'Newest First'}
                          <button
                              type="button"
                              onClick={() => setSortBy('relevance')}
                              aria-label="Clear sort"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                    )}
                  </div>
              )}
            </CardContent>
          </Card>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
              <ProductGrid
                  products={filteredProducts}                           // Product[]
                  title={searchQuery ? `Search Results for "${searchQuery}"` : 'Products'}
                  onViewDetails={handleViewDetails}                     // (product: Product) => void
                  onAddToCart={handleAddToCart}                         // (product: Product, event?) => void
              />
          ) : (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500 mb-4">
                  {searchQuery
                      ? `We couldn't find any products matching "${searchQuery}". Try adjusting your search or filters.`
                      : 'Try entering a search term to find products.'
                  }
                </p>
                {hasActiveFilters && (
                    <Button onClick={clearFilters} variant="outline">
                      Clear all filters
                    </Button>
                )}
              </div>
          )}
        </div>
      </div>
  )
}
