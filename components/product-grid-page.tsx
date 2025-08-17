'use client'

import type { Product } from "@/lib/types"
import { useRouter } from "next/navigation"
import { ProductGrid } from "@/components/product-grid"

interface ProductGridPageProps {
    products: Product[];
}

export function ProductGridPage({ products }: ProductGridPageProps) {
    const router = useRouter()

    const handleViewDetails = (product: Product) => {
        router.push(`/product/${product.id}`)
    }

    return (
        <ProductGrid
            products={products}
            onViewDetails={handleViewDetails}
        />
    )
}
