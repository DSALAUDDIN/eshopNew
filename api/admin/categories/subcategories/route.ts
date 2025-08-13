import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/prisma'
import { users, categories, subcategories, products } from '@/lib/db/schema'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'
import { eq, count, and, or } from 'drizzle-orm'

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

// GET /api/admin/categories/subcategories - Get all subcategories
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAdmin(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all subcategories with their parent category info
    const subcategoriesData = await db.select({
      id: subcategories.id,
      name: subcategories.name,
      slug: subcategories.slug,
      description: subcategories.description,
      image: subcategories.image,
      isActive: subcategories.isActive,
      categoryId: subcategories.categoryId,
      createdAt: subcategories.createdAt,
      updatedAt: subcategories.updatedAt,
      categoryName: categories.name,
      categorySlug: categories.slug
    })
    .from(subcategories)
    .leftJoin(categories, eq(subcategories.categoryId, categories.id))

    // Get product counts for each subcategory
    const subcategoriesWithDetails = await Promise.all(
      subcategoriesData.map(async (subcategory) => {
        // Get product count for this subcategory
        const productCount = await db.select({ count: count() })
          .from(products)
          .where(eq(products.subcategoryId, subcategory.id))

        return {
          id: subcategory.id,
          name: subcategory.name,
          slug: subcategory.slug,
          description: subcategory.description,
          image: subcategory.image,
          isActive: subcategory.isActive,
          categoryId: subcategory.categoryId,
          createdAt: subcategory.createdAt,
          updatedAt: subcategory.updatedAt,
          category: {
            id: subcategory.categoryId,
            name: subcategory.categoryName,
            slug: subcategory.categorySlug
          },
          _count: {
            products: productCount[0]?.count || 0
          }
        }
      })
    )

    return NextResponse.json(subcategoriesWithDetails)
  } catch (error) {
    console.error('Error fetching subcategories:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/admin/categories/subcategories - Create new subcategory
export async function POST(request: NextRequest) {
  try {
    const user = await verifyAdmin(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, image, categoryId, isActive = true } = body

    if (!name || !categoryId) {
      return NextResponse.json({ error: 'Name and category ID are required' }, { status: 400 })
    }

    // Check if category exists
    const category = await db.select().from(categories).where(eq(categories.id, categoryId)).limit(1)

    if (!category.length) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }

    // Generate slug
    const slug = name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Check if subcategory with same name exists in this category
    const existingSubcategory = await db.select().from(subcategories)
      .where(
        and(
          eq(subcategories.categoryId, categoryId),
          or(
            eq(subcategories.name, name),
            eq(subcategories.slug, slug)
          )
        )
      )
      .limit(1)

    if (existingSubcategory.length) {
      return NextResponse.json({ error: 'Subcategory with this name already exists in this category' }, { status: 409 })
    }

    const [subcategory] = await db.insert(subcategories).values({
      name,
      slug,
      description: description || null,
      image: image || null,
      categoryId,
      isActive
    }).returning({
      id: subcategories.id,
      name: subcategories.name,
      slug: subcategories.slug,
      description: subcategories.description,
      image: subcategories.image,
      isActive: subcategories.isActive,
      categoryId: subcategories.categoryId,
      createdAt: subcategories.createdAt,
      updatedAt: subcategories.updatedAt
    })

    return NextResponse.json(subcategory, { status: 201 })
  } catch (error) {
    console.error('Error creating subcategory:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
