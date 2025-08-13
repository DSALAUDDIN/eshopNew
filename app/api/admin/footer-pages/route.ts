import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { footerPages } from '@/lib/db/schema'
import { eq, desc, asc } from 'drizzle-orm'

// GET /api/admin/footer-pages - List all footer pages
export async function GET() {
  try {
    const pages = await db
      .select()
      .from(footerPages)
      .orderBy(
        asc(footerPages.sortOrder),
        desc(footerPages.createdAt)
      )

    return NextResponse.json(pages)
  } catch (error) {
    console.error('Error fetching footer pages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch footer pages' },
      { status: 500 }
    )
  }
}

// POST /api/admin/footer-pages - Create new footer page
export async function POST(request: NextRequest) {
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

    // Check if slug already exists
    const existingPage = await db
      .select()
      .from(footerPages)
      .where(eq(footerPages.slug, slug))
      .limit(1)

    if (existingPage.length > 0) {
      return NextResponse.json(
        { error: 'A page with this slug already exists' },
        { status: 400 }
      )
    }

    const [page] = await db
      .insert(footerPages)
      .values({
        id: crypto.randomUUID(),
        title,
        slug,
        content,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        isActive: isActive ?? true,
        sortOrder: sortOrder || 0,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning()

    return NextResponse.json(page, { status: 201 })
  } catch (error) {
    console.error('Error creating footer page:', error)
    return NextResponse.json(
      { error: 'Failed to create footer page' },
      { status: 500 }
    )
  }
}
