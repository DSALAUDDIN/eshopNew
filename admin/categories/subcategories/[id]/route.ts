import { NextRequest, NextResponse } from 'next/server'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import { users, categories, subcategories, products } from '@/lib/db/schema'
import { eq, and, count } from 'drizzle-orm'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'

const sqlite = new Database('./prisma/dev.db')
const db = drizzle(sqlite)

async function verifyAdmin(request: NextRequest) {
  const token = getTokenFromRequest(request)
  if (!token) {
    return null
  }

  const decoded = verifyToken(token) as any
  if (!decoded) {
    return null
  }

  const userResult = await db
    .select()
    .from(users)
    .where(eq(users.id, decoded.userId))
    .limit(1)

  const user = userResult[0]
  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    return null
  }

  return user
}

// PUT /api/admin/categories/subcategories/[id] - Update subcategory
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
    const { name, description, image, categoryId, isActive } = body

    if (!name || !categoryId) {
      return NextResponse.json({ error: 'Name and category ID are required' }, { status: 400 })
    }

    // Check if subcategory exists
    const existingSubcategory = await db
      .select()
      .from(subcategories)
      .where(eq(subcategories.id, params.id))
      .limit(1)

    if (!existingSubcategory[0]) {
      return NextResponse.json({ error: 'Subcategory not found' }, { status: 404 })
    }

    // Check if category exists
    const categoryExists = await db
      .select()
      .from(categories)
      .where(eq(categories.id, categoryId))
      .limit(1)

    if (!categoryExists[0]) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    // Check if slug is already taken by another subcategory in the same category
    const slugCheck = await db
      .select()
      .from(subcategories)
      .where(
        and(
          eq(subcategories.slug, slug),
          eq(subcategories.categoryId, categoryId)
        )
      )
      .limit(1)

    if (slugCheck[0] && slugCheck[0].id !== params.id) {
      return NextResponse.json({ error: 'Subcategory name already exists in this category' }, { status: 400 })
    }

    // Update subcategory
    const updatedSubcategory = await db
      .update(subcategories)
      .set({
        name: name.trim(),
        slug,
        description: description?.trim() || null,
        image: image || null,
        categoryId,
        isActive: isActive !== undefined ? isActive : true,
        updatedAt: new Date()
      })
      .where(eq(subcategories.id, params.id))
      .returning()

    return NextResponse.json(updatedSubcategory[0])
  } catch (error) {
    console.error('Error updating subcategory:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/admin/categories/subcategories/[id] - Delete subcategory
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyAdmin(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if subcategory exists
    const existingSubcategory = await db
      .select()
      .from(subcategories)
      .where(eq(subcategories.id, params.id))
      .limit(1)

    if (!existingSubcategory[0]) {
      return NextResponse.json({ error: 'Subcategory not found' }, { status: 404 })
    }

    // Check if subcategory has products
    const productCount = await db
      .select({ count: count() })
      .from(products)
      .where(eq(products.subcategoryId, params.id))

    if (productCount[0]?.count > 0) {
      return NextResponse.json({
        error: 'Cannot delete subcategory with products. Please move or delete all products first.'
      }, { status: 400 })
    }

    // Delete subcategory
    await db
      .delete(subcategories)
      .where(eq(subcategories.id, params.id))

    return NextResponse.json({ message: 'Subcategory deleted successfully' })
  } catch (error) {
    console.error('Error deleting subcategory:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
