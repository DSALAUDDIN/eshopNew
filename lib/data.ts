import { db } from '@/lib/prisma';
import { products, categories }from '@/lib/db/schema';
import { eq, and, like, desc, count } from 'drizzle-orm';

export async function getProducts(options: { featured?: boolean; limit?: number; category?: string; sale?: boolean; new?: boolean; } = {}) {
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
        const category = await db.select().from(categories).where(eq(categories.slug, options.category));
        if (category[0]) {
            conditions.push(eq(products.categoryId, category[0].id));
        }
    }

    const query = db
        .select()
        .from(products)
        .where(and(...conditions))
        .orderBy(desc(products.createdAt));

    if (options.limit) {
        query.limit(options.limit);
    }

    const data = await query;

    return data.map(product => ({
        ...product,
        images: product.images ? JSON.parse(product.images) : [],
    }));
}
