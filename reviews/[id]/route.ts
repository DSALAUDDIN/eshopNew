import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/prisma'
import { users, reviews } from '@/lib/db/schema'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'
import { eq } from 'drizzle-orm'

async function verifyAdmin(request: NextRequest) {
  const token = getTokenFromRequest(request)
  if (!token) {
    return null
  }

  const decoded = verifyToken(token) as any
  if (!decoded) {
    return null
  }

  const userResults = await db
    .select()
    .from(users)
    .where(eq(users.id, decoded.userId))
    .limit(1)
  const user = userResults[0]

  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    return null
  }

  return user
}

// PUT /api/admin/reviews/[id] - Approve/reject a review
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyAdmin(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { isApproved } = body
    const reviewId = params.id

    if (typeof isApproved !== 'boolean') {
      return NextResponse.json(
        { error: 'isApproved must be a boolean' },
        { status: 400 }
      )
    }

    // Update review using Drizzle ORM
    const updatedReview = await db
      .update(reviews)
      .set({ isApproved })
      .where(eq(reviews.id, reviewId))
      .returning()

    if (!updatedReview.length) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: 'Review updated successfully',
      review: updatedReview[0]
    })
  } catch (error) {
    console.error('Error updating review:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/reviews/[id] - Delete a review
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyAdmin(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const reviewId = params.id

    // Delete review using Drizzle ORM
    const deletedReview = await db
      .delete(reviews)
      .where(eq(reviews.id, reviewId))
      .returning()

    if (!deletedReview.length) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: 'Review deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting review:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
