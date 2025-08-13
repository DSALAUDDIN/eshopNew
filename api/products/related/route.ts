import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/products/related - Get related products by category
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const excludeId = searchParams.get('excludeId')
    const limit = parseInt(searchParams.get('limit') || '8')

    if (!category) {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 })
    }

    const where: any = {
      isActive: true,
      inStock: true,
      category: {
        slug: category
      }
    }

    if (excludeId) {
      where.id = {
        not: parseInt(excludeId)
      }
    }

    const products = await prisma.product.findMany({
      where,
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
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching related products:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
