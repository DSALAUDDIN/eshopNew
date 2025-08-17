'use client'

import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { useStore } from '@/lib/store'
import { ProductGrid } from '@/components/product-grid'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Search } from 'lucide-react'
import type { Product } from '@/lib/types'

export default function CategoryPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const categorySlug = params.category as string

  const {
    products,
    categories,
    loading,
    fetchProducts,
    fetchCategories,
    addToCart
  } = useStore()

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [currentCategory, setCurrentCategory] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [selectedSubcategory, setSelectedSubcategory] = useState('')

  // Fetch initial data
  useEffect(() => {
    fetchCategories()
    if (categorySlug) {
      if (categorySlug === 'all') {
        fetchProducts({ limit: 100 })
      } else {
        fetchProducts({ category: categorySlug, limit: 50 })
      }
    }
  }, [categorySlug, fetchProducts, fetchCategories])

  // Find current category info
  useEffect(() => {
    if (categories.length > 0 && categorySlug) {
      const category = categories.find(cat => cat.slug === categorySlug)
      setCurrentCategory(category)
    }
  }, [categories, categorySlug])

  // Helper type guard for subcategory object
  function isSubcategoryObject(subcat: any): subcat is { slug: string } {
    return subcat && typeof subcat === 'object' && 'slug' in subcat && typeof subcat.slug === 'string';
  }

  // Apply filters and sorting
  useEffect(() => {
    let filtered = Array.isArray(products) ? [...products] : []

    // Subcategory filter
    if (selectedSubcategory && selectedSubcategory !== 'all') {
      filtered = filtered.filter(product => {
        if (typeof product.subcategory === 'string') {
          return product.subcategory === selectedSubcategory
        } else if (isSubcategoryObject(product.subcategory)) {
          return product.subcategory.slug === selectedSubcategory
        }
        return false
      })
    }

    // URL params filters
    const saleParam = searchParams.get('sale')
    const newParam = searchParams.get('new')
    const featuredParam = searchParams.get('featured')
    const subcategoryParam = searchParams.get('subcategory')

    if (saleParam === 'true') {
      filtered = filtered.filter(product => product.isSale)
    }
    if (newParam === 'true') {
      filtered = filtered.filter(product => product.isNew)
    }
    if (featuredParam === 'true') {
      filtered = filtered.filter(product => product.isFeatured)
    }
    if (subcategoryParam) {
      filtered = filtered.filter(product => {
        if (typeof product.subcategory === 'string') {
          return product.subcategory === subcategoryParam
        } else if (isSubcategoryObject(product.subcategory)) {
          return product.subcategory.slug === subcategoryParam
        }
        return false
      })
    }

    // Sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'newest':
      default:
        break
    }

    setFilteredProducts(filtered)
  }, [products, searchTerm, selectedSubcategory, sortBy, searchParams])

  const handleAddToCart = (product: Product) => { // Keep this line
    addToCart(product, 1)
  }

  const handleViewDetails = (product: Product) => {
    window.location.href = `/product/${product.id}`
  }

  const clearFilters = () => {
    setSearchTerm('') // Keep this line
    setSelectedSubcategory('all')
    setSortBy('newest')
  }

  const activeFiltersCount = [
    searchTerm,
    selectedSubcategory,
    searchParams.get('sale'),
    searchParams.get('new'),
    searchParams.get('featured')
  ].filter(Boolean).length

  return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-8 text-center lg:text-left">
            {currentCategory ? (
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 capitalize">
                    {currentCategory.name}
                  </h1>
                  {currentCategory.description && (
                      <p className="text-gray-600 text-base md:text-lg max-w-2xl">
                        {currentCategory.description}
                      </p>
                  )}
                </div>
            ) : (
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    Products
                  </h1>
                  <p className="text-gray-600 text-base md:text-lg">
                    Explore our latest collection of products
                  </p>
                </div>
            )}
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Filters</h3>
                  {activeFiltersCount > 0 && (
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{activeFiltersCount}</Badge>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearFilters}
                            className="text-blue-600"
                        >
                          Clear all
                        </Button>
                      </div>
                  )}
                </div>

                {/* Subcategories */}
                {currentCategory?.subcategories && currentCategory.subcategories.length > 0 && (
                    <div className="mb-6">
                      <label className="block text-sm font-medium mb-2">Subcategory</label>
                      <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="All subcategories" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60 overflow-y-auto">
                          <SelectItem value="all">All subcategories</SelectItem>
                          {currentCategory.subcategories.map((sub: any) => (
                              <SelectItem key={sub.id} value={sub.slug}>
                                {sub.name} ({sub._count.products})
                              </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                )}

                {/* Quick Filters */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Quick Filters</label>
                  <div className="space-y-2">
                    {searchParams.get('sale') === 'true' && (
                        <Badge variant="secondary">On Sale</Badge>
                    )}
                    {searchParams.get('new') === 'true' && (
                        <Badge variant="secondary">New Arrivals</Badge>
                    )}
                    {searchParams.get('featured') === 'true' && (
                        <Badge variant="secondary">Featured</Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="lg:w-3/4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                  <p className="text-gray-600">
                    Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Sort by:</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="name">Name A-Z</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Products */}
              {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading products...</p>
                  </div>
              ) : filteredProducts.length > 0 ? (
                  <ProductGrid
                      products={filteredProducts}
                      onViewDetails={handleViewDetails}
                      onAddToCart={handleAddToCart}
                  />
              ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold mb-2">No products found</h3>
                    <p className="text-gray-600 mb-4">
                      Try adjusting your filters or search terms
                    </p>
                    <Button onClick={clearFilters} variant="outline">
                      Clear all filters
                    </Button>
                  </div>
              )}
            </div>
          </div>
        </div>
      </div>
  )
}
