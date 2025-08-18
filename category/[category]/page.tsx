'use client'

import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { useStore } from '@/lib/store'
import { ProductGrid } from '@/components/product-grid'
import CategoryHeader from '@/components/CategoryHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Search, Filter } from 'lucide-react'
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
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [selectedSubcategory, setSelectedSubcategory] = useState('')

  // Fetch initial data
  useEffect(() => {
    fetchCategories()
    if (categorySlug) {
      fetchProducts({ category: categorySlug, limit: 50 })
    }
  }, [categorySlug, fetchProducts, fetchCategories])

  // Find current category info
  useEffect(() => {
    if (categories.length > 0 && categorySlug) {
      const category = categories.find(cat => cat.slug === categorySlug)
      setCurrentCategory(category)
    }
  }, [categories, categorySlug])

  // Apply filters and sorting
  useEffect(() => {
    // Ensure products is always an array before spreading
    let filtered = Array.isArray(products) ? [...products] : []

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Subcategory filter - handle both subcategory slug and name
    if (selectedSubcategory && selectedSubcategory !== 'all') {
      filtered = filtered.filter(product =>
        product.subcategory === selectedSubcategory ||
        product.subcategory?.slug === selectedSubcategory
      )
    }

    // Price range filter
    if (priceRange.min) {
      filtered = filtered.filter(product => product.price >= parseFloat(priceRange.min))
    }
    if (priceRange.max) {
      filtered = filtered.filter(product => product.price <= parseFloat(priceRange.max))
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
      filtered = filtered.filter(product =>
        product.subcategory === subcategoryParam ||
        product.subcategory?.slug === subcategoryParam
      )
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
        // Already sorted by newest in API
        break
    }

    setFilteredProducts(filtered)
  }, [products, searchTerm, selectedSubcategory, priceRange, sortBy, searchParams])

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1)
  }

  const handleViewDetails = (product: Product) => {
    window.location.href = `/product/${product.id}`
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedSubcategory('all')
    setPriceRange({ min: '', max: '' })
    setSortBy('newest')
  }

  const activeFiltersCount = [
    searchTerm,
    selectedSubcategory,
    priceRange.min,
    priceRange.max,
    searchParams.get('sale'),
    searchParams.get('new'),
    searchParams.get('featured')
  ].filter(Boolean).length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8">
          {/* Category Header with Dynamic Thumbnail */}
          {currentCategory && (
            <CategoryHeader
              image={currentCategory.image}
              title={currentCategory.name}
              description={currentCategory.description}
              categoryId={currentCategory.id}
            />
          )}

          {/* Fallback if no category found */}
          {!currentCategory && (
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Products</h1>
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

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Subcategories */}
              {currentCategory?.subcategories && currentCategory.subcategories.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Subcategory</label>
                  <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="All subcategories" />
                    </SelectTrigger>
                    <SelectContent>
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

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Price Range</label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                  />
                </div>
              </div>

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
            {/* Sort and Results Header */}
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
