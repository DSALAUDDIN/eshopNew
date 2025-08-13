const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function debugOrders() {
  try {
    console.log('=== Debugging Order Statistics ===\n');
    
    // Get all orders with their status and amounts
    const allOrders = await prisma.order.findMany({
      select: {
        id: true,
        orderNumber: true,
        status: true,
        paymentStatus: true,
        totalAmount: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log('All Orders:');
    console.log(`Total found: ${allOrders.length}`);
    allOrders.forEach(order => {
      console.log(`- Order ${order.orderNumber}: Status=${order.status}, Payment=${order.paymentStatus}, Amount=৳${order.totalAmount}, Date=${order.createdAt.toLocaleDateString()}`);
    });
    
    console.log('\n=== Statistics ===');
    
    // Count by status
    const statusCounts = await prisma.order.groupBy({
      by: ['status'],
      _count: { status: true },
      _sum: { totalAmount: true }
    });
    
    console.log('\nOrders by Status:');
    statusCounts.forEach(stat => {
      console.log(`- ${stat.status}: ${stat._count.status} orders, Total: ৳${stat._sum.totalAmount || 0}`);
    });
    
    // Total all orders
    const totalAll = await prisma.order.count();
    const revenueAll = await prisma.order.aggregate({
      _sum: { totalAmount: true }
    });
    
    console.log(`\nAll Orders: ${totalAll}, Total Revenue: ৳${revenueAll._sum.totalAmount || 0}`);
    
    // Total excluding cancelled/refunded
    const totalExcluding = await prisma.order.count({
      where: {
        status: {
          notIn: ['CANCELLED', 'REFUNDED']
        }
      }
    });
    
    const revenueExcluding = await prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: {
        paymentStatus: 'PAID',
        status: {
          notIn: ['CANCELLED', 'REFUNDED']
        }
      }
    });
    
    console.log(`\nExcluding Cancelled/Refunded Orders: ${totalExcluding}, Revenue: ৳${revenueExcluding._sum.totalAmount || 0}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugOrders();
