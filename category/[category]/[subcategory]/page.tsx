"use client"

import { useParams, useRouter } from "next/navigation"
import { ProductGrid } from "@/components/product-grid"
import { useStore } from "@/lib/store"
import { useEffect, useState } from "react"
import type { Product } from "@/lib/types"
import type { Subcategory } from "@/lib/categories"
import FilterBar from "@/components/FilterBar"

export default function CategorySubcategoryPage() {
  const params = useParams()
  const router = useRouter()
  const { addToCart, searchQuery, products, categories, fetchProducts, fetchCategories } = useStore()
  const { category, subcategory } = params as { category: string; subcategory: string }

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [sortBy, setSortBy] = useState("")
  const [filterBy, setFilterBy] = useState("")

  // Fetch data on component mount
  useEffect(() => {
    if (products.length === 0) {
      fetchProducts()
    }
    if (categories.length === 0) {
      fetchCategories()
    }
  }, [products.length, categories.length, fetchProducts, fetchCategories])

  // Find current category and its subcategories - with null safety
  const currentCategory = categories ? categories.find((cat) => cat.slug === category) : null
  const subcategories = currentCategory ? currentCategory.subcategories : []

  useEffect(() => {
    if (!products || products.length === 0) return

    let filtered = products.filter(
      (p) =>
        p.category.toLowerCase() === category.toLowerCase() &&
        p.subcategory.toLowerCase() === subcategory.toLowerCase()
    )

    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply filters
    if (filterBy === "inStock") {
      filtered = filtered.filter((p) => p.inStock)
    } else if (filterBy === "outStock") {
      filtered = filtered.filter((p) => !p.inStock)
    }

    // Apply sorting
    if (sortBy === "newest") {
      filtered = filtered.filter((p) => p.isNew)
    } else if (sortBy === "priceLow") {
      filtered = filtered.sort((a, b) => a.price - b.price)
    } else if (sortBy === "priceHigh") {
      filtered = filtered.sort((a, b) => b.price - a.price)
    }

    setFilteredProducts(filtered)
  }, [category, subcategory, searchQuery, sortBy, filterBy, products])

  const handleViewDetails = (product: Product) => {
    router.push(`/product/${product.id}`)
  }

  const handleAddToCart = (product: Product, event?: React.MouseEvent<HTMLButtonElement>) => {
    addToCart(product, 1)
    if (event?.currentTarget) {
      const button = event.currentTarget
      const originalText = button.textContent
      button.textContent = "Added!"
      button.style.backgroundColor = "#10b981"
      button.disabled = true
      setTimeout(() => {
        button.textContent = originalText
        button.style.backgroundColor = ""
        button.disabled = false
      }, 1500)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <div className="text-sm text-gray-600">
          <a href="/" className="hover:text-[#6EC1D1] transition-colors">Home</a>
          {" > "}
          <a href={`/category/${category}`} className="hover:text-[#6EC1D1] transition-colors capitalize">
            {currentCategory?.name || category}
          </a>
          {" > "}
          <span className="text-gray-800 capitalize">{subcategory.replace('-', ' ')}</span>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar - Left */}
        <aside className="w-64 min-w-[200px] hidden md:block">
          <div className="bg-white border rounded-lg p-6">
            <h3 className="font-bold text-lg mb-4 text-gray-800">{currentCategory?.name}</h3>
            <ul className="space-y-2">
              {subcategories.map((subcat: Subcategory) => (
                <li key={subcat.id}>
                  <a
                    href={`/category/${category}/${subcat.slug}`}
                    className={`block px-3 py-2 rounded transition-colors text-sm ${
                      subcategory === subcat.slug
                        ? "bg-[#6EC1D1] text-white font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {subcat.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main Content - Right */}
        <div className="flex-1">
          {/* Page Title */}
          <h1 className="text-2xl md:text-3xl font-bold mb-6 capitalize font-brandon text-gray-800">
            {subcategory.replace('-', ' ')}
          </h1>

          {/* Filter Bar */}
          <div className="mb-6">
            <FilterBar
              total={filteredProducts.length}
              onSort={setSortBy}
              onFilter={setFilterBy}
            />
          </div>

          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
            <ProductGrid
              products={filteredProducts}
              title=""
              onViewDetails={handleViewDetails}
              onAddToCart={handleAddToCart}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">
                No products found in this category.
              </p>
              <p className="text-sm text-gray-400">
                Try adjusting your filters or browse other categories.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
