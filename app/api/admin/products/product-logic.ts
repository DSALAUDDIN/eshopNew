import { db } from '@/lib/prisma';
import { products } from '@/lib/db/schema';
import { createSlug } from '@/lib/auth';
import { eq, and, not } from 'drizzle-orm';

export async function prepareProductData(data: any, productId: string | null = null) {
    // If name is being updated or it's a new product, generate the slug
    if (data.name) {
        let slug = createSlug(data.name);

        // Check if the generated slug already exists for a different product
        const existingProduct = await db
            .select({ id: products.id })
            .from(products)
            .where(
                productId
                    ? and(eq(products.slug, slug), not(eq(products.id, productId)))
                    : eq(products.slug, slug)
            )
            .limit(1);

        // If the slug is in use, append a short random string to make it unique
        if (existingProduct.length > 0) {
            const randomString = Math.random().toString(36).substring(2, 7);
            slug = `${slug}-${randomString}`;
        }
        data.slug = slug;
    }

    // Always set the updatedAt timestamp on the server for updates
    if (productId) {
        data.updatedAt = new Date();
    }

    // Prevent createdAt from being updated
    if (data.createdAt) {
        delete data.createdAt;
    }

    return data;
}
