'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useStore } from '@/lib/store'
import { ProductGrid } from '@/components/product-grid'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import type { Product } from '@/lib/types'

export function CategoryView({ initialProducts, categoryDetails }: { initialProducts: Product[], categoryDetails: any }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { addToCart } = useStore()

  const [filteredProducts, setFilteredProducts] = useState(initialProducts)
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest')
  const [selectedSubcategory, setSelectedSubcategory] = useState(searchParams.get('subcategory') || 'all')

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', sortBy)
    params.set('subcategory', selectedSubcategory)
    router.replace(`${window.location.pathname}?${params.toString()}`)
  }, [sortBy, selectedSubcategory, router, searchParams])

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1)
  }

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
                Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
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

            {filteredProducts.length > 0 ? (
              <ProductGrid
                products={filteredProducts}
                onViewDetails={handleViewDetails}
                onAddToCart={handleAddToCart}
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
