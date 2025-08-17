'use client'

import type React from "react"
import type { Product } from "@/lib/types"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import { ProductGrid } from "@/components/product-grid"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface ProductSectionsProps {
    featuredProducts: Product[];
    saleProducts: Product[];
    newProducts: Product[];
}

export function ProductSections({ featuredProducts, saleProducts, newProducts }: ProductSectionsProps) {
    const router = useRouter()
    const { addToCart } = useStore()

    const handleViewDetails = (product: Product) => {
        router.push(`/product/${product.slug}`)
    }

    const handleAddToCart = (product: Product, event?: React.MouseEvent<HTMLButtonElement>) => {
        addToCart(product, 1)

        if (event?.currentTarget) {
            const button = event.currentTarget
            const originalText = button.textContent
            button.textContent = "Added!"
            button.style.backgroundColor = "#10b981"

            setTimeout(() => {
                button.textContent = originalText
                button.style.backgroundColor = ""
            }, 1500)
        }
    }

    return (
        <>
            {/* Featured Products Section */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Discover our handpicked selection of trending items and customer favorites
                        </p>
                    </div>

                    {featuredProducts.length > 0 ? (
                        <ProductGrid
                            products={featuredProducts}
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
                            products={saleProducts}
                            onViewDetails={handleViewDetails}
                            onAddToCart={handleAddToCart}
                        />

                        <div className="text-center mt-8">
                            <Button asChild variant="outline">
                                <Link href="/category/all?sale=true">View All Sale Items</Link>
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
                            products={newProducts}
                            onViewDetails={handleViewDetails}
                            onAddToCart={handleAddToCart}
                        />

                        <div className="text-center mt-8">
                            <Button asChild variant="outline">
                                <Link href="/category/all?new=true">View All New Items</Link>
                            </Button>
                        </div>
                    </div>
                </section>
            )}
        </>
    )
}
