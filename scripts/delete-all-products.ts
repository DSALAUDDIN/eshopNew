import { PrismaClient } from '@prisma/client';

// Initialize Prisma Client with the direct path to the database
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'file:../prisma/dev.db',
    },
  },
});

async function main() {
  console.log('Starting deletion process...');

  // 1. Delete all OrderItem records
  await prisma.orderItem.deleteMany({});
  console.log('All OrderItems have been deleted.');

  // 2. Delete all Review records
  await prisma.review.deleteMany({});
  console.log('All Reviews have been deleted.');

  // 3. Delete all Product records
  await prisma.product.deleteMany({});
  console.log('All Products have been deleted.');

  console.log('Deletion process completed successfully.');
}

main()
  .catch((e) => {
    console.error('An error occurred during the deletion process:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
