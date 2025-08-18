'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Star, Heart, Share2, Home } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import ProductCardSmall from '@/components/product-card-small'
import { ReviewForm } from '@/components/review-form'
import { CustomerReviews } from '@/components/customer-reviews'
import type { Product, Review } from '@/lib/types'

interface ProductDetailsProps {
    product: Product;
    relatedProducts: Product[];
    bestSellingProducts: Product[];
}

function isCategoryObject(category: any): category is { slug: string; name: string } {
    return (
        typeof category === 'object' &&
        category !== null &&
        typeof category.slug === 'string' &&
        typeof category.name === 'string'
    );
}

export function ProductDetails({ product, relatedProducts, bestSellingProducts }: ProductDetailsProps) {
    const router = useRouter();
    const { toggleFavorite, isFavorite } = useStore();
    const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

    // normalize images
    const images = useMemo<string[]>(() => {
        try {
            if (!product) return ['/placeholder.jpg'];
            let imgs = (product as any).images;
            if (Array.isArray(imgs)) return imgs.map(String);
            if (typeof imgs === 'string') {
                try {
                    const parsed = JSON.parse(imgs);
                    if (Array.isArray(parsed)) return parsed.map(String);
                } catch {
                    const csvSplit = imgs.split(',').map((s: string) => s.trim()).filter(Boolean);
                    if (csvSplit.length) return csvSplit;
                }
            }
            return [product.image || '/placeholder.jpg'];
        } catch {
            return [product?.image || '/placeholder.jpg'];
        }
    }, [product]);

    // average rating
    const averageRating = useMemo<number>(() => {
        if (!Array.isArray(product?.reviews) || product.reviews.length === 0) return 0;
        const sum = product.reviews.reduce((acc: number, r: Review) => acc + (r?.rating ?? 0), 0);
        return sum / product.reviews.length;
    }, [product]);

    const handleToggleFavorite = () => {
        if (product) toggleFavorite(product.id);
    };

    const handleShare = async () => {
        if (!product) {
            alert('Product data not loaded yet. Please try again.');
            return;
        }
        const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
        const shareData = { title: product.name, text: `Check out this ${product.name}`, url: currentUrl };
        try {
            if (
                typeof navigator !== 'undefined' &&
                'share' in navigator &&
                typeof (navigator as any).canShare === 'function' &&
                (navigator as any).canShare(shareData)
            ) {
                await (navigator as any).share(shareData);
            } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
                await navigator.clipboard.writeText(currentUrl);
                alert('Product link copied to clipboard!');
            } else {
                alert('Sharing not supported. Please copy the link manually.');
            }
        } catch (err) {
            console.error('Share failed:', err);
            alert('Failed to share. Please copy the link manually.');
        }
    };

    // Render stars
    const renderStars = (rating: number) =>
        Array.from({ length: 5 }, (_, i) => (
            <Star key={i} className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
        ));

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
                        {isCategoryObject(product.category) ? (
                            <Link
                                href={`/category/${product.category.slug}`}
                                className="hover:text-gray-900 capitalize"
                            >
                                {product.category.name}
                            </Link>
                        ) : (
                            <span className="capitalize">Category</span>
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
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                                    <div className="flex items-center gap-3 mb-3">
                                        {product.isNew && (
                                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">New</Badge>
                                        )}
                                        {product.isSale && (
                                            <Badge variant="destructive">Sale</Badge>
                                        )}
                                        {product.isFeatured && (
                                            <Badge variant="outline" className="border-blue-200 text-blue-800">Featured</Badge>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleToggleFavorite}
                                        className={`p-2 ${isFavorite(product.id) ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-gray-600'}`}
                                        aria-label="Toggle favorite"
                                        type="button"
                                    >
                                        <Heart className="h-5 w-5" fill={isFavorite(product.id) ? 'currentColor' : 'none'} />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="p-2"
                                        onClick={handleShare}
                                        aria-label="Share product"
                                        type="button"
                                    >
                                        <Share2 className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>

                            {/* Rating and SKU */}
                            <div className="flex items-center gap-6 mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="flex">{renderStars(Math.round(averageRating))}</div>
                                    <span className="text-sm text-gray-600">
                    {averageRating.toFixed(1)} ({product.reviews?.length || 0} reviews)
                  </span>
                                </div>
                                <Separator orientation="vertical" className="h-4" />
                                {product.sku && (
                                    <span className="text-sm text-gray-500">SKU: {product.sku}</span>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <h3 className="font-bold text-gray-800 mb-2">Description</h3>
                                <p className="text-gray-600 leading-relaxed">{product.description}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="mt-16 pt-12 border-t">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2">
                            <h2 className="text-2xl font-bold text-gray-900 mb-8">
                                Customer Reviews ({product.reviews?.length || 0})
                            </h2>
                            <CustomerReviews reviews={product.reviews as Review[] || []} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Write a Review</h3>
                            <ReviewForm
                                productId={typeof product.id === 'string' ? product.id : String(product.id)}
                                productName={product.name}
                                onSuccess={() => router.refresh()}
                            />
                        </div>
                    </div>
                </div>

                {/* Related and Best Selling Products */}
                <div className="mt-16">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {relatedProducts.length > 0 ? (
                            relatedProducts.map((rp) => <ProductCardSmall key={rp.id} product={rp} />)
                        ) : (
                            <p className="col-span-full text-center text-gray-500">No related products found.</p>
                        )}
                    </div>

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