"use client"

import Image from "next/image"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"
import type { Product } from "@/lib/types"

interface ProductGridProps {
  products: Product[]
  title?: string // Make title optional
  onViewDetails: (product: Product) => void
  onAddToCart: (product: Product, event?: React.MouseEvent<HTMLButtonElement>) => void
}

export function ProductGrid({ products, title, onViewDetails, onAddToCart }: ProductGridProps) {
  const { toggleFavorite, isFavorite } = useStore()

  // Helper function to get the first product image
  const getProductImage = (product: Product) => {
    try {
      if (typeof product.images === 'string') {
        const parsedImages = JSON.parse(product.images)
        return parsedImages[0] || product.image || '/placeholder.svg'
      } else if (Array.isArray(product.images) && product.images.length > 0) {
        return product.images[0] || '/placeholder.svg'
      } else {
        return product.image || '/placeholder.svg'
      }
    } catch (error) {
      return product.image || '/placeholder.svg'
    }
  }

  return (
    <section id="products" className="container mx-auto px-4 py-8 md:py-12">
      {title && (
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 text-[hsl(var(--primary))] font-brandon">
          {title}
        </h2>
      )}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
        {products.map((product) => (
          <div
            key={product.id}
            className="text-center group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 border border-gray-100"
          >
            <div className="relative mb-3 md:mb-4">
              {product.isNew && (
                <span className="absolute top-1 md:top-2 left-1 md:left-2 bg-[hsl(var(--primary))] text-white px-1 md:px-2 py-1 text-xs rounded-full z-10 font-semibold shadow-md font-brandon">
                  NEW!
                </span>
              )}
              {product.isSale && (
                <span className="absolute top-1 md:top-2 left-1 md:left-2 bg-gradient-to-r from-red-600 to-red-500 text-white px-1 md:px-2 py-1 text-xs rounded-full z-10 font-semibold shadow-md font-brandon">
                  SALE!
                </span>
              )}
              <button
                onClick={() => toggleFavorite(product.id)}
                className="absolute top-1 md:top-2 right-1 md:right-2 z-10 p-1 md:p-2 rounded-full bg-white hover:bg-gray-50 transition-colors shadow-md"
              >
                <Heart
                  className={`w-4 h-4 md:w-5 md:h-5 ${
                    isFavorite(product.id) ? "fill-[hsl(var(--primary))] text-[hsl(var(--primary))]" : "text-gray-400 hover:text-[hsl(var(--primary))]"
                  } transition-colors`}
                />
              </button>
              <div
                className="bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl overflow-hidden cursor-pointer"
                onClick={() => onViewDetails(product)}
              >
                <Image
                  src={getProductImage(product)}
                  alt={product.name}
                  width={300}
                  height={300}
                  className="w-full h-40 md:h-64 object-cover group-hover:scale-105 transition-transform duration-300 border-0"
                />
              </div>
            </div>
            <h3 className="text-xs md:text-sm font-semibold mb-1 md:mb-2 text-gray-800 line-clamp-2 font-brandon">
              {product.name}
            </h3>
            <div className="flex items-center justify-center gap-1 md:gap-2 mb-2 md:mb-4">
              <span className="text-xs md:text-sm text-[hsl(var(--primary))] font-bold font-brandon">
                ৳{product.price.toLocaleString('en-BD')}
              </span>
              {product.originalPrice && (
                <span className="text-xs md:text-sm text-gray-500 line-through font-brandon">
                  ৳{product.originalPrice.toLocaleString('en-BD')}
                </span>
              )}
            </div>
            <div className="space-y-2">
              <Button
                className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))] text-white text-xs md:text-sm px-3 md:px-6 py-1 md:py-2 w-full font-semibold shadow-md hover:shadow-lg transition-all duration-200 border-0 font-brandon"
                onClick={() => onViewDetails(product)}
              >
                VIEW DETAILS
              </Button>
              {/*<Button*/}
              {/*  className="bg-gray-800 hover:bg-gray-900 text-white text-xs md:text-sm px-3 md:px-6 py-1 md:py-2 w-full font-semibold shadow-md hover:shadow-lg transition-all duration-200 border-0 font-brandon"*/}
              {/*  onClick={(e) => onAddToCart(product, e)}*/}
              {/*>*/}
              {/*  ADD TO CART*/}
              {/*</Button>*/}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
