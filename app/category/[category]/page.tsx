// page.tsx
import { getProducts, getCategoryDetails } from "@/lib/data";
import { CategoryView } from "@/components/category-view";
import { notFound } from "next/navigation";

const norm = (s?: string) =>
    (s ?? "").toString().trim().toLowerCase();

export default async function CategoryPage({
                                               params,
                                               searchParams,
                                           }: {
    params: { category: string };
    searchParams: { [k: string]: string | string[] | undefined };
}) {
    const categorySlug = norm(params.category);
    const sort = (searchParams.sort as string) || undefined;
    const subcategory = (searchParams.subcategory as string) || undefined;

    const categoryDetails = await getCategoryDetails(categorySlug);

    if (!categoryDetails) {
        // debug: deploy এ একবার লগ দেখে নিন
        console.error("Category not found (prod):", { categorySlug });
        notFound();
    }

    const products = await getProducts({
        category: categorySlug,
        subcategory,
        sort,
    });

    return (
        <CategoryView initialProducts={products} categoryDetails={categoryDetails} />
    );
}
