import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function removeHomeDecorCategory() {
  try {
    console.log('🗑️ Looking for "Home Decor" category...')

    // Find the Home Decor category
    const homeDecorCategory = await prisma.category.findFirst({
      where: {
        OR: [
          { name: 'Home Decor' },
          { slug: 'home-decor' }
        ]
      },
      include: {
        products: true,
        subcategories: true
      }
    })

    if (!homeDecorCategory) {
      console.log('ℹ️ "Home Decor" category not found - it may have already been deleted')
      return
    }

    console.log(`Found category: "${homeDecorCategory.name}" (${homeDecorCategory.slug})`)
    console.log(`  - ${homeDecorCategory.products.length} products`)
    console.log(`  - ${homeDecorCategory.subcategories.length} subcategories`)

    // Delete all products in this category first
    if (homeDecorCategory.products.length > 0) {
      await prisma.product.deleteMany({
        where: { categoryId: homeDecorCategory.id }
      })
      console.log(`✅ Deleted ${homeDecorCategory.products.length} products`)
    }

    // Delete all subcategories
    if (homeDecorCategory.subcategories.length > 0) {
      await prisma.subcategory.deleteMany({
        where: { categoryId: homeDecorCategory.id }
      })
      console.log(`✅ Deleted ${homeDecorCategory.subcategories.length} subcategories`)
    }

    // Delete the category
    await prisma.category.delete({
      where: { id: homeDecorCategory.id }
    })
    console.log(`✅ "Home Decor" category deleted successfully`)

    // Show remaining categories
    const remainingCategories = await prisma.category.findMany({
      include: { subcategories: true },
      orderBy: { name: 'asc' }
    })

    console.log('\n📋 Remaining categories:')
    remainingCategories.forEach(cat => {
      console.log(`  ${cat.name} (${cat.slug}) - ${cat.subcategories.length} subcategories`)
    })

    console.log(`\n🎉 "Home Decor" category removed successfully!`)

  } catch (error) {
    console.error('❌ Error removing Home Decor category:', error)
  } finally {
    await prisma.$disconnect()
  }
}

removeHomeDecorCategory()
