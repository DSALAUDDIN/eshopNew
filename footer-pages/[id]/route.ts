import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { footerPages } from '@/lib/db/schema'
import { eq, and, ne } from 'drizzle-orm'

// GET /api/admin/footer-pages/[id] - Get single footer page
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const [page] = await db
      .select()
      .from(footerPages)
      .where(eq(footerPages.id, params.id))
      .limit(1)

    if (!page) {
      return NextResponse.json(
        { error: 'Footer page not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(page)
  } catch (error) {
    console.error('Error fetching footer page:', error)
    return NextResponse.json(
      { error: 'Failed to fetch footer page' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/footer-pages/[id] - Update footer page
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { title, slug, content, metaTitle, metaDescription, isActive, sortOrder } = body

    // Validate required fields
    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: 'Title, slug, and content are required' },
        { status: 400 }
      )
    }

    // Check if slug already exists (excluding current page)
    const existingPage = await db
      .select()
      .from(footerPages)
      .where(and(eq(footerPages.slug, slug), ne(footerPages.id, params.id)))
      .limit(1)

    if (existingPage.length > 0) {
      return NextResponse.json(
        { error: 'A page with this slug already exists' },
        { status: 400 }
      )
    }

    const [updatedPage] = await db
      .update(footerPages)
      .set({
        title,
        slug,
        content,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        isActive: isActive ?? true,
        sortOrder: sortOrder || 0,
        updatedAt: new Date()
      })
      .where(eq(footerPages.id, params.id))
      .returning()

    if (!updatedPage) {
      return NextResponse.json(
        { error: 'Footer page not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(updatedPage)
  } catch (error) {
    console.error('Error updating footer page:', error)
    return NextResponse.json(
      { error: 'Failed to update footer page' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/footer-pages/[id] - Delete footer page
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const [deletedPage] = await db
      .delete(footerPages)
      .where(eq(footerPages.id, params.id))
      .returning()

    if (!deletedPage) {
      return NextResponse.json(
        { error: 'Footer page not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Footer page deleted successfully' })
  } catch (error) {
    console.error('Error deleting footer page:', error)
    return NextResponse.json(
      { error: 'Failed to delete footer page' },
      { status: 500 }
    )
  }
}
