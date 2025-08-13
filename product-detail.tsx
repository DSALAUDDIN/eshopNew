"use client"

import type React from "react"
import { Heart, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Product } from "@/lib/types"
import { useStore } from "@/lib/store"
import Image from "next/image"
import { useState } from "react"

interface ProductDetailProps {
  product: Product
  onLoginRequired?: () => void
}

export function ProductDetail({ product, onLoginRequired }: ProductDetailProps) {
  const [activeTab, setActiveTab] = useState<"details" | "materials">("details")
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const { user, toggleFavorite, isFavorite, addToCart, products } = useStore()

  // Mock additional product images using different angles/views
  const productImages = [
    product.image,
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
  ]

  // Get related products from same category - with null safety
  const relatedProducts = products ? products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 5) : []

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length)
  }

  const handleAddToCart = (event?: React.MouseEvent<HTMLButtonElement>) => {
    if (user && product) {
      addToCart(product, 1)

      // Improved button feedback
      if (event?.currentTarget) {
        const button = event.currentTarget
        const originalText = button.textContent
        button.textContent = "Added!"
        button.style.backgroundColor = "#10b981" // green color
        button.disabled = true

        setTimeout(() => {
          button.textContent = originalText
          button.style.backgroundColor = "" // reset to original
          button.disabled = false
        }, 1500)
      }
    }
  }

  const handleLoginForPrices = () => {
    if (onLoginRequired) {
      onLoginRequired()
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-2 md:py-3 px-4 md:px-6 mb-6 md:mb-8">
        <div className="text-xs md:text-sm text-gray-600">
          <a href="/" className="hover:text-[hsl(var(--primary))] transition-colors">
            Home
          </a>{" "}
          &gt;{" "}
          <a href={`/category/${product.category}`} className="hover:text-[hsl(var(--primary))] transition-colors">
            {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
          </a>{" "}
          &gt;{" "}
          <a
            href={`/category/${product.category}/${product.subcategory}`}
            className="hover:text-[hsl(var(--primary))] transition-colors"
          >
            {product.subcategory.charAt(0).toUpperCase() + product.subcategory.slice(1)}
          </a>{" "}
          &gt; <span className="text-gray-800">{product.name}</span>
        </div>
      </div>

      {/* Product Content */}
      <div className="p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12">
          {/* Product Images */}
          <div>
            <div className="relative mb-4 md:mb-6">
              <button
                onClick={() => toggleFavorite(product.id)}
                className="absolute top-2 md:top-4 right-2 md:right-4 z-10 p-2 md:p-3 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
              >
                <Heart
                  className={`w-5 h-5 md:w-6 md:h-6 ${isFavorite(product.id) ? "fill-[hsl(var(--primary))] text-[hsl(var(--primary))]" : "text-gray-400"}`}
                />
              </button>

              <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={productImages[currentImageIndex] || "/placeholder.svg"}
                  alt={product.name}
                  width={600}
                  height={600}
                  className="w-full h-64 md:h-96 object-cover"
                />

                <button
                  onClick={prevImage}
                  className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-2 md:p-3 rounded-full shadow-lg transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                </button>

                <button
                  onClick={nextImage}
                  className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-2 md:p-3 rounded-full shadow-lg transition-colors"
                >
                  <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                </button>

                <div className="absolute bottom-2 md:bottom-4 right-2 md:right-4 bg-black/70 text-white px-2 md:px-3 py-1 md:py-2 rounded text-xs md:text-sm">
                  Hover to zoom
                </div>
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className="flex space-x-2 md:space-x-3">
              {productImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-16 h-16 md:w-20 md:h-20 border-2 rounded-lg overflow-hidden transition-colors ${
                    currentImageIndex === index ? "border-blue-600" : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Image
                    src={img || "/placeholder.svg"}
                    alt={`${product.name} ${index + 1}`}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div>
            <h1 className="text-2xl md:text-4xl font-light text-gray-800 mb-4 md:mb-6">{product.name}</h1>

            {!user ? (
              <Button
                className="bg-[hsl(var(--primary))] hover:bg-[#E68900] text-white w-full py-3 md:py-4 text-base md:text-lg font-medium mb-6 md:mb-8"
                onClick={handleLoginForPrices}
              >
                LOGIN FOR PRICES
              </Button>
            ) : (
              <div className="mb-6 md:mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-2xl md:text-3xl font-bold text-[hsl(var(--primary))]">
                    ৳{(product.price * 85).toFixed(0)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg md:text-xl text-gray-500 line-through">
                      ৳{(product.originalPrice * 85).toFixed(0)}
                    </span>
                  )}
                </div>
                <Button
                  className="bg-[hsl(var(--primary))] hover:bg-[#E68900] text-white px-6 md:px-8 py-2 md:py-3 text-base md:text-lg w-full md:w-auto"
                  onClick={handleAddToCart}
                >
                  ADD TO CART
                </Button>
              </div>
            )}

            {/* Product Info */}
            <div className="space-y-3 md:space-y-4 mb-6 md:mb-8 bg-gray-50 p-4 md:p-6 rounded-lg">
              <div className="flex">
                <span className="font-medium w-28 md:w-36 text-gray-700 text-sm md:text-base">Product Code:</span>
                <span className="text-[hsl(var(--primary))] font-medium text-sm md:text-base">{product.sku}</span>
              </div>
              <div className="flex">
                <span className="font-medium w-28 md:w-36 text-gray-700 text-sm md:text-base">Barcode:</span>
                <span className="text-sm md:text-base">5055992799949</span>
              </div>
              <div className="flex">
                <span className="font-medium w-28 md:w-36 text-gray-700 text-sm md:text-base">In stock:</span>
                <span className="text-green-600 font-medium text-sm md:text-base">418</span>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b mb-4 md:mb-6">
              <div className="flex space-x-4 md:space-x-8">
                <button
                  onClick={() => setActiveTab("details")}
                  className={`pb-2 md:pb-3 px-1 md:px-2 border-b-2 transition-colors font-medium text-sm md:text-base ${
                    activeTab === "details"
                      ? "border-[hsl(var(--primary))] text-[hsl(var(--primary))]"
                      : "border-transparent text-gray-600 hover:text-gray-800"
                  }`}
                >
                  PRODUCT DETAILS
                </button>
                <button
                  onClick={() => setActiveTab("materials")}
                  className={`pb-2 md:pb-3 px-1 md:px-2 border-b-2 transition-colors font-medium text-sm md:text-base ${
                    activeTab === "materials"
                      ? "border-[hsl(var(--primary))] text-[hsl(var(--primary))]"
                      : "border-transparent text-gray-600 hover:text-gray-800"
                  }`}
                >
                  MATERIALS & CARE
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="mb-6 md:mb-8">
              {activeTab === "details" ? (
                <div className="space-y-4 md:space-y-6">
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base">{product.description}</p>

                  <div className="bg-gray-50 p-4 md:p-6 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 md:gap-6 text-sm">
                      <div>
                        <span className="font-medium text-gray-800 block mb-2">DIMENSIONS</span>
                        <div className="text-gray-600">W 10.00 x L 18.00 x H 13.00 cm</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-800 block mb-2">WEIGHT</span>
                        <div className="text-gray-600">645g</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 md:space-y-6">
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                    Made from high-quality materials with attention to detail. Follow care instructions to maintain
                    product quality and longevity.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-start">
                      <span className="text-[hsl(var(--primary))] mr-2">•</span>
                      High-quality construction materials
                    </li>
                    <li className="flex items-start">
                      <span className="text-[hsl(var(--primary))] mr-2">•</span>
                      Safe for intended use
                    </li>
                    <li className="flex items-start">
                      <span className="text-[hsl(var(--primary))] mr-2">•</span>
                      Easy to clean and maintain
                    </li>
                    <li className="flex items-start">
                      <span className="text-[hsl(var(--primary))] mr-2">•</span>
                      Follow care instructions for longevity
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* More About Me */}
            <div>
              <h3 className="font-medium mb-4 text-gray-800 text-base md:text-lg">More about me</h3>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-base md:text-lg">♻️</span>
                </div>
                <div>
                  <span className="text-gray-800 font-medium text-sm md:text-base">Sustainable materials</span>
                  <p className="text-xs md:text-sm text-gray-600">Made with eco-friendly processes</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-12 md:mt-16">
          <h2 className="text-xl md:text-2xl font-light mb-6 md:mb-8 text-gray-800">
            Bestsellers in this category
          </h2>
          <div className="flex space-x-4 md:space-x-6 overflow-x-auto pb-4">
            {relatedProducts.map((relatedProduct) => (
              <div key={relatedProduct.id} className="flex-shrink-0 w-48 md:w-56 text-center group">
                <div className="relative mb-3 md:mb-4">
                  {relatedProduct.isNew && (
                    <span className="absolute top-1 md:top-2 left-1 md:left-2 bg-blue-600 text-white px-1 md:px-2 py-1 text-xs rounded z-10">
                      NEW!
                    </span>
                  )}
                  <button
                    onClick={() => toggleFavorite(relatedProduct.id)}
                    className="absolute top-1 md:top-2 right-1 md:right-2 z-10 p-1 rounded-full bg-white hover:bg-gray-50 transition-colors shadow-md"
                  >
                    <Heart
                      className={`w-4 h-4 md:w-5 md:h-5 ${isFavorite(relatedProduct.id) ? "fill-[hsl(var(--primary))] text-[hsl(var(--primary))]" : "text-gray-400"}`}
                    />
                  </button>
                  <div className="bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={relatedProduct.image || "/placeholder.svg"}
                      alt={relatedProduct.name}
                      width={220}
                      height={220}
                      className="w-full h-36 md:h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                </div>
                <h3 className="text-xs md:text-sm font-medium mb-2 text-gray-800 line-clamp-2">
                  {relatedProduct.name}
                </h3>
                {user && (
                  <p className="text-xs md:text-sm text-gray-600 mb-3">৳{(relatedProduct.price * 85).toFixed(0)}</p>
                )}
                <Button
                  className="bg-[hsl(var(--primary))] hover:bg-[#E68900] text-white text-xs px-3 md:px-4 py-1 md:py-2 w-full"
                  onClick={() => {
                    window.location.href = `/product/${relatedProduct.id}`
                  }}
                >
                  VIEW DETAILS
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
