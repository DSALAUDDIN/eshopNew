'use client'

import { useState, useEffect, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Star, Heart, ShoppingCart, Truck, Shield, RotateCcw, ChevronLeft, Home, Minus, Plus, Share2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import ProductCardSmall from '@/components/product-card-small'
import { ReviewForm } from '@/components/review-form'
import { CustomerReviews } from '@/components/customer-reviews'
import type { Product } from '@/lib/types'

/** ---------- helpers ---------- */
function toSlug(input: unknown): string {
  if (typeof input === 'string') return input
  if (input && typeof input === 'object') {
    const maybe = (input as any).slug ?? (input as any).id ?? (input as any)._id
    if (maybe) return String(maybe)
  }
  return ''
}
function toName(input: unknown): string {
  if (typeof input === 'string') return input
  if (input && typeof input === 'object') {
    const maybe = (input as any).name ?? (input as any).title ?? (input as any).slug
    if (maybe) return String(maybe)
  }
  return 'Category'
}
function safePercent(off: number, base: number) {
  if (!base) return 0
  return Math.round((off / base) * 100)
}

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params.id as string

  const { addToCart, toggleFavorite, isFavorite, fetchProductById, fetchRelatedProducts, fetchBestSellingProducts } = useStore()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [bestSellingProducts, setBestSellingProducts] = useState<Product[]>([])
  const [loadingRelated, setLoadingRelated] = useState(false)

  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) return
      setLoading(true)
      const productData = await fetchProductById(productId)
      setProduct(productData)
      setLoading(false)

      if (productData) {
        setLoadingRelated(true)
        const categorySlug = toSlug(productData.category)
        const [related, bestSelling] = await Promise.all([
          fetchRelatedProducts(categorySlug, productData.id, 8),
          fetchBestSellingProducts(8),
        ])
        setRelatedProducts(related)
        setBestSellingProducts(bestSelling)
        setLoadingRelated(false)
      }
    }
    loadProduct()
  }, [productId, fetchProductById, fetchRelatedProducts, fetchBestSellingProducts])

  /** ---------------- derive values with hooks BEFORE any early return ---------------- */
  const images = useMemo<string[]>(() => {
    try {
      if (!product) return ['/placeholder.jpg']
      const imgs = (product as any).images
      if (Array.isArray(imgs)) return imgs as string[]
      if (typeof imgs === 'string') {
        try {
          const parsed = JSON.parse(imgs)
          if (Array.isArray(parsed)) return parsed
        } catch {
          const csvSplit = imgs.split(',').map(s => s.trim()).filter(Boolean)
          if (csvSplit.length) return csvSplit
        }
      }
      return [product.image || '/placeholder.jpg']
    } catch {
      return [product?.image || '/placeholder.jpg']
    }
  }, [product])

  const averageRating = useMemo(() => {
    if (!product?.reviews?.length) return 0
    const sum = product.reviews.reduce((acc: number, r: any) => acc + (r?.rating ?? 0), 0)
    return sum / product.reviews.length
  }, [product])

  const categorySlug = useMemo(() => toSlug(product?.category), [product])
  const categoryName = useMemo(() => toName(product?.category), [product])

  /** ---------------- event handlers ---------------- */
  const handleAddToCart = () => {
    if (product) addToCart(product, quantity)
  }
  const handleToggleFavorite = () => {
    if (product) toggleFavorite(product.id)
  }
  const handleShare = async () => {
    if (!product) return alert('Product data not loaded yet. Please try again.')
    const isDevelopment = typeof window !== 'undefined' && window.location.hostname === 'localhost'
    const currentUrl = isDevelopment
        ? `https://your-deployed-app.vercel.app/product/${productId}`
        : window.location.href
    const shareData = { title: product.name, text: `Check out this ${product.name} at My Amazin Store`, url: currentUrl }
    try {
      if (navigator.share && (!navigator.canShare || navigator.canShare(shareData))) {
        await navigator.share(shareData)
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(currentUrl)
        alert('Product link copied to clipboard!')
      } else {
        const textArea = document.createElement('textarea')
        textArea.value = currentUrl
        textArea.style.position = 'fixed'
        textArea.style.opacity = '0'
        document.body.appendChild(textArea)
        textArea.select()
        const ok = document.execCommand('copy')
        document.body.removeChild(textArea)
        ok ? alert('Product link copied to clipboard!') : prompt('Copy this link:', currentUrl)
      }
    } catch {
      try {
        await navigator.clipboard?.writeText(currentUrl)
        alert('Product link copied to clipboard!')
      } catch {
        prompt('Please copy this link manually:', currentUrl)
      }
    }
  }
  const formatPrice = (price: number) =>
      new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)
  const renderStars = (rating: number) =>
      Array.from({ length: 5 }, (_, i) => (
          <Star key={i} className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
      ))

  /** ---------------- now early returns are safe ---------------- */
  if (loading) {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    )
  }

  if (!product) {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <p className="text-gray-600">The product you're looking for doesn't exist.</p>
            <Button onClick={() => router.back()} className="mt-4">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
    )
  }

  return (
      <div className="min-h-screen bg-white">
        {/* Breadcrumb */}
        <div className="border-b bg-gray-50">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex items-center space-x-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-gray-900 flex items-center">
                <Home className="h-4 w-4" />
              </Link>
              <span>/</span>
              {categorySlug ? (
                  <Link
                      href={`/category/${encodeURIComponent(categorySlug)}`}
                      className="hover:text-gray-900 capitalize"
                  >
                    {categoryName}
                  </Link>
              ) : (
                  <span className="capitalize">{categoryName}</span>
              )}
              <span>/</span>
              <span className="text-gray-900 font-medium">{product.name}</span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square rounded-xl overflow-hidden bg-gray-50 border">
                <Image
                    src={images[selectedImageIndex] || '/placeholder.jpg'}
                    alt={product.name}
                    width={600}
                    height={600}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    priority
                />
              </div>

              {images.length > 1 && (
                  <div className="grid grid-cols-4 gap-3">
                    {images.map((image: string, index: number) => (
                        <button
                            key={`${image}-${index}`}
                            onClick={() => setSelectedImageIndex(index)}
                            className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                                selectedImageIndex === index
                                    ? 'border-blue-500 ring-2 ring-blue-100'
                                    : 'border-gray-200 hover:border-gray-300'
                            }`}
                            aria-label={`Select image ${index + 1}`}
                            type="button"
                        >
                          <Image
                              src={image || '/placeholder.jpg'}
                              alt={`${product.name} ${index + 1}`}
                              width={150}
                              height={150}
                              className="w-full h-full object-cover"
                          />
                        </button>
                    ))}
                  </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-8">
              {/* Header */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                    <div className="flex items-center gap-3 mb-3">
                      {product.isNew && <Badge className="bg-green-100 text-green-800 hover:bg-green-100">New</Badge>}
                      {product.isSale && <Badge variant="destructive">Sale</Badge>}
                      {product.isFeatured && <Badge variant="outline" className="border-blue-200 text-blue-800">Featured</Badge>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleToggleFavorite}
                        className={`p-2 ${isFavorite(product.id) ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-gray-600'}`}
                        aria-label="Toggle favorite"
                    >
                      <Heart className="h-5 w-5" fill={isFavorite(product.id) ? 'currentColor' : 'none'} />
                    </Button>
                    <Button variant="ghost" size="sm" className="p-2" onClick={handleShare} aria-label="Share product">
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                {/* Rating and SKU */}
                <div className="flex items-center gap-6 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="flex">{renderStars(Math.round(averageRating))}</div>
                    <span className="text-sm text-gray-600">
                    {averageRating.toFixed(1)} ({product.reviews?.length || 0} reviews)
                  </span>
                  </div>
                  <Separator orientation="vertical" className="h-4" />
                  {product.sku && <span className="text-sm text-gray-500">SKU: {product.sku}</span>}
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4 pb-6 border-b">
                <span className="text-4xl font-bold text-gray-900">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                    <>
                      <span className="text-xl text-gray-500 line-through">{formatPrice(product.originalPrice)}</span>
                      <Badge variant="destructive" className="text-sm">
                        Save {safePercent(product.originalPrice - product.price, product.originalPrice)}%
                      </Badge>
                    </>
                )}
              </div>

              {/* Add to Cart Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border rounded-lg">
                    <button
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        className="p-3 text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                        aria-label="Decrease quantity"
                        type="button"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-4 py-3 font-medium min-w-[60px] text-center">{quantity}</span>
                    <button
                        onClick={() => setQuantity(q => q + 1)}
                        className="p-3 text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                        aria-label="Increase quantity"
                        type="button"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <Button
                      onClick={handleAddToCart}
                      disabled={!product.inStock}
                      className="flex-1 h-12 text-lg"
                      size="lg"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                </div>

                {product.stockQuantity && product.stockQuantity <= 10 && (
                    <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 p-3 rounded-lg">
                      <span className="font-medium">⚠️ Only {product.stockQuantity} left in stock!</span>
                    </div>
                )}
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t">
                <div className="flex items-center gap-3 text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
                  <Truck className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium">Free Shipping</div>
                    <div className="text-xs">On orders over $50</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
                  <Shield className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="font-medium">Secure Payment</div>
                    <div className="text-xs">SSL encrypted</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
                  <RotateCcw className="h-5 w-5 text-purple-600" />
                  <div>
                    <div className="font-medium">Easy Returns</div>
                    <div className="text-xs">30-day policy</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="mt-16">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="details">Specifications</TabsTrigger>
                <TabsTrigger value="reviews">Reviews ({product.reviews?.length || 0})</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-8">
                <Card>
                  <CardContent className="p-8">
                    <p className="text-gray-700 leading-relaxed text-lg">{product.description}</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="details" className="mt-8">
                <Card>
                  <CardContent className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {product.materials && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Materials</h4>
                            <p className="text-gray-700">{product.materials}</p>
                          </div>
                      )}
                      {product.dimensions && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Dimensions</h4>
                            <p className="text-gray-700">{product.dimensions}</p>
                          </div>
                      )}
                      {product.weight && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Weight</h4>
                            <p className="text-gray-700">{product.weight}kg</p>
                          </div>
                      )}
                      {product.sku && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">SKU</h4>
                            <p className="text-gray-700">{product.sku}</p>
                          </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-8">
                <div className="space-y-8">
                  <CustomerReviews productId={productId} limit={6} />
                  <div className="border-t pt-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Write a Review</h3>
                    <ReviewForm
                        productId={productId}
                        productName={product.name}
                        onSuccess={() => window.location.reload()}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Related and Best Selling Products */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
            {loadingRelated ? (
                <div className="animate-pulse grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="h-64 bg-gray-100 rounded-lg" />
                  <div className="h-64 bg-gray-100 rounded-lg" />
                  <div className="h-64 bg-gray-100 rounded-lg" />
                  <div className="h-64 bg-gray-100 rounded-lg" />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {relatedProducts.length > 0 ? (
                      relatedProducts.map((rp) => <ProductCardSmall key={rp.id} product={rp} />)
                  ) : (
                      <p className="col-span-full text-center text-gray-500">No related products found.</p>
                  )}
                </div>
            )}

            <h2 className="text-2xl font-bold text-gray-900 mb-8 mt-12">Best Selling Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {bestSellingProducts.length > 0 ? (
                  bestSellingProducts.map((bp) => <ProductCardSmall key={bp.id} product={bp} />)
              ) : (
                  <p className="col-span-full text-center text-gray-500">No best selling products found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
  )
}
