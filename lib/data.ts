import { db } from '@/lib/prisma';
import { products, categories, subcategories, reviews } from '@/lib/db/schema';
import { eq, and, desc, asc, not, sql } from 'drizzle-orm';

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

    if (options.category && options.category !== 'all') {
        const categoryData = await db.query.categories.findFirst({ where: eq(sql.lower(categories.slug), options.category.toLowerCase()) });

        if (!categoryData) {
            return []; // Category not found, no products to return
        }

        conditions.push(eq(products.categoryId, categoryData.id));

        if (options.subcategory) {
            const subcategoryData = await db.query.subcategories.findFirst({
                where: and(
                    eq(sql.lower(subcategories.slug), options.subcategory.toLowerCase()),
                    eq(subcategories.categoryId, categoryData.id)
                )
            });

            if (!subcategoryData) {
                return []; // Subcategory not found for this category, no products to return
            }
            conditions.push(eq(products.subcategoryId, subcategoryData.id));
        }
    } else if (options.subcategory) {
        const subcategoryData = await db.query.subcategories.findFirst({ where: eq(sql.lower(subcategories.slug), options.subcategory.toLowerCase()) });
        if (!subcategoryData) {
            return [];
        }
        conditions.push(eq(products.subcategoryId, subcategoryData.id));
    }

    if (options.featured) {
        conditions.push(eq(products.isFeatured, true));
    }
    if (options.sale) {
        conditions.push(eq(products.isSale, true));
    }
    if (options.new) {
        conditions.push(eq(products.isNew, true));
    }

    const query = db.select().from(products).where(and(...conditions));

    switch (options.sort) {
        case 'price-asc':
            query.orderBy(asc(products.price));
            break;
        case 'price-desc':
            query.orderBy(desc(products.price));
            break;
        case 'name-asc':
            query.orderBy(asc(products.name));
            break;
        case 'newest':
        default:
            query.orderBy(desc(products.createdAt));
            break;
    }

    if (options.limit) {
        query.limit(options.limit);
    }

    const data = await query;
    return data.map(product => ({
        ...product,
        images: product.images ? JSON.parse(product.images) : [],
    }));
}

export async function getProductById(id: string) {
    const productResult = await db.query.products.findFirst({
        where: eq(products.id, id),
        with: {
            category: true,
            reviews: {
                where: eq(reviews.isApproved, true),
                orderBy: [desc(reviews.createdAt)],
            }
        }
    });

    if (!productResult) return null;

    return {
        ...productResult,
        images: productResult.images ? JSON.parse(productResult.images) : [],
    };
}

export async function getRelatedProducts(categoryId: string, productId: string, limit: number) {
    const related = await db
        .select()
        .from(products)
        .where(and(eq(products.categoryId, categoryId), not(eq(products.id, productId))))
        .orderBy(desc(products.createdAt))
        .limit(limit);

    return related.map(product => ({
        ...product,
        images: product.images ? JSON.parse(product.images) : [],
    }));
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
        where: eq(sql.lower(categories.slug), slug.toLowerCase()),
    });

    if (!categoryResult) {
        return null;
    }

    const categorySubcategories = await db
        .select({
            id: subcategories.id,
            name: subcategories.name,
            slug: subcategories.slug,
        })
        .from(subcategories)
        .where(eq(subcategories.categoryId, categoryResult.id));

    return {
        ...categoryResult,
        subcategories: categorySubcategories,
    };
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