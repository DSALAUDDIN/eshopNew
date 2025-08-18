export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { products, categories, subcategories, users, reviews, orderItems } from '@/lib/db/schema'
import { eq, and, desc, count } from 'drizzle-orm'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'

// ✅ Admin verification (Drizzle)
async function verifyAdmin(request: NextRequest) {
  const token = getTokenFromRequest(request)
  if (!token) return null

  const decoded = verifyToken(token) as any
  if (!decoded) return null

  const user = await db
      .select()
      .from(users)
      .where(eq(users.id, decoded.userId))
      .limit(1)

  if (!user[0] || (user[0].role !== 'ADMIN' && user[0].role !== 'SUPER_ADMIN')) return null
  return user[0]
}

// ✅ GET /api/admin/products/[id] - Get single product
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await verifyAdmin(request)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Fetch main product info
    const productData = await db
        .select({
          product: {
            id: products.id,
            name: products.name,
            description: products.description,
            price: products.price,
            originalPrice: products.originalPrice,
            images: products.images,
            stockQuantity: products.stockQuantity,
            inStock: products.inStock,
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
            updatedAt: products.updatedAt
          },
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
        .where(eq(products.id, params.id))
        .limit(1)

    if (!productData[0]) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const product = productData[0]

    // Fetch reviews
    const reviewData = await db
        .select({
          id: reviews.id,
          rating: reviews.rating,
          comment: reviews.comment,
          createdAt: reviews.createdAt,
          user: {
            id: users.id,
            name: users.name,
            email: users.email
          }
        })
        .from(reviews)
        .leftJoin(users, eq(reviews.userId, users.id))
        .where(eq(reviews.productId, params.id))
        .orderBy(desc(reviews.createdAt))

    // Count orders & reviews
    const orderCount = await db
        .select({ count: count() })
        .from(orderItems)
        .where(eq(orderItems.productId, params.id))

    const reviewCount = await db
        .select({ count: count() })
        .from(reviews)
        .where(eq(reviews.productId, params.id))

    return NextResponse.json({
      ...product,
      product: {
        ...product.product,
        images: product.product.images ? JSON.parse(product.product.images as string) : []
      },
      reviews: reviewData,
      _count: {
        orderItems: orderCount[0]?.count || 0,
        reviews: reviewCount[0]?.count || 0
      }
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Error fetching product:', message)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
