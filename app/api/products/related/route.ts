import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/prisma'
import { products, categories, subcategories } from '@/lib/db/schema'
import { eq, and, ne, desc } from 'drizzle-orm'

// GET /api/products/related - Get related products by category
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categorySlug = searchParams.get('category')
    const excludeId = searchParams.get('excludeId')
    const limit = parseInt(searchParams.get('limit') || '8')

    if (!categorySlug) {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 })
    }

    const conditions = [
      eq(products.isActive, true),
      eq(products.inStock, true),
      eq(categories.slug, categorySlug)
    ]

    if (excludeId) {
      conditions.push(ne(products.id, excludeId))
    }

    const relatedProductsData = await db
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
      .where(and(...conditions))
      .orderBy(desc(products.createdAt))
      .limit(limit)

    const formattedProducts = relatedProductsData.map(product => ({
      ...product,
      images: product.images ? JSON.parse(product.images) : []
    }))

    return NextResponse.json(formattedProducts)
  } catch (error) {
    console.error('Error fetching related products:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
