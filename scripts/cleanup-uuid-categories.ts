import { db } from '@/lib/prisma'
import { categories, subcategories, products } from '@/lib/db/schema'
import { eq, sql } from 'drizzle-orm'

async function cleanupUUIDCategories() {
  try {
    console.log('🧹 Cleaning up all UUID-named categories...')

    // Find all categories with UUID-like names (all uppercase, long strings)
    const allCategories = await db.select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug
    }).from(categories)

    // Filter categories that look like UUIDs (all uppercase, long, alphanumeric)
    const uuidCategories = allCategories.filter(cat =>
      cat.name.match(/^[A-Z0-9]{25,}$/) || // Long uppercase alphanumeric strings
      cat.slug.match(/^[a-z0-9]{25,}$/)    // Long lowercase alphanumeric strings
    )

    console.log(`Found ${uuidCategories.length} UUID-like categories to delete`)

    if (uuidCategories.length === 0) {
      console.log('✅ No UUID categories found to delete')
      return
    }

    // Delete each UUID category
    for (const category of uuidCategories) {
      console.log(`\n🗑️ Deleting category: ${category.name}`)

      // Delete products first (cascade should handle this but being explicit)
      await db.delete(products).where(eq(products.categoryId, category.id))
      console.log(`  ✅ Deleted products`)

      // Delete subcategories (cascade should handle this but being explicit)
      await db.delete(subcategories).where(eq(subcategories.categoryId, category.id))
      console.log(`  ✅ Deleted subcategories`)

      // Delete the category
      await db.delete(categories).where(eq(categories.id, category.id))
      console.log(`  ✅ Category ${category.name} deleted`)
    }

    // Show final remaining categories
    const remainingCategories = await db.select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug
    }).from(categories)

    console.log('\n📋 Final remaining categories:')
    remainingCategories.forEach(cat => {
      console.log(`  ${cat.name} (${cat.slug})`)
    })

    console.log('\n🎉 Cleanup completed successfully!')

  } catch (error) {
    console.error('❌ Error during cleanup:', error)
  }
}

cleanupUUIDCategories()
