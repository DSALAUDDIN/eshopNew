import { getProducts, getCategoryDetails } from "@/lib/data";
import { CategoryView } from "@/components/category-view";
import { notFound } from "next/navigation";

export default async function CategoryPage({ params, searchParams }: { params: { category: string }, searchParams: { [key: string]: string | string[] | undefined } }) {
    const { category: categorySlug } = params;
    const { sort, subcategory } = searchParams;

    const categoryDetails = await getCategoryDetails(categorySlug);

    if (!categoryDetails) {
        notFound();
    }

    const products = await getProducts({
        category: categorySlug,
        subcategory: subcategory as string,
        sort: sort as string,
    });

    return (
        <CategoryView
            initialProducts={products}
            categoryDetails={categoryDetails}
        />
    );
}
