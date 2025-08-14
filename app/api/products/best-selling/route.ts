import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/prisma'
import { products, categories, subcategories } from '@/lib/db/schema'
import { eq, and, or, desc } from 'drizzle-orm'

// GET /api/products/best-selling - Get best selling products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '8')

    const bestSellingProductsData = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        description: products.description,
        price: products.price,
        originalPrice: products.originalPrice,
        sku: products.sku,
        images: products.images,
        inStock: products.inStock,
        stockQuantity: products.stockQuantity,
        isNew: products.isNew,
        isSale: products.isSale,
        isFeatured: products.isFeatured,
        isActive: products.isActive,
        createdAt: products.createdAt,
        category: {
          id: categories.id,
          name: categories.name,
          slug: categories.slug
        },
        subcategory: {
          id: subcategories.id,
          name: subcategories.name,
          slug: subcategories.slug
        }
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .leftJoin(subcategories, eq(products.subcategoryId, subcategories.id))
      .where(and(
        eq(products.isActive, true),
        eq(products.inStock, true),
        or(
          eq(products.isFeatured, true),
          eq(products.isSale, true)
        )
      ))
      .orderBy(desc(products.isFeatured), desc(products.isSale), desc(products.createdAt))
      .limit(limit)

    const formattedProducts = bestSellingProductsData.map(product => ({
      ...product,
      images: product.images ? JSON.parse(product.images) : []
    }))

    return NextResponse.json(formattedProducts)
  } catch (error) {
    console.error('Error fetching best selling products:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
