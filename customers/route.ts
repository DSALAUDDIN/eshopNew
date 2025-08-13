export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/prisma'
import { users, orders } from '@/lib/db/schema'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'
import { eq, and, like, desc, count } from 'drizzle-orm'

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

// GET /api/admin/customers - Get all customers with pagination
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAdmin(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''

    const offset = (page - 1) * limit

    // Build where conditions
    const conditions = []

    if (search) {
      conditions.push(like(users.name, `%${search}%`))
    }

    // Get customers with their order counts
    const customersData = await db.select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      isTradeCustomer: users.isTradeCustomer,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt
    })
    .from(users)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(users.createdAt))
    .limit(limit)
    .offset(offset)

    // Get order counts for each customer
    const customersWithOrderCounts = await Promise.all(
      customersData.map(async (customer) => {
        const orderCount = await db.select({ count: count() })
          .from(orders)
          .where(eq(orders.userId, customer.id))

        return {
          ...customer,
          _count: {
            orders: orderCount[0]?.count || 0
          }
        }
      })
    )

    // Get total count
    const totalCount = await db.select({ count: count() })
      .from(users)
      .where(conditions.length > 0 ? and(...conditions) : undefined)

    const total = totalCount[0]?.count || 0
    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      customers: customersWithOrderCounts,
      pagination: {
        currentPage: page,
        totalPages,
        totalCustomers: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    })
  } catch (error) {
    console.error('Error fetching admin customers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    )
  }
}
