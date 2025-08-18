export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/prisma'
import { users, products, categories, subcategories } from '@/lib/db/schema'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'
import { eq, and, like, desc, count } from 'drizzle-orm'

async function verifyAdmin(request: NextRequest) {
  const token = getTokenFromRequest(request)
  if (!token) return null

  const decoded = verifyToken(token) as any
  if (!decoded) return null

  const userResults = await db
      .select()
      .from(users)
      .where(eq(users.id, decoded.userId))
      .limit(1)

  const user = userResults[0]
  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) return null

  return user
}

// GET /api/admin/products - Get all products with pagination
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAdmin(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '20', 10)
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const status = searchParams.get('status') || ''

    const offset = (page - 1) * limit
    const conditions = []

    if (search) conditions.push(like(products.name, `%${search}%`))
    if (status === 'active') conditions.push(eq(products.isActive, true))
    else if (status === 'inactive') conditions.push(eq(products.isActive, false))
    if (category) conditions.push(eq(categories.slug, category))

    const productsData = await db
        .select({
          product: products,
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
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(products.createdAt))
        .limit(limit)
        .offset(offset)

    const totalCount = await db
        .select({ count: count() })
        .from(products)
        .leftJoin(categories, eq(products.categoryId, categories.id))
        .where(conditions.length > 0 ? and(...conditions) : undefined)

    const total = totalCount[0]?.count || 0
    const totalPages = Math.ceil(total / limit)

    const formattedProducts = productsData.map(item => ({
      ...item.product,
      images: item.product.images ? JSON.parse(item.product.images) : [],
      category: item.category,
      subcategory: item.subcategory
    }))

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
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Error fetching admin products:', message)
    return NextResponse.json(
        { error: 'Failed to fetch products', details: process.env.NODE_ENV === 'development' ? message : undefined },
        { status: 500 }
    )
  }
}

// POST /api/admin/products - Create new product
export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Product creation attempt started')

    const user = await verifyAdmin(request)
    if (!user) {
      console.log('❌ Unauthorized user')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    console.log('📝 Received product data:', body)

    const {
      name,
      description,
      price,
      originalPrice,
      sku,
      images,
      categoryId,
      subcategoryId,
      inStock,
      stockQuantity,
      isNew,
      isSale,
      isFeatured,
      weight,
      dimensions,
      materials,
      careInstructions,
      seoTitle,
      seoDescription
    } = body

    // Validate required fields
    const missingFields: string[] = []
    if (!name) missingFields.push('name')
    if (!description) missingFields.push('description')
    if (!price) missingFields.push('price')
    if (!sku) missingFields.push('sku')
    if (!categoryId) missingFields.push('categoryId')

    if (missingFields.length > 0) {
      console.log('❌ Missing required fields:', missingFields)
      return NextResponse.json(
          { error: `Missing required fields: ${missingFields.join(', ')}` },
          { status: 400 }
      )
    }

    const priceNum = parseFloat(price)
    const originalPriceNum = originalPrice ? parseFloat(originalPrice) : null
    const stockQuantityNum = parseInt(stockQuantity, 10) || 0

    if (isNaN(priceNum)) {
      console.log('❌ Invalid price value:', price)
      return NextResponse.json(
          { error: 'Invalid price value' },
          { status: 400 }
      )
    }

    const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')

    console.log('✅ Creating product with processed data:', {
      name,
      slug,
      price: priceNum,
      originalPrice: originalPriceNum,
      sku,
      categoryId,
      subcategoryId: subcategoryId || null,
      stockQuantity: stockQuantityNum
    })

    const newProduct = await db
        .insert(products)
        .values({
          name,
          slug,
          description,
          price: priceNum,
          originalPrice: originalPriceNum,
          sku,
          images: JSON.stringify(images || []),
          categoryId,
          subcategoryId: subcategoryId || null,
          inStock: inStock !== undefined ? inStock : true,
          stockQuantity: stockQuantityNum,
          isNew: isNew || false,
          isSale: isSale || false,
          isFeatured: isFeatured || false,
          isActive: true,
          weight: weight || null,
          dimensions: dimensions || null,
          materials: materials || null,
          careInstructions: careInstructions || null,
          seoTitle: seoTitle || null,
          seoDescription: seoDescription || null
        })
        .returning()

    console.log('✅ Product created successfully:', newProduct[0])
    return NextResponse.json(newProduct[0], { status: 201 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('❌ Error creating product:', message)

    let errorMessage = 'Failed to create product'
    if (message.includes('UNIQUE constraint')) {
      errorMessage = 'A product with this SKU already exists'
    } else if (message.includes('FOREIGN KEY constraint')) {
      errorMessage = 'Invalid category or subcategory selected'
    } else if (message.includes('NOT NULL constraint')) {
      errorMessage = 'Required field is missing or invalid'
    }

    return NextResponse.json(
        { error: errorMessage, details: process.env.NODE_ENV === 'development' ? message : undefined },
        { status: 500 }
    )
  }
}
