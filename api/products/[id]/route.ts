import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/prisma'
import { products, categories, subcategories, reviews, users } from '@/lib/db/schema'
import { eq, and, desc, ne } from 'drizzle-orm'

// GET /api/products/[id] - Get single product for frontend
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const productId = params.id

    // Get product with category, subcategory, and approved reviews
    const productData = await db.select({
      product: products,
      category: {
        id: categories.id,
        name: categories.name,
        slug: categories.slug
      },
      subcategory: {
        id: subcategories.id,
        name: subcategories.name,
        slug: subcategories.slug
      }
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .leftJoin(subcategories, eq(products.subcategoryId, subcategories.id))
    .where(and(
      eq(products.id, productId),
      eq(products.isActive, true)
    ))
    .limit(1)

    if (!productData.length) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    const product = productData[0]

    // Get approved reviews for this product
    const productReviews = await db.select({
      review: reviews,
      user: {
        name: users.name
      }
    })
    .from(reviews)
    .leftJoin(users, eq(reviews.userId, users.id))
    .where(and(
      eq(reviews.productId, productId),
      eq(reviews.isApproved, true)
    ))
    .orderBy(desc(reviews.createdAt))

    // Fetch related products
    let relatedProductsData = [];
    if (product.product.categoryId) {
        relatedProductsData = await db.select()
            .from(products)
            .where(and(
                eq(products.categoryId, product.product.categoryId),
                ne(products.id, product.product.id),
                eq(products.isActive, true)
            ))
            .limit(4)
            .orderBy(desc(products.createdAt));
    }

    const formattedRelatedProducts = relatedProductsData.map(p => ({
        ...p,
        images: p.images ? JSON.parse(p.images) : []
    }));

    // Format the response to match the expected structure
    const formattedProduct = {
      ...product.product,
      images: product.product.images ? JSON.parse(product.product.images) : [],
      category: product.category,
      subcategory: product.subcategory,
      reviews: productReviews.map(r => ({
        ...r.review,
        user: r.user
      })),
      relatedProducts: formattedRelatedProducts
    }

    return NextResponse.json(formattedProduct)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}
