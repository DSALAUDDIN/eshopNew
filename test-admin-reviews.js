const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testAdminReviewsAPI() {
  try {
    console.log('=== Testing Admin Reviews API Logic ===\n');
    
    // Test the same query that the admin API uses
    console.log('Testing PENDING reviews query:');
    const pendingReviews = await prisma.review.findMany({
      where: { isApproved: false },
      include: {
        product: {
          select: { name: true, id: true }
        },
        user: {
          select: { name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log(`Found ${pendingReviews.length} pending reviews`);
    pendingReviews.forEach(review => {
      console.log(`- ${review.customerName}: ${review.rating}★ for ${review.product?.name}`);
    });
    
    console.log('\nTesting APPROVED reviews query:');
    const approvedReviews = await prisma.review.findMany({
      where: { isApproved: true },
      include: {
        product: {
          select: { name: true, id: true }
        },
        user: {
          select: { name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log(`Found ${approvedReviews.length} approved reviews`);
    approvedReviews.forEach(review => {
      console.log(`- ${review.customerName}: ${review.rating}★ for ${review.product?.name}`);
    });
    
    console.log('\nTesting ALL reviews query:');
    const allReviews = await prisma.review.findMany({
      include: {
        product: {
          select: { name: true, id: true }
        },
        user: {
          select: { name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log(`Found ${allReviews.length} total reviews`);
    allReviews.forEach(review => {
      console.log(`- ${review.customerName}: ${review.rating}★ for ${review.product?.name} (${review.isApproved ? 'APPROVED' : 'PENDING'})`);
    });
    
  } catch (error) {
    console.error('Error testing admin API queries:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAdminReviewsAPI();
