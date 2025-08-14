import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/prisma'
import { categories, subcategories, products } from '@/lib/db/schema'
import { eq, and, count, desc } from 'drizzle-orm'

// GET /api/categories - Public API for frontend
export async function GET(request: NextRequest) {
  try {
    const categoriesData = await db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        description: categories.description,
        image: categories.image,
        productCount: count(products.id),
      })
      .from(categories)
      .leftJoin(products, eq(categories.id, products.categoryId))
      .where(eq(categories.isActive, true))
      .groupBy(categories.id)
      .orderBy(desc(count(products.id)));

    const categoriesWithSubcategories = await Promise.all(
      categoriesData.map(async (category) => {
        const subcategoriesData = await db
          .select({
            id: subcategories.id,
            name: subcategories.name,
            slug: subcategories.slug,
            description: subcategories.description,
            image: subcategories.image,
            productCount: count(products.id),
          })
          .from(subcategories)
          .leftJoin(products, eq(subcategories.id, products.subcategoryId))
          .where(and(eq(subcategories.categoryId, category.id), eq(subcategories.isActive, true)))
          .groupBy(subcategories.id)
          .orderBy(desc(count(products.id)));

        return {
          ...category,
          subcategories: subcategoriesData,
        };
      })
    );

    return NextResponse.json(categoriesWithSubcategories, {
      headers: {
        'Cache-Control': 'no-store, max-age=0, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}
