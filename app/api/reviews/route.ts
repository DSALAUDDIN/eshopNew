import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/prisma'
import { reviews, products } from '@/lib/db/schema'
import { eq, and, desc, count } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

// GET /api/reviews - Get approved reviews for a product
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    // Build where conditions
    const conditions = [eq(reviews.isApproved, true)]
    if (productId) {
      conditions.push(eq(reviews.productId, productId))
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
    .where(and(...conditions))
    .orderBy(desc(reviews.createdAt))
    .limit(limit)
    .offset(offset)

    // Get total count
    const totalCount = await db.select({ count: count() })
      .from(reviews)
      .where(and(...conditions))

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
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}

// POST /api/reviews - Create a new review
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      productId,
      userId,
      rating,
      title,
      comment,
      customerName,
      customerEmail
    } = body

    // Validate required fields
    if (!productId || !rating || !comment || !customerName || !customerEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    // Create review (requires admin approval)
    const newReview = await db.insert(reviews).values({
      productId,
      userId: userId || null,
      rating,
      title: title || null,
      comment,
      customerName,
      customerEmail,
      isApproved: true // Reviews are now automatically approved
    }).returning()

    // Revalidate the product page to show the new review after approval
    revalidatePath(`/product/${productId}`);

    return NextResponse.json(newReview[0], { status: 201 })
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    )
  }
}
