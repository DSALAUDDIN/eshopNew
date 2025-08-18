export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/prisma'
import { users, orders, products, reviews } from '@/lib/db/schema'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'
import { eq, and, count, sum, gte, desc } from 'drizzle-orm'

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

// GET /api/admin/dashboard - Get dashboard statistics
export async function GET(request: NextRequest) {
  try {
    const user = await verifyAdmin(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get current date for filtering
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    // Get total counts
    const [
      totalProductsResult,
      totalOrdersResult,
      totalCustomersResult,
      monthlyOrdersResult,
      monthlyRevenueResult
    ] = await Promise.all([
      // Total products
      db.select({ count: count() }).from(products).where(eq(products.isActive, true)),

      // Total orders
      db.select({ count: count() }).from(orders),

      // Total customers
      db.select({ count: count() }).from(users),

      // Monthly orders
      db.select({ count: count() })
        .from(orders)
        .where(gte(orders.createdAt, startOfMonth)),

      // Monthly revenue
      db.select({ total: sum(orders.totalAmount) })
        .from(orders)
        .where(and(
          gte(orders.createdAt, startOfMonth),
          eq(orders.paymentStatus, 'PAID')
        ))
    ])

    // Get recent orders
    const recentOrders = await db.select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      customerName: orders.customerName,
      customerEmail: orders.customerEmail,
      totalAmount: orders.totalAmount,
      status: orders.status,
      createdAt: orders.createdAt
    })
    .from(orders)
    .orderBy(desc(orders.createdAt))
    .limit(5)

    // Get low stock products
    const lowStockProducts = await db.select({
      id: products.id,
      name: products.name,
      stockQuantity: products.stockQuantity,
      price: products.price
    })
    .from(products)
    .where(and(
      eq(products.isActive, true),
      eq(products.inStock, true)
    ))
    .orderBy(products.stockQuantity)
    .limit(5)

    // Calculate statistics
    const stats = {
      overview: {
        totalProducts: totalProductsResult[0]?.count || 0,
        totalOrders: totalOrdersResult[0]?.count || 0,
        totalCustomers: totalCustomersResult[0]?.count || 0,
        totalRevenue: 0, // We'll calculate this from paid orders
        monthlyOrders: monthlyOrdersResult[0]?.count || 0,
        monthlyRevenue: monthlyRevenueResult[0]?.total || 0,
        orderGrowth: 0, // For now, we'll set to 0 - can be calculated later
        revenueGrowth: 0 // For now, we'll set to 0 - can be calculated later
      },
      recentOrders,
      topProducts: [], // Add empty array for now
      lowStockProducts,
      orderStatusStats: {} // Add empty object for now
    }

    // Calculate total revenue from all paid orders
    const totalRevenueResult = await db.select({ total: sum(orders.totalAmount) })
      .from(orders)
      .where(eq(orders.paymentStatus, 'PAID'))

    stats.overview.totalRevenue = Number(totalRevenueResult[0]?.total || 0)
    stats.overview.monthlyRevenue = Number(stats.overview.monthlyRevenue)

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}
