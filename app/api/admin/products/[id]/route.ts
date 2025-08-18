import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/prisma'
import { products } from '@/lib/db/schema'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'
import { eq } from 'drizzle-orm'

async function verifyAdmin(request: NextRequest) {
  const token = getTokenFromRequest(request)
  if (!token) return null
  const decoded = verifyToken(token) as any
  if (!decoded) return null
  // You may want to check user role here as in your other route
  return decoded
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const product = await db.select().from(products).where(eq(products.id, id));

    if (product.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ product: product[0] });
  } catch (error: any) {
    console.error(`Error fetching product ${params.id}:`, error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await verifyAdmin(request)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const id = params.id
    const data = await request.json()
    console.log('Update product request data:', data)

    // Validate required fields
    const requiredFields = [
      'name', 'slug', 'description', 'price', 'sku', 'images', 'inStock', 'stockQuantity',
      'isNew', 'isSale', 'isFeatured', 'isActive', 'categoryId', 'updatedAt'
    ]
    for (const field of requiredFields) {
      if (data[field] === undefined || data[field] === null || data[field] === '') {
        return NextResponse.json({ error: `Missing or invalid field: ${field}` }, { status: 400 })
      }
    }
    // Validate images is a string
    if (typeof data.images !== 'string') {
      return NextResponse.json({ error: 'Images must be a JSON string' }, { status: 400 })
    }
    // Validate booleans are 0/1
    const boolFields = ['isNew', 'isSale', 'isFeatured', 'isActive', 'inStock']
    for (const field of boolFields) {
      if (data[field] !== 0 && data[field] !== 1) {
        return NextResponse.json({ error: `Field ${field} must be 0 or 1` }, { status: 400 })
      }
    }
    // Validate price and stockQuantity are numbers
    if (isNaN(Number(data.price)) || isNaN(Number(data.stockQuantity))) {
      return NextResponse.json({ error: 'Price and stockQuantity must be numbers' }, { status: 400 })
    }
    // Ensure createdAt and updatedAt are Date objects
    const fixDate = (val: any) => {
      if (val instanceof Date) return val;
      if (typeof val === 'number') return new Date(val * 1000);
      if (typeof val === 'string' && /^\d+$/.test(val)) return new Date(Number(val) * 1000);
      return new Date(val);
    };
    data.createdAt = fixDate(data.createdAt);
    data.updatedAt = fixDate(data.updatedAt);
    const updated = await db.update(products).set(data).where(eq(products.id, id)).returning()
    if (!updated[0]) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    return NextResponse.json({ product: updated[0] })
  } catch (error: any) {
    console.error('Error updating product:', error)
    if (error && error.stack) {
      console.error('Error stack:', error.stack)
    }
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await verifyAdmin(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = params.id;

    const deleted = await db.delete(products).where(eq(products.id, id)).returning();

    if (deleted.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product deleted successfully' });

  } catch (error: any) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
