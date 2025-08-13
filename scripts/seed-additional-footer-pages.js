const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const additionalFooterPages = [
  {
    title: 'Lookbook',
    slug: 'lookbook',
    content: `
      <div class="max-w-4xl mx-auto">
        <h2 class="text-2xl font-bold mb-6">Our Lookbook</h2>
        <div class="space-y-8">
          <section>
            <h3 class="text-xl font-semibold mb-4">Latest Collections</h3>
            <p class="mb-4">Discover our latest fashion and home décor collections featuring carefully curated pieces that blend traditional craftsmanship with contemporary design.</p>
            
            <div class="grid md:grid-cols-2 gap-6 mt-6">
              <div class="border p-4 rounded-lg">
                <h4 class="font-medium mb-2">Fashion Collection</h4>
                <p class="text-sm text-gray-600">Explore our latest fashion pieces that celebrate both comfort and style.</p>
              </div>
              <div class="border p-4 rounded-lg">
                <h4 class="font-medium mb-2">Home Décor Collection</h4>
                <p class="text-sm text-gray-600">Transform your space with our beautiful home décor accessories and furnishings.</p>
              </div>
            </div>
          </section>
          
          <section>
            <h3 class="text-xl font-semibold mb-4">Style Inspiration</h3>
            <p>Get inspired by our styling tips and see how our pieces can be incorporated into your daily life and living spaces.</p>
          </section>
        </div>
      </div>
    `,
    metaTitle: 'Lookbook | Southern Fashion & Decor',
    metaDescription: 'Browse our latest fashion and home décor collections. Get style inspiration and discover how to incorporate our pieces into your life.',
    sortOrder: 10
  },
  {
    title: 'Trade Shows',
    slug: 'trade-shows',
    content: `
      <div class="max-w-4xl mx-auto">
        <h2 class="text-2xl font-bold mb-6">Trade Shows & Events</h2>
        <div class="space-y-8">
          <section>
            <h3 class="text-xl font-semibold mb-4">Upcoming Events</h3>
            <p class="mb-4">Join us at various trade shows and exhibitions throughout the year where we showcase our latest collections and connect with industry professionals.</p>
            
            <div class="space-y-4">
              <div class="border-l-4 border-blue-500 pl-4">
                <h4 class="font-medium">Bangladesh Fashion Week</h4>
                <p class="text-sm text-gray-600">Annual showcase of the latest fashion trends</p>
                <p class="text-sm text-gray-500">Location: Dhaka | Date: TBA</p>
              </div>
              
              <div class="border-l-4 border-green-500 pl-4">
                <h4 class="font-medium">Home & Décor Expo</h4>
                <p class="text-sm text-gray-600">Exhibition featuring home decoration and lifestyle products</p>
                <p class="text-sm text-gray-500">Location: Dhaka | Date: TBA</p>
              </div>
            </div>
          </section>
          
          <section>
            <h3 class="text-xl font-semibold mb-4">Partnership Opportunities</h3>
            <p>Interested in partnering with us or featuring our products at your event? Contact us to discuss collaboration opportunities.</p>
          </section>
        </div>
      </div>
    `,
    metaTitle: 'Trade Shows & Events | Southern Fashion & Decor',
    metaDescription: 'Join us at trade shows and exhibitions. Learn about our upcoming events and partnership opportunities.',
    sortOrder: 11
  },
  {
    title: 'Ethical Policy',
    slug: 'ethics',
    content: `
      <div class="max-w-4xl mx-auto">
        <h2 class="text-2xl font-bold mb-6">Our Ethical Policy</h2>
        <div class="space-y-8">
          <section>
            <h3 class="text-xl font-semibold mb-4">Our Commitment</h3>
            <p class="mb-4">At Southern Fashion & Décor, we are committed to conducting our business with the highest ethical standards. We believe in fair trade, responsible sourcing, and supporting local communities.</p>
          </section>
          
          <section>
            <h3 class="text-xl font-semibold mb-4">Fair Trade Practices</h3>
            <ul class="space-y-2 list-disc list-inside">
              <li>We ensure fair wages for all our artisans and workers</li>
              <li>We maintain safe and healthy working conditions</li>
              <li>We support skill development and training programs</li>
              <li>We promote gender equality in our workplace</li>
            </ul>
          </section>
          
          <section>
            <h3 class="text-xl font-semibold mb-4">Responsible Sourcing</h3>
            <ul class="space-y-2 list-disc list-inside">
              <li>We source materials from certified and sustainable suppliers</li>
              <li>We prioritize local artisans and traditional craftsmanship</li>
              <li>We avoid materials that harm the environment</li>
              <li>We maintain transparency in our supply chain</li>
            </ul>
          </section>
          
          <section>
            <h3 class="text-xl font-semibold mb-4">Community Support</h3>
            <p>We actively support local communities through various initiatives including skill development programs, educational support, and community development projects.</p>
          </section>
        </div>
      </div>
    `,
    metaTitle: 'Ethical Policy | Southern Fashion & Decor',
    metaDescription: 'Learn about our commitment to ethical business practices, fair trade, responsible sourcing, and community support.',
    sortOrder: 12
  },
  {
    title: 'Sustainability Mission',
    slug: 'sustainability',
    content: `
      <div class="max-w-4xl mx-auto">
        <h2 class="text-2xl font-bold mb-6">Our Sustainability Mission</h2>
        <div class="space-y-8">
          <section>
            <h3 class="text-xl font-semibold mb-4">Environmental Responsibility</h3>
            <p class="mb-4">We are dedicated to minimizing our environmental impact through sustainable practices across all aspects of our business operations.</p>
          </section>
          
          <section>
            <h3 class="text-xl font-semibold mb-4">Sustainable Materials</h3>
            <ul class="space-y-2 list-disc list-inside">
              <li>We use eco-friendly and renewable materials whenever possible</li>
              <li>We prioritize organic and natural fibers</li>
              <li>We choose suppliers who share our sustainability values</li>
              <li>We minimize packaging waste and use recyclable materials</li>
            </ul>
          </section>
          
          <section>
            <h3 class="text-xl font-semibold mb-4">Carbon Footprint Reduction</h3>
            <ul class="space-y-2 list-disc list-inside">
              <li>We optimize transportation and logistics to reduce emissions</li>
              <li>We support local production to minimize shipping distances</li>
              <li>We implement energy-efficient practices in our operations</li>
              <li>We offset our carbon footprint through environmental projects</li>
            </ul>
          </section>
          
          <section>
            <h3 class="text-xl font-semibold mb-4">Circular Economy</h3>
            <p>We promote a circular economy by designing products for durability, encouraging repair and reuse, and implementing take-back programs for end-of-life products.</p>
          </section>
          
          <section>
            <h3 class="text-xl font-semibold mb-4">Future Goals</h3>
            <p>We are continuously working towards:</p>
            <ul class="space-y-2 list-disc list-inside mt-2">
              <li>Achieving carbon neutrality by 2030</li>
              <li>Using 100% sustainable materials by 2028</li>
              <li>Zero waste to landfill by 2027</li>
              <li>Supporting 1000+ local artisans by 2026</li>
            </ul>
          </section>
        </div>
      </div>
    `,
    metaTitle: 'Sustainability Mission | Southern Fashion & Decor',
    metaDescription: 'Discover our commitment to environmental responsibility, sustainable materials, and our goals for a more sustainable future.',
    sortOrder: 13
  }
]

async function seedAdditionalFooterPages() {
  console.log('Seeding additional footer pages...')

  try {
    for (const pageData of additionalFooterPages) {
      const existingPage = await prisma.footerPage.findUnique({
        where: { slug: pageData.slug }
      })

      if (existingPage) {
        await prisma.footerPage.update({
          where: { slug: pageData.slug },
          data: pageData
        })
        console.log(`Updated page: ${pageData.title}`)
      } else {
        await prisma.footerPage.create({
          data: pageData
        })
        console.log(`Created page: ${pageData.title}`)
      }
    }

    console.log('Additional footer pages seeding completed!')
  } catch (error) {
    console.error('Error seeding additional pages:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedAdditionalFooterPages()
