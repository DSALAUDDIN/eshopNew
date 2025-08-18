import { db } from '@/lib/prisma';
import { products, categories, subcategories, reviews } from '@/lib/db/schema';
import { eq, and, desc, asc, not, like } from 'drizzle-orm';

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

    return data.map(product => {
        const parsedImages = product.images ? JSON.parse(product.images) : [];
        return {
            ...product,
            images: parsedImages,
            image: parsedImages[0] || '/placeholder.svg',
            category: product.category?.name || 'N/A',
            subcategory: product.subcategory?.name || 'N/A',
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

    const parsedImages = productResult.images ? JSON.parse(productResult.images) : [];
    return {
        ...productResult,
        images: parsedImages,
        image: parsedImages[0] || '/placeholder.svg',
        category: productResult.category?.name || 'N/A',
        subcategory: productResult.subcategory?.name || 'N/A',
    };
}

export async function getRelatedProducts(categoryId: string, productId: string, limit: number) {
    const related = await db
        .select()
        .from(products)
        .where(and(eq(products.categoryId, categoryId), not(eq(products.id, productId))))
        .orderBy(desc(products.createdAt))
        .limit(limit);

    return related.map(product => {
        const parsedImages = product.images ? JSON.parse(product.images) : [];
        return {
            ...product,
            images: parsedImages,
            image: parsedImages[0] || '/placeholder.svg',
        };
    });
}

export async function getCategoryDetails(slug: string) {
    if (slug === 'all') {
        return {
            id: 'all',
            name: 'All Products',
            slug: 'all',
            description: 'Explore our entire collection of products.',
            subcategories: [],
        };
    }

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

    return categoryResult || null;
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
