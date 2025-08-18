import { getProducts } from "@/lib/data";
import { ProductGridPage } from "@/components/product-grid-page";
import { notFound } from "next/navigation";

export default async function SubCategoryPage({ params }: { params: { category: string; subcategory: string } }) {
    const { category, subcategory } = params;
    const products = await getProducts({ category, subcategory });

    if (!products) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 capitalize">
                {subcategory.replace(/-/g, ' ')}
            </h1>
            <ProductGridPage products={products} />
        </div>
    );
}
