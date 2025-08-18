import { db } from '@/lib/prisma';
import { products, categories, subcategories, reviews } from '@/lib/db/schema';
import { eq, and, desc, asc, not, sql } from 'drizzle-orm';

// A helper for robust JSON parsing
function parseJson(jsonString: string | null, defaultValue: any[] = []) {
    if (!jsonString) return defaultValue;
    try {
        return JSON.parse(jsonString);
    } catch (error) {
        console.error('Failed to parse JSON string:', jsonString, error);
        return defaultValue;
    }
}

export async function getProducts(options: {
    featured?: boolean;
    limit?: number;
    category?: string;
    subcategory?: string;
    sale?: boolean;
    new?: boolean;
    sort?: string;
} = {}) {
    console.log('[getProducts] Fetching products with options:', options);
    try {
        const conditions = [];
        let categoryData;

        // --- Category and Subcategory Filtering ---
        if (options.category && options.category !== 'all') {
            categoryData = await db.query.categories.findFirst({
                where: eq(sql`lower(${categories.slug})`, options.category.toLowerCase())
            });

            if (!categoryData) {
                console.log(`[getProducts] Category slug "${options.category}" not found. Returning empty array.`);
                return [];
            }
            console.log(`[getProducts] Found category:`, categoryData);
            conditions.push(eq(products.categoryId, categoryData.id));

            if (options.subcategory) {
                const subcategoryData = await db.query.subcategories.findFirst({
                    where: and(
                        eq(sql`lower(${subcategories.slug})`, options.subcategory.toLowerCase()),
                        eq(subcategories.categoryId, categoryData.id)
                    )
                });

                if (!subcategoryData) {
                    console.log(`[getProducts] Subcategory slug "${options.subcategory}" not found for category "${options.category}". Returning empty array.`);
                    return [];
                }
                console.log(`[getProducts] Found subcategory:`, subcategoryData);
                conditions.push(eq(products.subcategoryId, subcategoryData.id));
            }
        } else if (options.subcategory) {
            // Handle case where only subcategory is provided
            const subcategoryData = await db.query.subcategories.findFirst({
                where: eq(sql`lower(${subcategories.slug})`, options.subcategory.toLowerCase())
            });
            if (subcategoryData) {
                conditions.push(eq(products.subcategoryId, subcategoryData.id));
            } else {
                 console.log(`[getProducts] Subcategory slug "${options.subcategory}" not found. Returning empty array.`);
                 return [];
            }
        }

        // --- Other Filters ---
        if (options.featured) conditions.push(eq(products.isFeatured, true));
        if (options.sale) conditions.push(eq(products.isSale, true));
        if (options.new) conditions.push(eq(products.isNew, true));

        // --- Build Query ---
        const query = db.select().from(products).where(and(...conditions));

        // --- Sorting ---
        switch (options.sort) {
            case 'price-asc': query.orderBy(asc(products.price)); break;
            case 'price-desc': query.orderBy(desc(products.price)); break;
            case 'name-asc': query.orderBy(asc(products.name)); break;
            case 'newest': default: query.orderBy(desc(products.createdAt)); break;
        }

        if (options.limit) query.limit(options.limit);

        const data = await query;
        console.log(`[getProducts] Found ${data.length} products.`);
        return data.map(p => ({ ...p, images: parseJson(p.images) }));

    } catch (error) {
        console.error('[getProducts] An error occurred while fetching products:', error);
        return []; // Return empty array on error to prevent page crash
    }
}


export async function getCategoryDetails(slug: string) {
    console.log(`[getCategoryDetails] Fetching details for slug: "${slug}"`);

    if (slug === 'all') {
        console.log('[getCategoryDetails] Slug is "all", returning default object.');
        return {
            id: 'all', name: 'All Products', slug: 'all',
            description: 'Explore our entire collection of products.',
            subcategories: [],
        };
    }

    try {
        const categoryResult = await db.query.categories.findFirst({
            where: eq(sql`lower(${categories.slug})`, slug.toLowerCase()),
        });

        if (!categoryResult) {
            console.log(`[getCategoryDetails] No category found for slug: "${slug}". Returning null.`);
            return null;
        }
        console.log('[getCategoryDetails] Found category:', categoryResult);

        const categorySubcategories = await db.select({
                id: subcategories.id,
                name: subcategories.name,
                slug: subcategories.slug,
            })
            .from(subcategories)
            .where(eq(subcategories.categoryId, categoryResult.id));

        console.log(`[getCategoryDetails] Found ${categorySubcategories.length} subcategories.`);

        return {
            ...categoryResult,
            subcategories: categorySubcategories,
        };
    } catch (error) {
        console.error(`[getCategoryDetails] An error occurred while fetching details for slug "${slug}":`, error);
        return null; // Return null on error to allow the page to show a 404
    }
}

export async function getProductById(id: string) {
    try {
        const productResult = await db.query.products.findFirst({
            where: eq(products.id, id),
            with: {
                category: true,
                reviews: { where: eq(reviews.isApproved, true), orderBy: [desc(reviews.createdAt)] }
            }
        });
        if (!productResult) return null;
        return { ...productResult, images: parseJson(productResult.images) };
    } catch (error) {
        console.error(`[getProductById] Error fetching product ${id}:`, error);
        return null;
    }
}

export async function getRelatedProducts(categoryId: string, productId: string, limit: number) {
    try {
        const related = await db.select().from(products)
            .where(and(eq(products.categoryId, categoryId), not(eq(products.id, productId))))
            .orderBy(desc(products.createdAt))
            .limit(limit);
        return related.map(p => ({ ...p, images: parseJson(p.images) }));
    } catch (error) {
        console.error(`[getRelatedProducts] Error fetching related products for category ${categoryId}:`, error);
        return [];
    }
}

export async function getReviews(options: { productId?: string; limit?: number } = {}) {
    try {
        const conditions = [eq(reviews.isApproved, true)];
        if (options.productId) {
            conditions.push(eq(reviews.productId, options.productId));
        }
        const query = db.select({
                id: reviews.id, rating: reviews.rating, title: reviews.title,
                comment: reviews.comment, customerName: reviews.customerName,
                createdAt: reviews.createdAt,
                product: { name: products.name, id: products.id },
            })
            .from(reviews)
            .leftJoin(products, eq(reviews.productId, products.id))
            .where(and(...conditions))
            .orderBy(desc(reviews.createdAt));

        if (options.limit) query.limit(options.limit);
        return await query;
    } catch (error) {
        console.error('[getReviews] Error fetching reviews:', error);
        return [];
    }
}
