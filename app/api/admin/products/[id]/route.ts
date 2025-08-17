import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/prisma'
import { products, categories } from '@/lib/db/schema'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { prepareProductData } from '../product-logic'

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

    const preparedData = await prepareProductData(data, id);

    const updated = await db.update(products).set(preparedData).where(eq(products.id, id)).returning()

    if (!updated[0]) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Revalidate paths to show updated data
    revalidatePath('/') // Revalidate home page
    revalidatePath(`/product/${updated[0].slug}`) // Revalidate product page

    // Revalidate the category page if the product has one
    if (updated[0].categoryId) {
        const category = await db.select().from(categories).where(eq(categories.id, updated[0].categoryId));
        if (category[0]) {
            revalidatePath(`/category/${category[0].slug}`)
        }
    }

    return NextResponse.json({ product: updated[0] })
  } catch (error: any) {
    console.error('Error updating product:', error)

    if (error.message?.includes('UNIQUE constraint failed')) {
        return NextResponse.json({ error: 'A product with this slug already exists. Please try a different name.' }, { status: 409 });
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

    // Revalidate paths after deletion
    revalidatePath('/')
    if (deleted[0].categoryId) {
        const category = await db.select().from(categories).where(eq(categories.id, deleted[0].categoryId));
        if (category[0]) {
            revalidatePath(`/category/${category[0].slug}`)
        }
    }

    return NextResponse.json({ message: 'Product deleted successfully' });

  } catch (error: any) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
