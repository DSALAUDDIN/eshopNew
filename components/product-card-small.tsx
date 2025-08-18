'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useStore } from '@/lib/store'
import type { Product } from '@/lib/types'
import { Skeleton } from '@/components/ui/skeleton'

interface ProductCardSmallProps {
  product: Product
}

export default function ProductCardSmall({ product }: ProductCardSmallProps) {
  const { addToCart, toggleFavorite, isFavorite } = useStore()
  const [isHovered, setIsHovered] = useState(false)
  const [isImageLoading, setIsImageLoading] = useState(true)

  const formatPrice = (price: number) => {
    // Get currency from settings or use BDT as default for Bangladesh
    const currency = 'BDT' // This should come from site settings
    const symbol = '৳' // Bangladeshi Taka symbol

    return `${symbol}${price.toLocaleString('en-BD')}`
  }

  const averageRating = product.reviews && product.reviews.length > 0
    ? product.reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / product.reviews.length
    : 0

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product, 1)
  }

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(product.id)
  }

  return (
    <Link href={`/product/${product.id}`}>
      <div
        className="group relative bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          {isImageLoading && (
            <Skeleton className="absolute inset-0 w-full h-full bg-gray-200" />
          )}
          <Image
            src={(() => {
              try {
                if (typeof product.images === 'string') {
                  const parsedImages = JSON.parse(product.images)
                  return parsedImages[0] || product.image || '/placeholder.jpg'
                } else if (Array.isArray(product.images)) {
                  return product.images[0] || '/placeholder.jpg'
                } else {
                  return product.image || '/placeholder.jpg'
                }
              } catch (error) {
                return product.image || '/placeholder.jpg'
              }
            })()}
            alt={product.name}
            fill
            className={`object-cover group-hover:scale-105 transition-all duration-300 ${
              isImageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoadingComplete={() => setIsImageLoading(false)}
          />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isNew && (
              <Badge className="bg-green-100 text-green-800 text-xs">New</Badge>
            )}
            {product.isSale && (
              <Badge variant="destructive" className="text-xs">Sale</Badge>
            )}
            {product.isFeatured && (
              <Badge variant="outline" className="border-blue-200 text-blue-800 text-xs">Featured</Badge>
            )}
          </div>

          {/* Action buttons */}
          <div className={`absolute top-2 right-2 flex flex-col gap-1 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleToggleFavorite}
              className={`p-2 h-8 w-8 ${isFavorite(product.id) ? 'text-red-500' : 'text-gray-600'}`}
            >
              <Heart className="h-4 w-4" fill={isFavorite(product.id) ? 'currentColor' : 'none'} />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="p-2 h-8 w-8"
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>

          {/* Out of stock overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
              <Badge variant="secondary" className="text-white bg-gray-800">
                Out of Stock
              </Badge>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-3">
          <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          {product.reviews && product.reviews.length > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex">
                {renderStars(Math.round(averageRating))}
              </div>
              <span className="text-xs text-gray-500">
                ({product.reviews.length})
              </span>
            </div>
          )}

          {/* Price */}
          {/*<div className="flex items-center gap-2">*/}
          {/*  <span className="font-bold text-gray-900">*/}
          {/*    {formatPrice(product.price)}*/}
          {/*  </span>*/}
          {/*  {product.originalPrice && (*/}
          {/*    <span className="text-sm text-gray-500 line-through">*/}
          {/*      {formatPrice(product.originalPrice)}*/}
          {/*    </span>*/}
          {/*  )}*/}
          {/*</div>*/}
        </div>
      </div>
    </Link>
  )
}
