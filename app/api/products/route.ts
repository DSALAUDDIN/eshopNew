import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/prisma'
import { products, categories, subcategories } from '@/lib/db/schema'
import { eq, and, like, gte, lte, desc } from 'drizzle-orm'

// GET /api/products - Public API for frontend
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const category = searchParams.get('category') || ''
    const subcategory = searchParams.get('subcategory') || ''
    const search = searchParams.get('search') || ''
    const featured = searchParams.get('featured') || ''
    const sale = searchParams.get('sale') || ''
    const new_ = searchParams.get('new') || ''
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')

    const offset = (page - 1) * limit

    // Build where conditions
    const conditions = [
      eq(products.isActive, true),
      eq(products.inStock, true)
    ]

    if (search) {
      conditions.push(like(products.name, `%${search}%`))
    }

    if (featured === 'true') {
      conditions.push(eq(products.isFeatured, true))
    }

    if (sale === 'true') {
      conditions.push(eq(products.isSale, true))
    }

    if (new_ === 'true') {
      conditions.push(eq(products.isNew, true))
    }

    if (minPrice) {
      conditions.push(gte(products.price, parseFloat(minPrice)))
    }

    if (maxPrice) {
      conditions.push(lte(products.price, parseFloat(maxPrice)))
    }

    // Get products with category and subcategory info
    let query = db.select({
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
      weight: products.weight,
      dimensions: products.dimensions,
      materials: products.materials,
      careInstructions: products.careInstructions,
      seoTitle: products.seoTitle,
      seoDescription: products.seoDescription,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
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

    // Apply category filter
    if (category) {
      conditions.push(eq(categories.slug, category))
    }

    // Apply subcategory filter
    if (subcategory) {
      conditions.push(eq(subcategories.slug, subcategory))
    }

    const productsData = await query
      .where(and(...conditions))
      .limit(limit)
      .offset(offset)
      .orderBy(desc(products.createdAt))

    // Parse images JSON strings to arrays for frontend consumption
    const formattedProducts = productsData.map(product => ({
      ...product,
      images: product.images ? JSON.parse(product.images) : []
    }))

    // Get total count for pagination
    const totalProducts = await db
      .select({ count: products.id })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .leftJoin(subcategories, eq(products.subcategoryId, subcategories.id))
      .where(and(...conditions))

    const total = totalProducts.length
    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      products: formattedProducts,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
