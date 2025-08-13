import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'

async function verifyAdmin(request: NextRequest) {
  const token = getTokenFromRequest(request)
  if (!token) {
    return null
  }

  const decoded = verifyToken(token) as any
  if (!decoded) {
    return null
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId }
  })

  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    return null
  }

  return user
}

// GET /api/admin/customers/[id] - Get single customer with details
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await verifyAdmin(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const customer = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        orders: {
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        reviews: {
          include: {
            product: {
              select: { name: true }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        _count: {
          select: {
            orders: true,
            reviews: true
          }
        }
      }
    })

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    // Remove password from response
    const { password, ...customerData } = customer

    return NextResponse.json(customerData)
  } catch (error) {
    console.error('Error fetching customer:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/admin/customers/[id] - Update customer
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await verifyAdmin(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, email, role, isTradeCustomer } = await request.json()

    const customer = await prisma.user.update({
      where: { id: params.id },
      data: {
        name,
        email,
        role: role as any,
        isTradeCustomer: Boolean(isTradeCustomer),
        updatedAt: new Date()
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isTradeCustomer: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return NextResponse.json(customer)
  } catch (error) {
    console.error('Error updating customer:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/admin/customers/[id] - Delete customer
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await verifyAdmin(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if customer has orders
    const customerWithOrders = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: { orders: true }
        }
      }
    })

    if (!customerWithOrders) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    if (customerWithOrders._count.orders > 0) {
      return NextResponse.json({
        error: 'Cannot delete customer with existing orders. Consider deactivating instead.'
      }, { status: 400 })
    }

    await prisma.user.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Customer deleted successfully' })
  } catch (error) {
    console.error('Error deleting customer:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
