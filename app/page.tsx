import { HeroSection } from "@/components/hero-section"
import { Collections } from "@/components/collections"
import { CustomerReviews } from "@/components/customer-reviews"
import { getProducts } from "@/lib/data"
import { ProductSections } from "@/components/product-sections"

export default async function HomePage() {
    const featuredProducts = await getProducts({ featured: true, limit: 8 });
    const saleProducts = await getProducts({ sale: true, limit: 4 });
    const newProducts = await getProducts({ new: true, limit: 4 });

    return (
        <main className="min-h-screen">
            <HeroSection />
            <ProductSections
                featuredProducts={featuredProducts}
                saleProducts={saleProducts}
                newProducts={newProducts}
            />
            <Collections />
            <CustomerReviews />
        </main>
    )
}
