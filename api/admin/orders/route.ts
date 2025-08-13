export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/prisma'
import { users, orders, orderItems, products } from '@/lib/db/schema'
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

// GET /api/admin/orders - Get all orders with pagination
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
    const status = searchParams.get('status') || ''

    const offset = (page - 1) * limit

    // Build where conditions
    const conditions = []

    if (search) {
      conditions.push(like(orders.customerName, `%${search}%`))
    }

    if (status) {
      conditions.push(eq(orders.status, status))
    }

    // Get orders with order items and products
    const ordersData = await db.select({
      order: orders,
      orderItem: orderItems,
      product: {
        id: products.id,
        name: products.name,
        images: products.images,
        price: products.price
      }
    })
    .from(orders)
    .leftJoin(orderItems, eq(orders.id, orderItems.orderId))
    .leftJoin(products, eq(orderItems.productId, products.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(orders.createdAt))
    .limit(limit)
    .offset(offset)

    // Get total count
    const totalCount = await db.select({ count: count() })
      .from(orders)
      .where(conditions.length > 0 ? and(...conditions) : undefined)

    const total = totalCount[0]?.count || 0
    const totalPages = Math.ceil(total / limit)

    // Group orders and their items
    const groupedOrders = ordersData.reduce((acc, row) => {
      const orderId = row.order.id
      if (!acc[orderId]) {
        acc[orderId] = {
          ...row.order,
          orderItems: []
        }
      }
      if (row.orderItem && row.product) {
        acc[orderId].orderItems.push({
          ...row.orderItem,
          product: row.product
        })
      }
      return acc
    }, {} as any)

    const formattedOrders = Object.values(groupedOrders)

    return NextResponse.json({
      orders: formattedOrders,
      pagination: {
        currentPage: page,
        totalPages,
        totalOrders: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    })
  } catch (error) {
    console.error('Error fetching admin orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
