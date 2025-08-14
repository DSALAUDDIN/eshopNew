import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/prisma'
import { categories, subcategories, products } from '@/lib/db/schema'
import { eq, and, count } from 'drizzle-orm'

// GET /api/categories - Public API for frontend
export async function GET(request: NextRequest) {
  try {
    // Get all active categories
    const categoriesData = await db.select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
      description: categories.description,
      image: categories.image,
      isActive: categories.isActive,
      createdAt: categories.createdAt,
      updatedAt: categories.updatedAt
    })
    .from(categories)
    .where(eq(categories.isActive, true))

    // Get subcategories for each category with product counts
    const categoriesWithSubcategories = await Promise.all(
      categoriesData.map(async (category) => {
        // Get subcategories for this category
        const subcategoriesData = await db.select({
          id: subcategories.id,
          name: subcategories.name,
          slug: subcategories.slug,
          description: subcategories.description,
          image: subcategories.image,
          isActive: subcategories.isActive
        })
        .from(subcategories)
        .where(and(
          eq(subcategories.categoryId, category.id),
          eq(subcategories.isActive, true)
        ))

        // Get product count for each subcategory
        const subcategoriesWithCount = await Promise.all(
          subcategoriesData.map(async (subcategory) => {
            const productCount = await db.select({ count: count() })
              .from(products)
              .where(and(
                eq(products.subcategoryId, subcategory.id),
                eq(products.isActive, true)
              ))

            return {
              ...subcategory,
              _count: {
                products: productCount[0]?.count || 0
              }
            }
          })
        )

        // Get total product count for the category
        const categoryProductCount = await db.select({ count: count() })
          .from(products)
          .where(and(
            eq(products.categoryId, category.id),
            eq(products.isActive, true)
          ))

        return {
          ...category,
          subcategories: subcategoriesWithCount,
          _count: {
            products: categoryProductCount[0]?.count || 0
          }
        }
      })
    )

    return NextResponse.json({
      categories: categoriesWithSubcategories,
      fetchedAt: new Date().toISOString()
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store'
      }
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}
