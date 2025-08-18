import { getProductById, getRelatedProducts, getProducts, getReviews } from "@/lib/data";
import { ProductDetails } from "@/components/product-details";
import { notFound } from "next/navigation";

export default async function ProductPage({ params }: { params: { id: string } }) {
    const productId = params.id;
    const product = await getProductById(productId);

    if (!product) {
        notFound();
    }

    const [relatedProductsRaw, bestSellingProductsRaw, reviews] = await Promise.all([
        getRelatedProducts(product.categoryId, product.id, 8),
        getProducts({ featured: true, limit: 8 }),
        getReviews({ productId }),
    ]);

    // Map to ensure required fields for Product type
    const mapProduct = (p: any): any => ({
        ...p,
        image: p.image || (Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : "/placeholder.jpg"),
        category: p.category || (p.categoryId || ""),
        subcategory: p.subcategory || (p.subcategoryId || ""),
    });

    // Map reviews to ensure title is string | undefined
    const mappedReviews = reviews.map((r: any) => ({
        ...r,
        title: r.title === null ? undefined : r.title,
    }));

    // Attach reviews to product
    const productWithReviews = { ...mapProduct(product), reviews: mappedReviews };

    const relatedProducts = relatedProductsRaw.map(mapProduct);
    const bestSellingProducts = bestSellingProductsRaw.map(mapProduct);

    return (
        <ProductDetails
            product={productWithReviews}
            relatedProducts={relatedProducts}
            bestSellingProducts={bestSellingProducts}
        />
    );
}
