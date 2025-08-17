import { HeroSection } from "@/components/hero-section"
import { Collections } from "@/components/collections"
import { CustomerReviews } from "@/components/customer-reviews"
import { getProducts, getReviews } from "@/lib/data"
import { ProductSections } from "@/components/product-sections"

export default async function HomePage() {
    const [featuredProducts, saleProducts, newProducts, reviews] = await Promise.all([
        getProducts({ featured: true, limit: 8 }),
        getProducts({ sale: true, limit: 4 }),
        getProducts({ new: true, limit: 4 }),
        getReviews({ limit: 4 }),
    ]);

    return (
        <main className="min-h-screen">
            <HeroSection />
            <ProductSections
                featuredProducts={featuredProducts}
                saleProducts={saleProducts}
                newProducts={newProducts}
            />
            <Collections />
            <CustomerReviews reviews={reviews} />
        </main>
    )
}
