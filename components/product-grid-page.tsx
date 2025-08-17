'use client'

import type { Product } from "@/lib/types"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import { ProductGrid } from "@/components/product-grid"

interface ProductGridPageProps {
    products: Product[];
}

export function ProductGridPage({ products }: ProductGridPageProps) {
    const router = useRouter()
    const { addToCart } = useStore()

    const handleViewDetails = (product: Product) => {
        router.push(`/product/${product.id}`)
    }

    const handleAddToCart = (product: Product) => {
        addToCart(product, 1)
    }

    return (
        <ProductGrid
            products={products}
            onViewDetails={handleViewDetails}
            onAddToCart={handleAddToCart}
        />
    )
}
