import { NextRequest, NextResponse } from 'next/server'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import Database from 'better-sqlite3'
import { users, categories, subcategories, products } from '@/lib/db/schema'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'
import { eq, and, count } from 'drizzle-orm'
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

  const userResults = await db.select().from(users).where(eq(users.id, decoded.userId)).limit(1)
  const user = userResults[0]

  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    return null
  }

  return user
}

// GET /api/admin/categories - Get all categories
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAdmin(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all categories
    const categoriesData = await db.select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
      description: categories.description,
      image: categories.image,
      isActive: categories.isActive,
      createdAt: categories.createdAt,
      updatedAt: categories.updatedAt
    })
    .from(categories)

    // Get all subcategories at once to avoid N+1 queries
    const allSubcategories = await db.select().from(subcategories);

    // Get all product counts at once
    const productCounts = await db.select({ 
        categoryId: products.categoryId, 
        count: count(products.id) 
      })
      .from(products)
      .groupBy(products.categoryId);

    // Create maps for efficient lookup
    const subcategoriesMap = allSubcategories.reduce((acc, sub) => {
      if (!acc[sub.categoryId]) {
        acc[sub.categoryId] = [];
      }
      acc[sub.categoryId].push(sub);
      return acc;
    }, {} as Record<string, typeof allSubcategories>);

    const productCountMap = productCounts.reduce((acc, pc) => {
        if(pc.categoryId) {
            acc[pc.categoryId] = pc.count;
        }
        return acc;
    }, {} as Record<string, number>);

    // Combine the data
    const categoriesWithDetails = categoriesData.map(category => ({
      ...category,
      subcategories: subcategoriesMap[category.id] || [],
      _count: {
        products: productCountMap[category.id] || 0
      }
    }));

    return NextResponse.json(categoriesWithDetails)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/admin/categories - Create new category
export async function POST(request: NextRequest) {
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

    // Check if slug already exists
    const existingCategory = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, slug))
      .limit(1)

    if (existingCategory[0]) {
      return NextResponse.json({ error: 'Category name already exists' }, { status: 400 })
    }

    // Create new category
    const newCategory = await db
      .insert(categories)
      .values({
        name: name.trim(),
        slug,
        description: description?.trim() || null,
        image: image || null,
        isActive: isActive !== undefined ? isActive : true
      })
      .returning()

    revalidatePath('/')
    revalidatePath('/categories')
    revalidatePath('/admin/categories')

    return NextResponse.json(newCategory[0], { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
