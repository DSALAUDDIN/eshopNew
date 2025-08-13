const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const footerPages = [
  {
    title: 'Contact Us',
    slug: 'contact',
    content: `
      <div class="max-w-4xl mx-auto">
        <h2 class="text-2xl font-bold mb-6">Get In Touch</h2>
        <div class="grid md:grid-cols-2 gap-8">
          <div>
            <h3 class="text-xl font-semibold mb-4">Contact Information</h3>
            <div class="space-y-4">
              <div>
                <h4 class="font-medium">Address</h4>
                <p>123 Fashion Street<br>Dhaka, Bangladesh</p>
              </div>
              <div>
                <h4 class="font-medium">Phone</h4>
                <p>+880 1234 567890</p>
              </div>
              <div>
                <h4 class="font-medium">Email</h4>
                <p>info@southernfashiondecor.com</p>
              </div>
              <div>
                <h4 class="font-medium">Business Hours</h4>
                <p>Monday - Friday: 9:00 AM - 6:00 PM<br>Saturday: 10:00 AM - 4:00 PM<br>Sunday: Closed</p>
              </div>
            </div>
          </div>
          <div>
            <h3 class="text-xl font-semibold mb-4">Send us a Message</h3>
            <p>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
          </div>
        </div>
      </div>
    `,
    metaTitle: 'Contact Us | Southern Fashion & Decor',
    metaDescription: 'Get in touch with Southern Fashion & Decor. Find our contact information, business hours, and location details.'
  },
  {
    title: 'Delivery Information',
    slug: 'delivery',
    content: `
      <div class="max-w-4xl mx-auto">
        <h2 class="text-2xl font-bold mb-6">Delivery Information</h2>
        <div class="space-y-8">
          <section>
            <h3 class="text-xl font-semibold mb-4">Delivery Options</h3>
            <div class="grid md:grid-cols-2 gap-6">
              <div class="border p-4 rounded-lg">
                <h4 class="font-medium mb-2">Standard Delivery</h4>
                <p class="text-sm text-gray-600 mb-2">3-5 business days</p>
                <p>Free for orders over ৳2,000, otherwise ৳100 delivery charge</p>
              </div>
              <div class="border p-4 rounded-lg">
                <h4 class="font-medium mb-2">Express Delivery</h4>
                <p class="text-sm text-gray-600 mb-2">1-2 business days</p>
                <p>৳200 delivery charge for all orders</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    `,
    metaTitle: 'Delivery Information | Southern Fashion & Decor',
    metaDescription: 'Learn about our delivery options, areas we serve, and processing times for your Southern Fashion & Decor orders.'
  },
  {
    title: 'Terms & Conditions',
    slug: 'terms',
    content: `
      <div class="max-w-4xl mx-auto">
        <h2 class="text-2xl font-bold mb-6">Terms & Conditions</h2>
        <div class="space-y-6">
          <section>
            <h3 class="text-xl font-semibold mb-3">1. General Terms</h3>
            <p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p>
          </section>
          <section>
            <h3 class="text-xl font-semibold mb-3">2. Product Information</h3>
            <p>We strive to provide accurate product information, including descriptions, images, and pricing.</p>
          </section>
        </div>
      </div>
    `,
    metaTitle: 'Terms & Conditions | Southern Fashion & Decor',
    metaDescription: 'Read our terms and conditions for shopping with Southern Fashion & Decor.'
  },
  {
    title: 'Privacy Policy',
    slug: 'privacy',
    content: `
      <div class="max-w-4xl mx-auto">
        <h2 class="text-2xl font-bold mb-6">Privacy Policy</h2>
        <div class="space-y-6">
          <section>
            <h3 class="text-xl font-semibold mb-3">Information We Collect</h3>
            <p>We collect information you provide directly to us when you create an account, make a purchase, or contact us.</p>
          </section>
        </div>
      </div>
    `,
    metaTitle: 'Privacy Policy | Southern Fashion & Decor',
    metaDescription: 'Learn how Southern Fashion & Decor protects your privacy and handles your personal information.'
  },
  {
    title: 'Frequently Asked Questions',
    slug: 'faq',
    content: `
      <div class="max-w-4xl mx-auto">
        <h2 class="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <div class="space-y-6">
          <div class="border-b pb-4">
            <h3 class="text-lg font-semibold mb-2">How do I place an order?</h3>
            <p>Browse our products, add items to your cart, and proceed to checkout.</p>
          </div>
        </div>
      </div>
    `,
    metaTitle: 'FAQ | Southern Fashion & Decor',
    metaDescription: 'Find answers to frequently asked questions about shopping at Southern Fashion & Decor.'
  },
  {
    title: 'Bangladesh Shipping',
    slug: 'shipping',
    content: `
      <div class="max-w-4xl mx-auto">
        <h2 class="text-2xl font-bold mb-6">Bangladesh Shipping</h2>
        <p>We serve customers across Bangladesh with reliable shipping services.</p>
      </div>
    `,
    metaTitle: 'Bangladesh Shipping | Southern Fashion & Decor',
    metaDescription: 'Learn about our shipping services across Bangladesh.'
  },
  {
    title: 'Our Story',
    slug: 'about',
    content: `
      <div class="max-w-4xl mx-auto">
        <h2 class="text-2xl font-bold mb-6">Our Story</h2>
        <p>Southern Fashion & Decor brings beautiful, quality home decor and fashion accessories to Bangladesh.</p>
      </div>
    `,
    metaTitle: 'Our Story | Southern Fashion & Decor',
    metaDescription: 'Learn about Southern Fashion & Decor and our mission.'
  },
  {
    title: 'Our Showroom',
    slug: 'showroom',
    content: `
      <div class="max-w-4xl mx-auto">
        <h2 class="text-2xl font-bold mb-6">Visit Our Showroom</h2>
        <p>Experience our products firsthand at our beautiful showroom in Dhaka.</p>
      </div>
    `,
    metaTitle: 'Our Showroom | Southern Fashion & Decor',
    metaDescription: 'Visit our showroom in Dhaka to experience our complete collection.'
  }
]

async function seedFooterPages() {
  console.log('Seeding footer pages...')

  try {
    for (const pageData of footerPages) {
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

    console.log('Footer pages seeding completed!')
  } catch (error) {
    console.error('Error seeding pages:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedFooterPages()
