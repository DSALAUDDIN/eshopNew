const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function debugReviews() {
  try {
    console.log('=== Debugging Review System ===\n');
    
    // Check if any reviews exist in the database
    const allReviews = await prisma.review.findMany({
      include: {
        product: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log(`Total reviews in database: ${allReviews.length}\n`);
    
    if (allReviews.length > 0) {
      console.log('All Reviews:');
      allReviews.forEach(review => {
        console.log(`- ID: ${review.id}`);
        console.log(`  Product: ${review.product?.name || 'Unknown'}`);
        console.log(`  Customer: ${review.customerName}`);
        console.log(`  Rating: ${review.rating}/5`);
        console.log(`  Approved: ${review.isApproved ? 'YES' : 'NO'}`);
        console.log(`  Created: ${review.createdAt.toLocaleDateString()}`);
        console.log(`  Comment: ${review.comment.substring(0, 50)}...`);
        console.log('');
      });
    } else {
      console.log('No reviews found in database');
    }
    
    // Check pending reviews
    const pendingReviews = await prisma.review.findMany({
      where: { isApproved: false },
      include: {
        product: {
          select: { name: true }
        }
      }
    });
    
    console.log(`Pending reviews (need approval): ${pendingReviews.length}`);
    
    // Check approved reviews
    const approvedReviews = await prisma.review.findMany({
      where: { isApproved: true },
      include: {
        product: {
          select: { name: true }
        }
      }
    });
    
    console.log(`Approved reviews (visible to public): ${approvedReviews.length}`);
    
    // Check if products exist
    const productCount = await prisma.product.count();
    console.log(`\nTotal products in database: ${productCount}`);
    
  } catch (error) {
    console.error('Error debugging reviews:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugReviews();
