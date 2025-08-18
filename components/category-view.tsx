'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ProductGrid } from '@/components/product-grid'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Product } from '@/lib/types'

export function CategoryView({ initialProducts, categoryDetails }: { initialProducts: Product[], categoryDetails: any }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Remove filteredProducts state
  // const [filteredProducts, setFilteredProducts] = useState(initialProducts)
  // Use initialProducts directly
  const products = initialProducts;
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest')
  const [selectedSubcategory, setSelectedSubcategory] = useState(searchParams.get('subcategory') || 'all')

  useEffect(() => {
    // Only update the URL if the params have changed
    const params = new URLSearchParams(window.location.search)
    let shouldUpdate = false;
    if (params.get('sort') !== sortBy) {
      params.set('sort', sortBy)
      shouldUpdate = true;
    }
    if (params.get('subcategory') !== selectedSubcategory) {
      params.set('subcategory', selectedSubcategory)
      shouldUpdate = true;
    }
    if (shouldUpdate) {
      // Use router.replace to avoid adding to browser history
      router.replace(`${window.location.pathname}?${params.toString()}`)
    }
  }, [sortBy, selectedSubcategory, router])

  const handleViewDetails = (product: Product) => {
    router.push(`/product/${product.id}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8 text-center lg:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 capitalize">
            {categoryDetails.name}
          </h1>
          {categoryDetails.description && (
            <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto lg:mx-0">
              {categoryDetails.description}
            </p>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h3 className="text-lg font-semibold mb-6">Filters</h3>
              {categoryDetails.subcategories && categoryDetails.subcategories.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Subcategory</label>
                  <Select value={selectedSubcategory} onValueChange={setSelectedSubcategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="All subcategories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Subcategories</SelectItem>
                      {categoryDetails.subcategories.map((sub: any) => (
                        <SelectItem key={sub.id} value={sub.slug}>
                          {sub.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <p className="text-gray-600">
                Showing {products.length} {products.length === 1 ? 'product' : 'products'}
              </p>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Sort by:</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-asc">Price: Low to High</SelectItem>
                    <SelectItem value="price-desc">Price: High to Low</SelectItem>
                    <SelectItem value="name-asc">Name A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {products.length > 0 ? (
              <ProductGrid
                products={products}
                onViewDetails={handleViewDetails}
              />
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">😢</div>
                <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
                <p className="text-gray-600">
                  There are no products matching your current filters.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
