import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function deleteCategory() {
  try {
    console.log('🗑️ Deleting category with ID: cmdvfd34n0001uc68w4uymv2m')

    // First, check what's associated with this category
    const category = await prisma.category.findUnique({
      where: { id: 'cmdvfd34n0001uc68w4uymv2m' },
      include: {
        products: true,
        subcategories: true
      }
    })

    if (!category) {
      console.log('ℹ️ Category not found - it may have already been deleted')
      return
    }

    console.log(`Found category: ${category.name} with ${category.products.length} products and ${category.subcategories.length} subcategories`)

    // Delete all products in this category first
    if (category.products.length > 0) {
      await prisma.product.deleteMany({
        where: { categoryId: 'cmdvfd34n0001uc68w4uymv2m' }
      })
      console.log(`✅ Deleted ${category.products.length} products`)
    }

    // Then delete all subcategories
    if (category.subcategories.length > 0) {
      await prisma.subcategory.deleteMany({
        where: { categoryId: 'cmdvfd34n0001uc68w4uymv2m' }
      })
      console.log(`✅ Deleted ${category.subcategories.length} subcategories`)
    }

    // Finally delete the category
    await prisma.category.delete({
      where: { id: 'cmdvfd34n0001uc68w4uymv2m' }
    })
    console.log('✅ Category deleted successfully')

    // Show remaining categories
    const remainingCategories = await prisma.category.findMany({
      include: { subcategories: true }
    })

    console.log('\n📋 Remaining categories:')
    remainingCategories.forEach(cat => {
      console.log(`  ${cat.name} (${cat.slug}) - ${cat.subcategories.length} subcategories`)
    })

  } catch (error) {
    console.error('❌ Error deleting category:', error)
  } finally {
    await prisma.$disconnect()
  }
}

deleteCategory()
