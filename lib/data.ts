import { db } from '@/lib/prisma';
import { products, categories, subcategories } from '@/lib/db/schema';
import { eq, and, desc, asc, not } from 'drizzle-orm';

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
        const categoryData = await db.query.categories.findFirst({ where: eq(categories.slug, options.category) });
        if (categoryData) {
            conditions.push(eq(products.categoryId, categoryData.id));
        }
    }

    if (options.subcategory) {
        const subcategoryData = await db.query.subcategories.findFirst({ where: eq(subcategories.slug, options.subcategory) });
        if (subcategoryData) {
            conditions.push(eq(products.subcategoryId, subcategoryData.id));
        }
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
        with: { category: true }
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
        where: eq(categories.slug, slug),
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
