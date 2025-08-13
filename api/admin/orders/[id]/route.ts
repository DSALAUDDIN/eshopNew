import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/prisma'
import { orders, orderItems, products } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

// PUT /api/admin/orders/[id] - Update order (status, payment, notes)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { status, paymentStatus, notes } = body

    // Build update data object
    const updateData: any = {}
    if (status) updateData.status = status
    if (paymentStatus) updateData.paymentStatus = paymentStatus
    if (notes !== undefined) updateData.notes = notes

    const updatedOrder = await db.update(orders)
      .set(updateData)
      .where(eq(orders.id, params.id))
      .returning()

    if (!updatedOrder.length) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Get complete order with items and products
    const orderWithItems = await db.select({
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
    .where(eq(orders.id, params.id))

    return NextResponse.json(orderWithItems)
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    )
  }
}

// GET /api/admin/orders/[id] - Get single order details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderWithItems = await db.select({
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
    .where(eq(orders.id, params.id))

    if (!orderWithItems.length) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(orderWithItems)
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    )
  }
}
