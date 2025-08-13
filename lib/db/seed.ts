import { db } from '@/lib/prisma'
import { users, categories, subcategories, products } from '@/lib/db/schema'
import { hashPassword } from '@/lib/auth'
import { eq } from 'drizzle-orm'

async function main() {
  console.log('🌱 Starting database seed...')

  // 1. Create admin user
  const adminPassword = await hashPassword('admin123')
  
  // Check if admin already exists
  const existingAdmin = await db.select().from(users).where(eq(users.email, 'admin@southernfashiondecor.com')).limit(1)
  
  let admin
  if (existingAdmin.length === 0) {
    const [newAdmin] = await db.insert(users).values({
      email: 'admin@southernfashiondecor.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'SUPER_ADMIN',
    }).returning()
    admin = newAdmin
  } else {
    admin = existingAdmin[0]
  }
  console.log('✅ Admin user created:', admin.email)

  // 2. Categories and subcategories data
  const categoriesData = [
    {
      name: 'FASHION',
      slug: 'fashion',
      description: 'Trendy fashion items for all ages',
      subcategories: [
        { name: "MEN'S", slug: 'mens' },
        { name: "WOMEN'S", slug: 'womens' },
        { name: 'KIDS', slug: 'kids' },
        { name: 'TRENDY', slug: 'trendy' },
        { name: 'MIXED', slug: 'mixed' }
      ]
    },
    {
      name: 'DÉCOR',
      slug: 'decor',
      description: 'Beautiful home decoration items',
      subcategories: [
        { name: 'ROOM DÉCOR', slug: 'room-decor' },
        { name: 'KITCHEN & DINING', slug: 'kitchen-dining' },
        { name: 'PHOTO FRAME', slug: 'photo-frame' },
        { name: 'BASKETS', slug: 'baskets' },
        { name: 'VASES', slug: 'vases' },
        { name: 'PLACEMAT & COASTER', slug: 'placemat-coaster' },
        { name: 'CUSHION & BLANKETS', slug: 'cushion-blankets' },
        { name: 'BED SHEETS & PILLOW', slug: 'bed-sheets-pillow' },
        { name: 'RUGS & BATH MATS', slug: 'rugs-bath-mats' },
        { name: 'TABLEWARE', slug: 'tableware' },
        { name: 'SUSTAINABLE ITEMS', slug: 'sustainable-items' },
        { name: 'MIXED', slug: 'mixed-decor' },
        { name: 'STORAGE', slug: 'storage' },
        { name: 'WALL DÉCOR', slug: 'wall-decor' }
      ]
    },
    {
      name: 'FURNITURE',
      slug: 'furniture',
      description: 'Quality furniture for every space',
      subcategories: [
        { name: 'BEDROOMS', slug: 'bedrooms' },
        { name: 'DINING ROOMS', slug: 'dining-rooms' },
        { name: 'LIVING ROOMS', slug: 'living-rooms' },
        { name: 'OCCASIONALS', slug: 'occasionals' },
        { name: 'ACCENTS', slug: 'accents' },
        { name: 'INDOOR', slug: 'indoor' },
        { name: 'OUTDOOR', slug: 'outdoor' },
        { name: 'HOTEL FURNITURE', slug: 'hotel-furniture' },
        { name: 'ACCESSORIES', slug: 'accessories' },
        { name: 'STUDY ITEMS', slug: 'study-items' },
        { name: 'STORAGE', slug: 'storage-furniture' },
        { name: 'WALL DÉCOR', slug: 'wall-decor-furniture' },
        { name: 'HANGERS', slug: 'hangers' },
        { name: 'DESK ACCESSORIES', slug: 'desk-accessories' }
      ]
    },
    {
      name: 'FOOTWEAR',
      slug: 'footwear',
      description: 'Comfortable and stylish footwear',
      subcategories: [
        { name: "MEN'S", slug: 'mens-footwear' },
        { name: 'WOMENS', slug: 'womens-footwear' },
        { name: 'KIDS', slug: 'kids-footwear' },
        { name: 'OCCASIONAL', slug: 'occasional-footwear' }
      ]
    },
    {
      name: 'TOYS',
      slug: 'toys',
      description: 'Fun and educational toys for children',
      subcategories: [
        { name: 'KIDS', slug: 'kids-toys' },
        { name: 'OCCASIONAL', slug: 'occasional-toys' }
      ]
    },
    {
      name: 'CERAMICS',
      slug: 'ceramics',
      description: 'Beautiful ceramic items',
      subcategories: [
        { name: 'VASES', slug: 'ceramic-vases' },
        { name: 'BOWLS', slug: 'ceramic-bowls' },
        { name: 'PLATES', slug: 'ceramic-plates' }
      ]
    }
  ]

  // 3. Create categories and subcategories
  for (const categoryData of categoriesData) {
    // Check if category already exists
    const existingCategory = await db.select().from(categories).where(eq(categories.slug, categoryData.slug)).limit(1)
    
    let category
    if (existingCategory.length === 0) {
      const [newCategory] = await db.insert(categories).values({
        name: categoryData.name,
        slug: categoryData.slug,
        description: categoryData.description,
        isActive: true,
      }).returning()
      category = newCategory
      console.log(`✅ Category created: ${category.name}`)
    } else {
      category = existingCategory[0]
      console.log(`✅ Category exists: ${category.name}`)
    }

    // Create subcategories
    for (const subData of categoryData.subcategories) {
      const existingSubcategory = await db.select().from(subcategories)
        .where(eq(subcategories.slug, subData.slug)).limit(1)
      
      if (existingSubcategory.length === 0) {
        await db.insert(subcategories).values({
          name: subData.name,
          slug: subData.slug,
          categoryId: category.id,
          isActive: true,
        })
        console.log(`  ✅ Subcategory created: ${subData.name}`)
      } else {
        console.log(`  ✅ Subcategory exists: ${subData.name}`)
      }
    }
  }

  console.log('🎉 Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(() => {
    process.exit(0)
  })
