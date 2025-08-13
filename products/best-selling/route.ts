import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/products/best-selling - Get best selling products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '8')

    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        inStock: true,
        OR: [
          { isFeatured: true },
          { isSale: true },
          { salesCount: { gt: 0 } } // Assuming you have a salesCount field
        ]
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        subcategory: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        images: {
          select: {
            id: true,
            url: true,
            alt: true,
            isPrimary: true
          }
        },
        reviews: {
          select: {
            id: true,
            rating: true,
            comment: true,
            customerName: true,
            createdAt: true
          }
        }
      },
      take: limit,
      orderBy: [
        { isFeatured: 'desc' },
        { salesCount: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching best selling products:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
