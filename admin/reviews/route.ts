import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/prisma'
import { users, reviews, products } from '@/lib/db/schema'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'
import { eq, and, desc, count } from 'drizzle-orm'

async function verifyAdmin(request: NextRequest) {
  const token = getTokenFromRequest(request)
  if (!token) {
    return null
  }

  const decoded = verifyToken(token) as any
  if (!decoded) {
    return null
  }

  const userResults = await db.select().from(users).where(eq(users.id, decoded.userId)).limit(1)
  const user = userResults[0]

  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    return null
  }

  return user
}

// GET /api/admin/reviews - Get all reviews (including pending)
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAdmin(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') // 'pending', 'approved', 'all'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    // Build where conditions
    const conditions = []
    if (status === 'pending') {
      conditions.push(eq(reviews.isApproved, false))
    } else if (status === 'approved') {
      conditions.push(eq(reviews.isApproved, true))
    }

    // Get reviews with product info
    const reviewsData = await db.select({
      review: reviews,
      product: {
        id: products.id,
        name: products.name
      }
    })
    .from(reviews)
    .leftJoin(products, eq(reviews.productId, products.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(reviews.createdAt))
    .limit(limit)
    .offset(offset)

    // Get total count
    const totalCount = await db.select({ count: count() })
      .from(reviews)
      .where(conditions.length > 0 ? and(...conditions) : undefined)

    const total = totalCount[0]?.count || 0
    const totalPages = Math.ceil(total / limit)

    // Format response
    const formattedReviews = reviewsData.map(item => ({
      ...item.review,
      product: item.product
    }))

    return NextResponse.json({
      reviews: formattedReviews,
      pagination: {
        currentPage: page,
        totalPages,
        totalReviews: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    })
  } catch (error) {
    console.error('Error fetching admin reviews:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
