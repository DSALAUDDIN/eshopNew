import { PrismaClient } from '@prisma/client'
import { hashPassword } from '@/lib/auth'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // 1. Create admin user
  const adminPassword = await hashPassword('admin123')
  const admin = await prisma.user.upsert({
    where: { email: 'admin@southernfashiondecor.com' },
    update: {},
    create: {
      email: 'admin@southernfashiondecor.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'SUPER_ADMIN', // String (was enum)
    },
  })
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
      description: 'Beautiful ceramic items for your home',
      subcategories: [
        { name: 'TABLEWARES', slug: 'tablewares' },
        { name: 'KITCHENWARES', slug: 'kitchenwares' },
        { name: 'OCCASIONAL', slug: 'occasional-ceramics' }
      ]
    },
    {
      name: 'LEATHER',
      slug: 'leather',
      description: 'Premium leather goods and accessories',
      subcategories: [
        { name: "MEN'S", slug: 'mens-leather' },
        { name: "WOMEN'S", slug: 'womens-leather' },
        { name: 'KIDS', slug: 'kids-leather' },
        { name: 'ACCESSORIES', slug: 'accessories-leather' },
        { name: 'OCCASIONAL', slug: 'occasional-leather' }
      ]
    },
    {
      name: 'BAGS',
      slug: 'bags',
      description: 'Stylish and functional bags for every occasion',
      subcategories: [
        { name: 'OFFICIAL', slug: 'official' },
        { name: 'TRAVEL', slug: 'travel' },
        { name: 'EVENT', slug: 'event' },
        { name: 'OCCASIONAL', slug: 'occasional-bags' },
        { name: 'STORAGE', slug: 'storage-bags' },
        { name: 'SHOPPING', slug: 'shopping' },
        { name: 'GIFT', slug: 'gift' },
        { name: 'PROMOTIONAL', slug: 'promotional' }
      ]
    },
    {
      name: 'OTHERS',
      slug: 'others',
      description: 'Miscellaneous items and special collections',
      subcategories: [
        { name: 'PETS', slug: 'pets' },
        { name: 'BIRD', slug: 'bird' }
      ]
    }
  ]

  // 3. Create categories and subcategories
  for (const categoryData of categoriesData) {
    const { subcategories, ...categoryInfo } = categoryData

    console.log(`Creating category: ${categoryInfo.name}`)

    const category = await prisma.category.upsert({
      where: { slug: categoryInfo.slug },
      update: categoryInfo,
      create: categoryInfo
    })

    // Create subcategories
    for (const subcat of subcategories) {
      console.log(`  Creating subcategory: ${subcat.name}`)

      await prisma.subcategory.upsert({
        where: {
          categoryId_slug: {
            categoryId: category.id,
            slug: subcat.slug
          }
        },
        update: {
          name: subcat.name,
          slug: subcat.slug
        },
        create: {
          name: subcat.name,
          slug: subcat.slug,
          categoryId: category.id
        }
      })
    }
  }

  console.log('✅ Database seeding completed successfully!')
  console.log('📊 Created categories:')

  const allCategories = await prisma.category.findMany({
    include: {
      subcategories: true
    }
  })

  allCategories.forEach(cat => {
    console.log(`  ${cat.name} (${cat.subcategories.length} subcategories)`)
  })
}

main()
    .catch((e) => {
      console.error('❌ Error seeding database:', e)
      process.exit(1)
    })
    .finally(async () => {
      await prisma.$disconnect()
    })
