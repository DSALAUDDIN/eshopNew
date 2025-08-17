import { getProductById, getRelatedProducts, getProducts } from "@/lib/data";
import { ProductDetails } from "@/components/product-details";
import { notFound } from "next/navigation";

export default async function ProductPage({ params }: { params: { id: string } }) {
    const productId = params.id;
    const product = await getProductById(productId);

    if (!product) {
        notFound();
    }

    const [relatedProducts, bestSellingProducts] = await Promise.all([
        getRelatedProducts(product.categoryId, product.id, 8),
        getProducts({ featured: true, limit: 8 }),
    ]);

    return (
        <ProductDetails
            product={product}
            relatedProducts={relatedProducts}
            bestSellingProducts={bestSellingProducts}
        />
    );
}
