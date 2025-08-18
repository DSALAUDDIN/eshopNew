import { db } from '@/lib/prisma';
import { products, categories, subcategories, reviews } from '@/lib/db/schema';
import { eq, and, desc, asc, not, like } from 'drizzle-orm';
import type { Product } from './types';

export async function getProducts(options: {
    featured?: boolean;
    limit?: number;
    category?: string;
    subcategory?: string;
    sale?: boolean;
    new?: boolean;
    sort?: string;
} = {}) {
    const conditions = [];

    if (options.featured) {
        conditions.push(eq(products.isFeatured, true));
    }
    if (options.sale) {
        conditions.push(eq(products.isSale, true));
    }
    if (options.new) {
        conditions.push(eq(products.isNew, true));
    }

    if (options.category && options.category !== 'all') {
        const categoryData = await db.query.categories.findFirst({ where: like(categories.slug, options.category) });
        if (categoryData) {
            conditions.push(eq(products.categoryId, categoryData.id));
        }
    }

    if (options.subcategory) {
        const subcategoryData = await db.query.subcategories.findFirst({ where: like(subcategories.slug, options.subcategory) });
        if (subcategoryData) {
            conditions.push(eq(products.subcategoryId, subcategoryData.id));
        }
    }

    const queryOptions = {
        where: and(...conditions),
        with: {
            category: true,
            subcategory: true,
        },
        orderBy: [] as any,
        limit: options.limit,
    };

    switch (options.sort) {
        case 'price-asc':
            queryOptions.orderBy.push(asc(products.price));
            break;
        case 'price-desc':
            queryOptions.orderBy.push(desc(products.price));
            break;
        case 'name-asc':
            queryOptions.orderBy.push(asc(products.name));
            break;
        case 'newest':
        default:
            queryOptions.orderBy.push(desc(products.createdAt));
            break;
    }

    const data = await db.query.products.findMany(queryOptions);

    return data.map((p): Product => {
        const { category, subcategory, ...rest } = p;
        const parsedImages = rest.images ? JSON.parse(rest.images) : [];
        return {
            ...rest,
            images: parsedImages,
            image: parsedImages[0] || '/placeholder.svg',
            category: category?.name || 'N/A',
            subcategory: subcategory?.name || 'N/A',
        };
    });
}

export async function getProductById(id: string) {
    const productResult = await db.query.products.findFirst({
        where: eq(products.id, id),
        with: {
            category: true,
            subcategory: true,
            reviews: {
                where: eq(reviews.isApproved, true),
                orderBy: [desc(reviews.createdAt)],
            }
        }
    });

    if (!productResult) return null;

    const { category, subcategory, reviews: productReviews, ...rest } = productResult;
    const parsedImages = rest.images ? JSON.parse(rest.images) : [];

    return {
        ...rest,
        images: parsedImages,
        image: parsedImages[0] || '/placeholder.svg',
        category: category?.name || 'N/A',
        subcategory: subcategory?.name || 'N/A',
        reviews: productReviews,
    };
}

export async function getRelatedProducts(categoryId: string, productId: string, limit: number) {
    const related = await db.query.products.findMany({
        where: and(eq(products.categoryId, categoryId), not(eq(products.id, productId))),
        with: {
            category: true,
            subcategory: true,
        },
        orderBy: desc(products.createdAt),
        limit: limit,
    });

    return related.map((p): Product => {
        const { category, subcategory, ...rest } = p;
        const parsedImages = rest.images ? JSON.parse(rest.images) : [];
        return {
            ...rest,
            images: parsedImages,
            image: parsedImages[0] || '/placeholder.svg',
            category: category?.name || 'N/A',
            subcategory: subcategory?.name || 'N/A',
        };
    });
}

export async function getCategoryDetails(slug: string) {
    console.log(`[getCategoryDetails] Searching for category with slug: ${slug}`);
    if (slug === 'all') {
        return {
            id: 'all',
            name: 'All Products',
            slug: 'all',
            description: 'Explore our entire collection of products.',
            subcategories: [],
        };
    }

    try {
        const categoryResult = await db.query.categories.findFirst({
            where: like(categories.slug, slug),
            with: {
                subcategories: {
                    columns: {
                        id: true,
                        name: true,
                        slug: true,
                    }
                }
            }
        });

        console.log(`[getCategoryDetails] Found category:`, categoryResult);
        return categoryResult || null;
    } catch (error) {
        console.error(`[getCategoryDetails] Error fetching category with slug ${slug}:`, error);
        return null;
    }
}

export async function getReviews(options: { productId?: string; limit?: number } = {}) {
    const conditions = [eq(reviews.isApproved, true)];
    if (options.productId) {
        conditions.push(eq(reviews.productId, options.productId));
    }

    const query = db
        .select({
            id: reviews.id,
            rating: reviews.rating,
            title: reviews.title,
            comment: reviews.comment,
            customerName: reviews.customerName,
            createdAt: reviews.createdAt,
            product: {
                name: products.name,
                id: products.id,
            },
        })
        .from(reviews)
        .leftJoin(products, eq(reviews.productId, products.id))
        .where(and(...conditions))
        .orderBy(desc(reviews.createdAt));

    if (options.limit) {
        query.limit(options.limit);
    }

    return await query;
}
