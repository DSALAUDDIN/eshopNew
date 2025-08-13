"use client"

import { Search, Heart, Grid, List, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { useStore } from "@/lib/store"
import { useState, useEffect } from "react"
import type { Product } from "@/lib/types"

export default function MugsTeapotsPage() {
  const { 
    user, 
    logout, 
    getCartItemCount, 
    setCartOpen,
    toggleFavorite, 
    isFavorite,
    products,
    fetchProducts 
  } = useStore()

  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("default")
  const [filterBy, setFilterBy] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [itemsPerPage, setItemsPerPage] = useState(60)
  const [currentPage, setCurrentPage] = useState(1)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Fetch products on component mount
  useEffect(() => {
    if (products.length === 0) {
      fetchProducts()
    }
  }, [products.length, fetchProducts])

  // Get mugs and teapots products - with null safety
  const allMugsProducts = products ? products.filter((p) => p.subcategory === "mugs" || p.category === "living") : []

  // Filter and search products
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(allMugsProducts)

  useEffect(() => {
    let filtered = allMugsProducts || []

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Apply category filter
    if (filterBy === "new") {
      filtered = filtered.filter((p) => p.isNew)
    } else if (filterBy === "sale") {
      filtered = filtered.filter((p) => p.isSale)
    }

    // Apply sorting
    if (sortBy === "price-low") {
      filtered = [...filtered].sort((a, b) => a.price - b.price)
    } else if (sortBy === "price-high") {
      filtered = [...filtered].sort((a, b) => b.price - a.price)
    } else if (sortBy === "newest") {
      filtered = [...filtered].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
    }

    setFilteredProducts(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }, [searchQuery, sortBy, filterBy, allMugsProducts])

  const handleLoginClick = () => {
    if (user) {
      logout()
    }
  }

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#FFA000] text-white">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white hover:bg-[#E68900]"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>

            {/* Search - Hidden on mobile, shown on desktop */}
            <div className="hidden md:flex items-center space-x-2 flex-1 max-w-xs">
              <Search className="w-4 h-4" />
              <Input
                placeholder="Enter keyword or product code"
                className="bg-transparent border-white/30 text-white placeholder:text-white/70 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Logo */}
            <div className="text-center flex-1 md:flex-none">
              <h1 className="text-2xl md:text-3xl font-light">SFDBD</h1>
              <p className="text-xs md:text-sm tracking-wider">trade</p>
            </div>

            {/* Right Menu */}
            <div className="flex items-center space-x-2 md:space-x-6 text-xs md:text-sm">
              <button
                onClick={handleLoginClick}
                className="hidden md:flex items-center space-x-1 hover:text-white transition-colors"
              >
                <span>👤</span>
                <span>{user ? `Welcome, ${user.name}` : "Login to TRADE"}</span>
              </button>

              {/* Mobile Login Button */}
              <button onClick={handleLoginClick} className="md:hidden hover:text-teal-200 transition-colors">
                <span>👤</span>
              </button>

              <button
                onClick={() => setCartOpen(true)}
                className="flex items-center space-x-1 hover:text-white transition-colors"
              >
                <span>🛒</span>
                <span className="hidden sm:inline">
                  ({getCartItemCount()})
                </span>
                <span className="sm:hidden">({getCartItemCount()})</span>
              </button>

              <div className="hidden md:flex items-center space-x-1">
                <span>📞</span>
                <span>Contact</span>
              </div>

              <div className="hidden md:block text-right">
                <div>৳ $</div>
              </div>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden mt-3">
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4" />
              <Input
                placeholder="Search products..."
                className="bg-transparent border-white/30 text-white placeholder:text-white/70 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="bg-white w-64 h-full p-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium">Menu</h2>
              <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(false)}>
                ×
              </Button>
            </div>
            <nav className="space-y-4">
              <a href="/" className="block text-gray-700 hover:text-[#FFA000] font-medium transition-colors">
                HOME
              </a>
              <a href="#" className="block text-gray-700 hover:text-[#FFA000] font-medium transition-colors">
                FASHION
              </a>
              <a href="#" className="block text-gray-700 hover:text-[#FFA000] font-medium transition-colors">
                DÉCOR
              </a>
              <a href="#" className="block text-gray-700 hover:text-[#FFA000] font-medium transition-colors">
                FURNITURE
              </a>
              <a href="#" className="block text-red-500 hover:text-red-600 font-medium">
                SALE
              </a>
              <a href="#" className="block text-gray-700 hover:text-[#FFA000] font-medium transition-colors">
                HELP
              </a>
            </nav>
          </div>
        </div>
      )}

      {/* Navigation - Hidden on mobile */}
      <nav className="hidden md:block bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex justify-center space-x-8 py-4">
            <a href="/" className="text-gray-700 hover:text-[#FFA000] font-medium transition-colors">
              NEW
            </a>
            <a href="#" className="text-gray-700 hover:text-[#FFA000] font-medium transition-colors">
              BESTSELLERS
            </a>
            <a href="#" className="text-gray-700 hover:text-[#FFA000] font-medium transition-colors">
              HOMEWARE
            </a>
            <a href="#" className="text-[#FFA000] font-medium border-b-2 border-[#FFA000]">
              LIVING
            </a>
            <a href="#" className="text-red-500 hover:text-red-600 font-medium transition-colors">
              CHRISTMAS
            </a>
            <a href="#" className="text-gray-700 hover:text-[#FFA000] font-medium transition-colors">
              KIDS
            </a>
            <a href="#" className="text-red-500 hover:text-red-600 font-medium transition-colors">
              SALE
            </a>
            <a href="#" className="text-gray-700 hover:text-[#FFA000] font-medium transition-colors">
              HELP
            </a>
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="bg-gray-50 py-2">
        <div className="container mx-auto px-4">
          <div className="text-xs md:text-sm text-gray-600">
            <a href="/" className="hover:text-[#FFA000] transition-colors">
              Home
            </a>{" "}
            &gt;
            <a href="#" className="hover:text-[#FFA000] transition-colors">
              {" "}
              Homeware
            </a>{" "}
            &gt;
            <a href="#" className="hover:text-[#FFA000] transition-colors">
              {" "}
              Travel Mugs
            </a>{" "}
            &gt;
            <a href="#" className="hover:text-[#FFA000] transition-colors">
              {" "}
              Kitchen & Dining
            </a>{" "}
            &gt;
            <span className="text-gray-800"> Mugs & Teapots</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 md:py-8">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          {/* Sidebar - Hidden on mobile, collapsible on tablet */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="space-y-4 md:space-y-6">
              {/* Search */}
              <div className="lg:block">
                <Input
                  placeholder="Search products..."
                  className="w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Quick Filters */}
              <div>
                <h3 className="font-medium mb-3">QUICK FILTERS</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setFilterBy("all")}
                    className={`block w-full text-left text-sm px-2 py-1 rounded transition-colors ${
                      filterBy === "all" ? "bg-[#FFF8E1] text-[#FFA000]" : "hover:bg-gray-100"
                    }`}
                  >
                    All Products ({allMugsProducts.length})
                  </button>
                  <button
                    onClick={() => setFilterBy("new")}
                    className={`block w-full text-left text-sm px-2 py-1 rounded transition-colors ${
                      filterBy === "new" ? "bg-[#FFF8E1] text-[#FFA000]" : "hover:bg-gray-100"
                    }`}
                  >
                    New Items ({allMugsProducts.filter((p) => p.isNew).length})
                  </button>
                  <button
                    onClick={() => setFilterBy("sale")}
                    className={`block w-full text-left text-sm px-2 py-1 rounded transition-colors ${
                      filterBy === "sale" ? "bg-[#FFF8E1] text-[#FFA000]" : "hover:bg-gray-100"
                    }`}
                  >
                    Sale Items ({allMugsProducts.filter((p) => p.isSale).length})
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6 space-y-4 md:space-y-0">
              <div>
                <h1 className="text-xl md:text-2xl font-light text-gray-800 mb-2">MUGS & TEAPOTS</h1>
                <p className="text-xs md:text-sm text-gray-600 mb-2">
                  Discover our delightful collection of mugs and teapots, perfect for cozy moments and thoughtful gifts.
                  From quirky character mugs to elegant teapots, each piece is designed to bring joy to your daily tea
                  and coffee rituals.
                </p>
                <p className="text-xs md:text-sm text-gray-500">
                  Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredProducts.length)} of{" "}
                  {filteredProducts.length} products
                </p>
              </div>

              {/* Controls - Stacked on mobile */}
              <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                <select
                  className="border rounded px-3 py-1 text-sm"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="default">Default Sorting</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                </select>

                <select
                  className="border rounded px-3 py-1 text-sm"
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                >
                  <option value="all">All Items</option>
                  <option value="new">New Items</option>
                  <option value="sale">Sale Items</option>
                </select>

                <select
                  className="border rounded px-3 py-1 text-sm"
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                >
                  <option value={30}>30 per page</option>
                  <option value={60}>60 per page</option>
                  <option value={90}>90 per page</option>
                </select>

                <div className="flex space-x-1">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Product Grid/List */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No products found matching your criteria.</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("")
                    setFilterBy("all")
                    setSortBy("default")
                  }}
                >
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid" ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6" : "space-y-4"
                }
              >
                {paginatedProducts.map((product) => (
                  <div
                    key={product.id}
                    className={`group ${viewMode === "list" ? "flex gap-4 p-4 border rounded-lg" : "text-center"}`}
                  >
                    <div
                      className={`relative ${viewMode === "list" ? "w-24 h-24 md:w-32 md:h-32 flex-shrink-0" : "mb-3"}`}
                    >
                      {product.isNew && (
                        <span className="absolute top-1 md:top-2 left-1 md:left-2 bg-[#FFA000] text-white px-1 md:px-2 py-1 text-xs rounded z-10">
                          NEW!
                        </span>
                      )}
                      {product.isSale && (
                        <span className="absolute top-1 md:top-2 left-1 md:left-2 bg-[#FFA000] text-white px-1 md:px-2 py-1 text-xs rounded z-10">
                          SALE!
                        </span>
                      )}
                      <button
                        onClick={() => toggleFavorite(product.id)}
                        className="absolute top-1 md:top-2 right-1 md:right-2 z-10 p-1 rounded-full bg-white/80 hover:bg-white transition-colors"
                      >
                        <Heart
                          className={`w-4 h-4 md:w-5 md:h-5 ${
                            isFavorite(product.id)
                              ? "fill-[#FFA000] text-[#FFA000]"
                              : "text-gray-400 hover:text-[#FFA000]"
                          } transition-colors`}
                        />
                      </button>
                      <div className="bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          width={200}
                          height={200}
                          className={`${
                            viewMode === "list" ? "w-full h-full" : "w-full h-32 md:h-48"
                          } object-cover group-hover:scale-105 transition-transform duration-200`}
                        />
                      </div>
                    </div>

                    <div className={viewMode === "list" ? "flex-1" : ""}>
                      <h3
                        className={`font-medium mb-1 text-gray-800 ${viewMode === "list" ? "text-sm md:text-base" : "text-xs md:text-sm"} line-clamp-2`}
                      >
                        {product.name}
                      </h3>
                      <p className={`text-gray-600 mb-2 ${viewMode === "list" ? "text-sm" : "text-xs"}`}>
                        SKU: {product.sku}
                      </p>
                      {viewMode === "list" && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                      )}
                      {user && (
                        <div
                          className={`flex items-center gap-2 mb-3 ${
                            viewMode === "list" ? "justify-start" : "justify-center"
                          }`}
                        >
                          <span className="text-[#FFA000] font-medium text-sm md:text-base">
                            ৳{(product.price * 85).toFixed(0)}
                          </span>
                          {product.originalPrice && (
                            <span
                              className={`text-gray-500 line-through ${viewMode === "list" ? "text-sm md:text-base" : "text-xs"}`}
                            >
                              ৳{(product.originalPrice * 85).toFixed(0)}
                            </span>
                          )}
                        </div>
                      )}
                      <Button
                        className="bg-[#FFA000] hover:bg-[#E68900] text-white text-xs px-3 py-1 md:px-4 md:py-2 w-full"
                        onClick={() => window.location.href = `/product/${product.id}`}
                      >
                        VIEW DETAILS
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 md:mt-12">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = i + 1
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    )
                  })}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
