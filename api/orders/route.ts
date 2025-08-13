import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/prisma'
import { orders, orderItems, products, users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

// Generate unique order number
function generateOrderNumber(): string {
  const timestamp = Date.now().toString()
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `SFD${timestamp.slice(-6)}${random}`
}

// POST /api/orders - Create new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      customerName,
      customerEmail,
      customerPhone,
      items,
      subtotal,
      shippingAmount,
      totalAmount,
      billingAddress,
      shippingAddress,
      paymentMethod,
      deliveryMethod,
      notes
    } = body

    // Validate required fields
    if (!customerName || !customerEmail || !customerPhone || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required order information' },
        { status: 400 }
      )
    }

    // Generate unique order number
    const orderNumber = generateOrderNumber()

    // Create order in database
    const order = await db.insert(orders).values({
      orderNumber,
      customerEmail,
      customerName,
      customerPhone,
      totalAmount,
      shippingAmount,
      paymentMethod,
      status: 'PENDING', // Orders start as pending for admin approval
      paymentStatus: paymentMethod === 'cod' ? 'PENDING' : 'PENDING',
      shippingAddress: JSON.stringify(shippingAddress),
      billingAddress: JSON.stringify(billingAddress),
      notes: notes || null
    }).returning()

    const orderId = order[0].id

    // Create order items in database
    const orderItemsData = items.map((item: any) => ({
      orderId: orderId,
      productId: item.productId,
      quantity: item.quantity,
      price: item.price
    }))

    await db.insert(orderItems).values(orderItemsData)

    // In a real application, you would:
    // 1. Send confirmation email to customer
    // 2. Send notification to admin
    // 3. Update inventory
    // 4. Log the order for analytics

    return NextResponse.json({
      success: true,
      order: {
        id: orderId,
        orderNumber: orderNumber,
        status: 'PENDING',
        totalAmount: totalAmount,
        customerName: customerName,
        customerEmail: customerEmail
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order. Please try again.' },
      { status: 500 }
    )
  }
}

// GET /api/orders - Get orders (for admin or user)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')

    let whereClause: any = {}

    // If email is provided, filter by customer email
    if (email) {
      whereClause.customerEmail = email
    }

    // If status is provided, filter by status
    if (status) {
      whereClause.status = status
    }

    const ordersData = await db.select().from(orders)
      .innerJoin(orderItems, eq(orders.id, orderItems.orderId))
      .innerJoin(products, eq(orderItems.productId, products.id))
      .where(whereClause)
      .limit(limit)
      .execute()

    return NextResponse.json(ordersData)

  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}
