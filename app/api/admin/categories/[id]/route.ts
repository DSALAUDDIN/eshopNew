import { NextRequest, NextResponse } from 'next/server'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import { users, categories, subcategories, products } from '@/lib/db/schema'
import { eq, count } from 'drizzle-orm'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

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

// GET /api/admin/categories/[id] - Get single category
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyAdmin(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const categoryResult = await db
      .select()
      .from(categories)
      .where(eq(categories.id, params.id))
      .limit(1)

    const category = categoryResult[0]
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    // Get subcategories
    const subcategoryResults = await db
      .select()
      .from(subcategories)
      .where(eq(subcategories.categoryId, params.id))

    // Get product count
    const productCountResult = await db
      .select({ count: count() })
      .from(products)
      .where(eq(products.categoryId, params.id))

    const result = {
      ...category,
      subcategories: subcategoryResults,
      _count: {
        products: productCountResult[0]?.count || 0
      }
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching category:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/admin/categories/[id] - Update category
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
    const { name, description, image, isActive } = body

    if (!name || name.trim() === '') {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 })
    }

    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    // Check if category exists
    const existingCategory = await db
      .select()
      .from(categories)
      .where(eq(categories.id, params.id))
      .limit(1)

    if (!existingCategory[0]) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    // Check if slug is already taken by another category
    const slugCheck = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, slug))
      .limit(1)

    if (slugCheck[0] && slugCheck[0].id !== params.id) {
      return NextResponse.json({ error: 'Category name already exists' }, { status: 400 })
    }

    // Update category
    const updatedCategory = await db
      .update(categories)
      .set({
        name: name.trim(),
        slug,
        description: description?.trim() || null,
        image: image || null,
        isActive: isActive !== undefined ? isActive : true,
        updatedAt: new Date()
      })
      .where(eq(categories.id, params.id))
      .returning()

    revalidatePath('/')
    revalidatePath('/categories')
    revalidatePath('/admin/categories')
    revalidatePath(`/categories/${slug}`)

    return NextResponse.json(updatedCategory[0])
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/admin/categories/[id] - Delete category
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await verifyAdmin(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if category exists
    const existingCategory = await db
      .select()
      .from(categories)
      .where(eq(categories.id, params.id))
      .limit(1)

    if (!existingCategory[0]) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    // Check if category has products
    const productCount = await db
      .select({ count: count() })
      .from(products)
      .where(eq(products.categoryId, params.id))

    if (productCount[0]?.count > 0) {
      return NextResponse.json({
        error: 'Cannot delete category with products. Please move or delete all products first.'
      }, { status: 400 })
    }

    // Delete category (subcategories will be deleted by cascade)
    await db
      .delete(categories)
      .where(eq(categories.id, params.id))

    revalidatePath('/')
    revalidatePath('/categories')
    revalidatePath('/admin/categories')
    revalidatePath(`/categories/${existingCategory[0].slug}`)

    return NextResponse.json({ message: 'Category deleted successfully' })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
