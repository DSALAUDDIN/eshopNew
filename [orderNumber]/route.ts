import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { orders, orderItems, products } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

// GET /api/orders/[orderNumber] - Get specific order details
export async function GET(
  request: NextRequest,
  { params }: { params: { orderNumber: string } }
) {
  try {
    const order = await db.query.orders.findFirst({
      where: eq(orders.orderNumber, params.orderNumber),
      with: {
        orderItems: {
          with: {
            product: {
              columns: {
                id: true,
                name: true,
                images: true,
                price: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(order)

  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json(
      { error: 'Failed to fetch order details' },
      { status: 500 }
    )
  }
}
