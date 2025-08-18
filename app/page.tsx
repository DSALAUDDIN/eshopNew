"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { Product } from "@/lib/types"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"

// Import only the page-specific components (not Header, Navigation, Footer, etc.)
import { HeroSection } from "@/components/hero-section"
import { CategoryGrid } from "@/components/category-grid"
import { ProductGrid } from "@/components/product-grid"
import { Collections } from "@/components/collections"
import { CustomerReviews } from "@/components/customer-reviews"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  const router = useRouter()
  const {
    addToCart,
    searchQuery,
    products,
    loading,
    fetchProducts,
    fetchCategories
  } = useStore()

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])

  // Fetch initial data on component mount
  useEffect(() => {
    fetchProducts({ featured: true, limit: 12 })
    fetchCategories()
  }, [fetchProducts, fetchCategories])

  // Filter products based on search
  useEffect(() => {
    if (searchQuery.trim()) {
      setFilteredProducts(
        products.filter(
          (product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      )
    } else {
      setFilteredProducts(products)
    }
  }, [searchQuery, products])

  const handleViewDetails = (product: Product) => {
    router.push(`/product/${product.id}`)
  }

  const handleAddToCart = (product: Product, event?: React.MouseEvent<HTMLButtonElement>) => {
    addToCart(product, 1)

    // Improved button feedback
    if (event?.currentTarget) {
      const button = event.currentTarget
      const originalText = button.textContent
      button.textContent = "Added!"
      button.style.backgroundColor = "#10b981" // green color

      setTimeout(() => {
        button.textContent = originalText
        button.style.backgroundColor = ""
      }, 1500)
    }
  }

  // Get featured products for different sections - ensure filteredProducts is always an array
  const featuredProducts = Array.isArray(filteredProducts) ? filteredProducts.filter(product => product.isFeatured || product.isNew) : []
  const saleProducts = Array.isArray(filteredProducts) ? filteredProducts.filter(product => product.isSale) : []
  const newProducts = Array.isArray(filteredProducts) ? filteredProducts.filter(product => product.isNew) : []

  return (
    <main className="min-h-screen">
      <HeroSection />

      {/*<CategoryGrid />*/}

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked selection of trending items and customer favorites
            </p>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading products...</p>
            </div>
          ) : featuredProducts.length > 0 ? (
            <ProductGrid
              products={featuredProducts.slice(0, 8)}
              onViewDetails={handleViewDetails}
              onAddToCart={handleAddToCart}
            />
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No featured products available</p>
            </div>
          )}
        </div>
      </section>

      {/* Sale Products Section */}
      {saleProducts.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">On Sale Now</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Don't miss out on these amazing deals and discounts
              </p>
            </div>

            <ProductGrid
              products={saleProducts.slice(0, 4)}
              onViewDetails={handleViewDetails}
              onAddToCart={handleAddToCart}
            />

            <div className="text-center mt-8">
              <Button
                onClick={() => router.push('/category/all?sale=true')}
                variant="outline"
              >
                View All Sale Items
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* New Arrivals Section */}
      {newProducts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">New Arrivals</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Fresh styles just in - be the first to discover our latest collection
              </p>
            </div>

            <ProductGrid
              products={newProducts.slice(0, 4)}
              onViewDetails={handleViewDetails}
              onAddToCart={handleAddToCart}
            />

            <div className="text-center mt-8">
              <Button
                onClick={() => router.push('/category/all?new=true')}
                variant="outline"
              >
                View All New Items
              </Button>
            </div>
          </div>
        </section>
      )}

      <Collections />
      <CustomerReviews />
    </main>
  )
}
