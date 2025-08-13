import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { footerPages } from '../lib/db/schema';

const sqlite = new Database('./prisma/dev.db');
const db = drizzle(sqlite)

const footerPagesData = [
  // HELP SECTION PAGES
  {
    title: 'Contact Us',
    slug: 'contact',
    content: `
      <div class="max-w-4xl mx-auto">
        <h2 class="text-2xl font-bold mb-6 text-primary">Get In Touch</h2>
        <div class="grid md:grid-cols-2 gap-8">
          <div>
            <h3 class="text-xl font-semibold mb-4 text-primary">Contact Information</h3>
            <div class="space-y-4">
              <div class="flex items-start space-x-3">
                <div class="text-primary mt-1">📍</div>
                <div>
                  <h4 class="font-medium">Store Address</h4>
                  <p class="text-gray-600">123 Baby Street<br>Dhaka, Bangladesh 1000</p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <div class="text-primary mt-1">📞</div>
                <div>
                  <h4 class="font-medium">Phone</h4>
                  <p class="text-gray-600">+880 1534 207276</p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <div class="text-primary mt-1">✉️</div>
                <div>
                  <h4 class="font-medium">Email</h4>
                  <p class="text-gray-600">info@alauddinssupershop.com</p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <div class="text-primary mt-1">🕒</div>
                <div>
                  <h4 class="font-medium">Business Hours</h4>
                  <p class="text-gray-600">
                    Saturday - Thursday: 9:00 AM - 8:00 PM<br>
                    Friday: 2:00 PM - 8:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h3 class="text-xl font-semibold mb-4 text-primary">Customer Support</h3>
            <p class="text-gray-600 mb-4">We're here to help! Reach out to us for any questions about our baby products, orders, or general inquiries.</p>
            <div class="bg-blue-50 p-4 rounded-lg">
              <h4 class="font-medium text-blue-800 mb-2">Quick Support</h4>
              <p class="text-blue-600 text-sm">For urgent matters, call us directly during business hours. We typically respond to emails within 24 hours.</p>
            </div>
          </div>
        </div>
      </div>
    `,
    metaTitle: 'Contact Alauddin\'s Super Shop | Get in Touch',
    metaDescription: 'Contact Alauddin\'s Super Shop for baby products. Find our store location, phone number, email, and business hours in Dhaka, Bangladesh.'
  },
  {
    title: 'Delivery Information',
    slug: 'delivery',
    content: `
      <div class="max-w-4xl mx-auto">
        <h2 class="text-2xl font-bold mb-6 text-primary">Delivery Information</h2>
        <div class="space-y-8">
          <section>
            <h3 class="text-xl font-semibold mb-4 text-primary">🚚 Delivery Areas</h3>
            <div class="grid md:grid-cols-2 gap-6">
              <div class="border rounded-lg p-4">
                <h4 class="font-medium mb-2">Dhaka City</h4>
                <p class="text-gray-600 text-sm mb-2">Same day delivery available</p>
                <p class="text-lg font-semibold text-green-600">৳80 - ৳120</p>
              </div>
              <div class="border rounded-lg p-4">
                <h4 class="font-medium mb-2">Outside Dhaka</h4>
                <p class="text-gray-600 text-sm mb-2">2-3 business days</p>
                <p class="text-lg font-semibold text-blue-600">৳150 - ৳250</p>
              </div>
            </div>
          </section>

          <section>
            <h3 class="text-xl font-semibold mb-4 text-primary">⏰ Delivery Times</h3>
            <div class="bg-gray-50 p-4 rounded-lg">
              <ul class="space-y-2 text-gray-700">
                <li><strong>Morning Slot:</strong> 9:00 AM - 1:00 PM</li>
                <li><strong>Afternoon Slot:</strong> 2:00 PM - 6:00 PM</li>
                <li><strong>Evening Slot:</strong> 6:00 PM - 9:00 PM</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 class="text-xl font-semibold mb-4 text-primary">📦 Packaging</h3>
            <p class="text-gray-600 mb-4">All baby items are carefully packaged with:</p>
            <ul class="list-disc list-inside space-y-2 text-gray-600 ml-4">
              <li>Protective bubble wrap for fragile items</li>
              <li>Hygienic packaging for baby food and care products</li>
              <li>Secure boxing to prevent damage during transit</li>
              <li>Eco-friendly packaging materials when possible</li>
            </ul>
          </section>

          <section>
            <h3 class="text-xl font-semibold mb-4 text-primary">🎯 Order Tracking</h3>
            <p class="text-gray-600">Track your order status via:</p>
            <ul class="list-disc list-inside space-y-2 text-gray-600 ml-4 mt-2">
              <li>SMS updates on order confirmation and dispatch</li>
              <li>Phone call before delivery</li>
              <li>Real-time tracking (for premium deliveries)</li>
            </ul>
          </section>
        </div>
      </div>
    `,
    metaTitle: 'Delivery Information | Fast Baby Product Delivery in Dhaka',
    metaDescription: 'Learn about our delivery options for baby products in Dhaka and across Bangladesh. Same-day delivery available with secure packaging.'
  },
  {
    title: 'Privacy Policy',
    slug: 'privacy',
    content: `
      <div class="max-w-4xl mx-auto">
        <h2 class="text-2xl font-bold mb-6 text-primary">Privacy Policy</h2>
        <div class="space-y-6 text-gray-700">
          <section>
            <h3 class="text-xl font-semibold mb-3 text-primary">Information We Collect</h3>
            <p class="mb-4">At Alauddin's Super Shop, we collect information to provide better services to our customers:</p>
            <ul class="list-disc list-inside space-y-2 ml-4">
              <li><strong>Personal Information:</strong> Name, email address, phone number, delivery address</li>
              <li><strong>Order Information:</strong> Products purchased, payment details, delivery preferences</li>
              <li><strong>Usage Information:</strong> How you interact with our website and services</li>
            </ul>
          </section>

          <section>
            <h3 class="text-xl font-semibold mb-3 text-primary">How We Use Your Information</h3>
            <ul class="list-disc list-inside space-y-2 ml-4">
              <li>Process and fulfill your orders</li>
              <li>Communicate about your orders and deliveries</li>
              <li>Improve our products and services</li>
              <li>Send promotional offers (with your consent)</li>
              <li>Ensure website security and prevent fraud</li>
            </ul>
          </section>

          <section>
            <h3 class="text-xl font-semibold mb-3 text-primary">Information Protection</h3>
            <p class="mb-4">We implement various security measures to protect your personal information:</p>
            <ul class="list-disc list-inside space-y-2 ml-4">
              <li>Secure encrypted connections (SSL)</li>
              <li>Limited access to personal information</li>
              <li>Regular security audits and updates</li>
              <li>Secure payment processing</li>
            </ul>
          </section>

          <section>
            <h3 class="text-xl font-semibold mb-3 text-primary">Information Sharing</h3>
            <p class="mb-4">We do not sell or rent your personal information. We may share information only:</p>
            <ul class="list-disc list-inside space-y-2 ml-4">
              <li>With delivery partners to fulfill orders</li>
              <li>With payment processors for transaction processing</li>
              <li>When required by law or to protect our rights</li>
              <li>With your explicit consent</li>
            </ul>
          </section>

          <section>
            <h3 class="text-xl font-semibold mb-3 text-primary">Your Rights</h3>
            <p class="mb-4">You have the right to:</p>
            <ul class="list-disc list-inside space-y-2 ml-4">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Opt-out of marketing communications</li>
              <li>Contact us about privacy concerns</li>
            </ul>
          </section>

          <section>
            <h3 class="text-xl font-semibold mb-3 text-primary">Contact Us</h3>
            <p>If you have questions about this privacy policy, please contact us at:</p>
            <div class="bg-gray-50 p-4 rounded-lg mt-3">
              <p><strong>Email:</strong> privacy@alauddinssupershop.com</p>
              <p><strong>Phone:</strong> +880 1534 207276</p>
              <p><strong>Address:</strong> 123 Baby Street, Dhaka, Bangladesh 1000</p>
            </div>
          </section>
        </div>
      </div>
    `,
    metaTitle: 'Privacy Policy | Alauddin\'s Super Shop',
    metaDescription: 'Read our privacy policy to understand how we collect, use, and protect your personal information when shopping for baby products.'
  },
  {
    title: 'Terms & Conditions',
    slug: 'terms',
    content: `
      <div class="max-w-4xl mx-auto">
        <h2 class="text-2xl font-bold mb-6 text-primary">Terms & Conditions</h2>
        <div class="space-y-6 text-gray-700">
          <section>
            <h3 class="text-xl font-semibold mb-3 text-primary">Agreement to Terms</h3>
            <p>By accessing and using Alauddin's Super Shop website and services, you accept and agree to be bound by the terms and provision of this agreement.</p>
          </section>

          <section>
            <h3 class="text-xl font-semibold mb-3 text-primary">Products and Services</h3>
            <ul class="list-disc list-inside space-y-2 ml-4">
              <li>All baby products are genuine and sourced from authorized distributors</li>
              <li>Product descriptions and images are as accurate as possible</li>
              <li>Prices are subject to change without prior notice</li>
              <li>We reserve the right to limit quantities purchased</li>
              <li>Product availability is not guaranteed until order confirmation</li>
            </ul>
          </section>

          <section>
            <h3 class="text-xl font-semibold mb-3 text-primary">Ordering and Payment</h3>
            <ul class="list-disc list-inside space-y-2 ml-4">
              <li>Orders are subject to acceptance and availability</li>
              <li>Payment must be made at the time of ordering or upon delivery</li>
              <li>We accept cash on delivery, bKash, Nagad, and bank transfers</li>
              <li>Incorrect pricing errors will be corrected before shipment</li>
            </ul>
          </section>

          <section>
            <h3 class="text-xl font-semibold mb-3 text-primary">Delivery Terms</h3>
            <ul class="list-disc list-inside space-y-2 ml-4">
              <li>Delivery times are estimates and not guaranteed</li>
              <li>Risk of loss transfers to you upon delivery</li>
              <li>You must inspect products immediately upon delivery</li>
              <li>Delivery charges apply as per our delivery policy</li>
            </ul>
          </section>

          <section>
            <h3 class="text-xl font-semibold mb-3 text-primary">Returns and Exchanges</h3>
            <ul class="list-disc list-inside space-y-2 ml-4">
              <li>Returns accepted within 7 days for unopened baby food/formula</li>
              <li>Toys and clothing can be returned within 14 days in original condition</li>
              <li>Custom or personalized items cannot be returned</li>
              <li>Return shipping costs are borne by the customer unless the item is defective</li>
            </ul>
          </section>

          <section>
            <h3 class="text-xl font-semibold mb-3 text-primary">Limitation of Liability</h3>
            <p class="mb-4">Alauddin's Super Shop shall not be liable for:</p>
            <ul class="list-disc list-inside space-y-2 ml-4">
              <li>Indirect, incidental, or consequential damages</li>
              <li>Loss of profits or business interruption</li>
              <li>Delays due to circumstances beyond our control</li>
              <li>Misuse of products contrary to manufacturer instructions</li>
            </ul>
          </section>

          <section>
            <h3 class="text-xl font-semibold mb-3 text-primary">Contact Information</h3>
            <p>For questions about these terms, contact us at:</p>
            <div class="bg-gray-50 p-4 rounded-lg mt-3">
              <p><strong>Email:</strong> info@alauddinssupershop.com</p>
              <p><strong>Phone:</strong> +880 1534 207276</p>
            </div>
          </section>
        </div>
      </div>
    `,
    metaTitle: 'Terms & Conditions | Alauddin\'s Super Shop',
    metaDescription: 'Read our terms and conditions for purchasing baby products from Alauddin\'s Super Shop. Understand our policies on orders, delivery, and returns.'
  },
  {
    title: 'Return & Exchange Policy',
    slug: 'returns',
    content: `
      <div class="max-w-4xl mx-auto">
        <h2 class="text-2xl font-bold mb-6 text-primary">Return & Exchange Policy</h2>
        <div class="space-y-8">
          <section>
            <h3 class="text-xl font-semibold mb-4 text-primary">🔄 Easy Returns</h3>
            <p class="text-gray-600 mb-4">We want you to be completely satisfied with your baby product purchases. Here's our hassle-free return policy:</p>
            
            <div class="grid md:grid-cols-2 gap-6">
              <div class="border border-green-200 rounded-lg p-4 bg-green-50">
                <h4 class="font-medium text-green-800 mb-2">✅ Returnable Items</h4>
                <ul class="text-sm text-green-700 space-y-1">
                  <li>• Unopened baby food & formula (7 days)</li>
                  <li>• Baby toys in original packaging (14 days)</li>
                  <li>• Clothing with tags attached (14 days)</li>
                  <li>• Strollers & gear (30 days)</li>
                  <li>• Defective items (any time)</li>
                </ul>
              </div>
              
              <div class="border border-red-200 rounded-lg p-4 bg-red-50">
                <h4 class="font-medium text-red-800 mb-2">❌ Non-Returnable Items</h4>
                <ul class="text-sm text-red-700 space-y-1">
                  <li>• Opened baby food & formula</li>
                  <li>• Used diapers or wipes</li>
                  <li>• Personalized items</li>
                  <li>• Items without receipt</li>
                  <li>• Damaged by misuse</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h3 class="text-xl font-semibold mb-4 text-primary">📋 Return Process</h3>
            <div class="space-y-4">
              <div class="flex items-start space-x-3">
                <div class="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
                <div>
                  <h4 class="font-medium">Contact Us</h4>
                  <p class="text-gray-600 text-sm">Call +880 1534 207276 or email returns@alauddinssupershop.com</p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <div class="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
                <div>
                  <h4 class="font-medium">Get Return Authorization</h4>
                  <p class="text-gray-600 text-sm">We'll provide a return reference number and instructions</p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <div class="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
                <div>
                  <h4 class="font-medium">Package & Send</h4>
                  <p class="text-gray-600 text-sm">Pack items securely with original packaging and receipt</p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <div class="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</div>
                <div>
                  <h4 class="font-medium">Refund Processing</h4>
                  <p class="text-gray-600 text-sm">Refunds processed within 5-7 business days after receiving returned items</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h3 class="text-xl font-semibold mb-4 text-primary">💳 Refund Methods</h3>
            <div class="bg-blue-50 p-4 rounded-lg">
              <ul class="space-y-2 text-blue-800">
                <li><strong>Cash Payments:</strong> Cash refund available in-store</li>
                <li><strong>bKash/Nagad:</strong> Refunded to original mobile wallet</li>
                <li><strong>Bank Transfer:</strong> Refunded to provided bank account</li>
                <li><strong>Store Credit:</strong> Available as an option with 10% bonus</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 class="text-xl font-semibold mb-4 text-primary">🔄 Exchange Policy</h3>
            <p class="text-gray-600 mb-4">Need a different size or color? We offer free exchanges within 14 days:</p>
            <ul class="list-disc list-inside space-y-2 text-gray-600 ml-4">
              <li>Item must be unused and in original condition</li>
              <li>Exchange for same or higher value items</li>
              <li>Price difference must be paid for higher value items</li>
              <li>Free pickup and delivery for exchanges in Dhaka</li>
            </ul>
          </section>

          <section>
            <h3 class="text-xl font-semibold mb-4 text-primary">⚠️ Important Notes</h3>
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <ul class="space-y-2 text-yellow-800 text-sm">
                <li>• Return window starts from delivery date</li>
                <li>• Items must be returned in original condition</li>
                <li>• Return shipping costs apply unless item is defective</li>
                <li>• Refunds exclude original shipping charges</li>
                <li>• Custom or personalized items cannot be returned</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    `,
    metaTitle: 'Return & Exchange Policy | Easy Returns for Baby Products',
    metaDescription: 'Learn about our easy return and exchange policy for baby items. Hassle-free returns with flexible terms to ensure your satisfaction.'
  },
  {
    title: 'About Us',
    slug: 'about',
    content: `
      <div class="max-w-4xl mx-auto">
        <h2 class="text-2xl font-bold mb-6 text-primary">About Alauddin's Super Shop</h2>
        <div class="space-y-8">
          <section>
            <div class="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 class="text-xl font-semibold mb-4 text-primary">Our Story</h3>
                <p class="text-gray-600 mb-4">
                  Founded with a passion for providing the best care for babies and children, Alauddin's Super Shop has been serving families in Bangladesh since 2015. We understand that every child deserves the finest products for their growth and development.
                </p>
                <p class="text-gray-600">
                  What started as a small local store has grown into a trusted destination for parents seeking quality baby products, from essential feeding supplies to delightful toys and comfortable clothing.
                </p>
              </div>
              <div class="bg-blue-50 p-6 rounded-lg">
                <h4 class="font-semibold text-blue-800 mb-3">Quick Facts</h4>
                <ul class="space-y-2 text-blue-700 text-sm">
                  <li>• Established: 2015</li>
                  <li>• Location: Dhaka, Bangladesh</li>
                  <li>• Products: 500+ Baby Items</li>
                  <li>• Happy Customers: 10,000+</li>
                  <li>• Delivery: Nationwide</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h3 class="text-xl font-semibold mb-4 text-primary">Our Mission</h3>
            <div class="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
              <p class="text-gray-700 italic text-lg leading-relaxed">
                "To provide parents with safe, high-quality baby products that support healthy development and create joyful moments for families across Bangladesh."
              </p>
            </div>
          </section>

          <section>
            <h3 class="text-xl font-semibold mb-4 text-primary">Why Choose Us?</h3>
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div class="text-center p-4">
                <div class="text-3xl mb-3">🛡️</div>
                <h4 class="font-medium mb-2">Safety First</h4>
                <p class="text-gray-600 text-sm">All products meet international safety standards for baby use</p>
              </div>
              <div class="text-center p-4">
                <div class="text-3xl mb-3">✨</div>
                <h4 class="font-medium mb-2">Quality Assured</h4>
                <p class="text-gray-600 text-sm">Sourced from trusted brands and verified suppliers</p>
              </div>
              <div class="text-center p-4">
                <div class="text-3xl mb-3">🚚</div>
                <h4 class="font-medium mb-2">Fast Delivery</h4>
                <p class="text-gray-600 text-sm">Same-day delivery in Dhaka, nationwide shipping available</p>
              </div>
              <div class="text-center p-4">
                <div class="text-3xl mb-3">💰</div>
                <h4 class="font-medium mb-2">Best Prices</h4>
                <p class="text-gray-600 text-sm">Competitive pricing with regular discounts and offers</p>
              </div>
              <div class="text-center p-4">
                <div class="text-3xl mb-3">🤝</div>
                <h4 class="font-medium mb-2">Expert Support</h4>
                <p class="text-gray-600 text-sm">Knowledgeable staff to help you choose the right products</p>
              </div>
              <div class="text-center p-4">
                <div class="text-3xl mb-3">❤️</div>
                <h4 class="font-medium mb-2">Family Focused</h4>
                <p class="text-gray-600 text-sm">Understanding the needs of growing families</p>
              </div>
            </div>
          </section>

          <section>
            <h3 class="text-xl font-semibold mb-4 text-primary">Our Values</h3>
            <div class="space-y-4">
              <div class="flex items-start space-x-4">
                <div class="bg-green-100 text-green-600 rounded-full p-2 mt-1">✓</div>
                <div>
                  <h4 class="font-medium">Trust & Transparency</h4>
                  <p class="text-gray-600 text-sm">Honest product information and clear pricing</p>
                </div>
              </div>
              <div class="flex items-start space-x-4">
                <div class="bg-blue-100 text-blue-600 rounded-full p-2 mt-1">🎯</div>
                <div>
                  <h4 class="font-medium">Customer Satisfaction</h4>
                  <p class="text-gray-600 text-sm">Your happiness is our priority</p>
                </div>
              </div>
              <div class="flex items-start space-x-4">
                <div class="bg-purple-100 text-purple-600 rounded-full p-2 mt-1">🌱</div>
                <div>
                  <h4 class="font-medium">Continuous Improvement</h4>
                  <p class="text-gray-600 text-sm">Always evolving to serve you better</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h3 class="text-xl font-semibold mb-4 text-primary">Contact Our Team</h3>
            <div class="bg-gray-50 p-6 rounded-lg">
              <p class="text-gray-600 mb-4">Have questions? We'd love to hear from you!</p>
              <div class="grid md:grid-cols-2 gap-4">
                <div>
                  <p><strong>Phone:</strong> +880 1534 207276</p>
                  <p><strong>Email:</strong> info@alauddinssupershop.com</p>
                </div>
                <div>
                  <p><strong>Address:</strong> 123 Baby Street, Dhaka, Bangladesh</p>
                  <p><strong>Hours:</strong> Sat-Thu 9AM-8PM, Fri 2PM-8PM</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    `,
    metaTitle: 'About Us | Alauddin\'s Super Shop - Your Trusted Baby Product Store',
    metaDescription: 'Learn about Alauddin\'s Super Shop, your trusted destination for quality baby products in Bangladesh since 2015. Safe, reliable, and family-focused.'
  },
  {
    title: 'FAQs',
    slug: 'faq',
    content: `
      <div class="max-w-4xl mx-auto">
        <h2 class="text-2xl font-bold mb-6 text-primary">Frequently Asked Questions</h2>
        <div class="space-y-6">
          <div class="border border-gray-200 rounded-lg p-4">
            <h3 class="font-semibold text-lg mb-2 text-primary">🛒 Ordering & Payment</h3>
            <div class="space-y-4">
              <div>
                <h4 class="font-medium mb-1">How can I place an order?</h4>
                <p class="text-gray-600 text-sm">You can place orders through our website, by calling +880 1534 207276, or visiting our physical store in Dhaka.</p>
              </div>
              <div>
                <h4 class="font-medium mb-1">What payment methods do you accept?</h4>
                <p class="text-gray-600 text-sm">We accept cash on delivery, bKash, Nagad, Rocket, and bank transfers. All major mobile payment methods are supported.</p>
              </div>
              <div>
                <h4 class="font-medium mb-1">Is there a minimum order amount?</h4>
                <p class="text-gray-600 text-sm">No minimum order amount for Dhaka city. For outside Dhaka, minimum order of ৳500 required for delivery.</p>
              </div>
            </div>
          </div>

          <div class="border border-gray-200 rounded-lg p-4">
            <h3 class="font-semibold text-lg mb-2 text-primary">🚚 Delivery & Shipping</h3>
            <div class="space-y-4">
              <div>
                <h4 class="font-medium mb-1">How fast is delivery?</h4>
                <p class="text-gray-600 text-sm">Same-day delivery in Dhaka city (order by 2 PM). Outside Dhaka: 2-3 business days.</p>
              </div>
              <div>
                <h4 class="font-medium mb-1">What are the delivery charges?</h4>
                <p class="text-gray-600 text-sm">Dhaka city: ৳80-120. Outside Dhaka: ৳150-250. Free delivery on orders above ৳2000 in Dhaka.</p>
              </div>
              <div>
                <h4 class="font-medium mb-1">Do you deliver nationwide?</h4>
                <p class="text-gray-600 text-sm">Yes, we deliver across Bangladesh through reliable courier services and local delivery partners.</p>
              </div>
            </div>
          </div>

          <div class="border border-gray-200 rounded-lg p-4">
            <h3 class="font-semibold text-lg mb-2 text-primary">🔄 Returns & Exchanges</h3>
            <div class="space-y-4">
              <div>
                <h4 class="font-medium mb-1">Can I return baby food if my child doesn't like it?</h4>
                <p class="text-gray-600 text-sm">Unopened baby food can be returned within 7 days. Opened items cannot be returned for hygiene reasons.</p>
              </div>
              <div>
                <h4 class="font-medium mb-1">How long do I have to return toys?</h4>
                <p class="text-gray-600 text-sm">Baby toys can be returned within 14 days if they're in original packaging and unused condition.</p>
              </div>
              <div>
                <h4 class="font-medium mb-1">What if I receive a defective product?</h4>
                <p class="text-gray-600 text-sm">Defective items can be returned anytime for replacement or full refund. Contact us immediately upon discovery.</p>
              </div>
            </div>
          </div>

          <div class="border border-gray-200 rounded-lg p-4">
            <h3 class="font-semibold text-lg mb-2 text-primary">🍼 Product Information</h3>
            <div class="space-y-4">
              <div>
                <h4 class="font-medium mb-1">Are all products safe for babies?</h4>
                <p class="text-gray-600 text-sm">Yes, all our products meet international safety standards and are sourced from reputable manufacturers.</p>
              </div>
              <div>
                <h4 class="font-medium mb-1">Do you sell organic baby products?</h4>
                <p class="text-gray-600 text-sm">Yes, we carry a selection of organic baby foods, diapers, and skincare products from certified brands.</p>
              </div>
              <div>
                <h4 class="font-medium mb-1">Can you help me choose the right formula for my baby?</h4>
                <p class="text-gray-600 text-sm">Our trained staff can provide guidance, but we always recommend consulting your pediatrician for formula selection.</p>
              </div>
            </div>
          </div>

          <div class="border border-gray-200 rounded-lg p-4">
            <h3 class="font-semibold text-lg mb-2 text-primary">💰 Pricing & Offers</h3>
            <div class="space-y-4">
              <div>
                <h4 class="font-medium mb-1">Do you offer bulk discounts?</h4>
                <p class="text-gray-600 text-sm">Yes, we offer special pricing for bulk orders. Contact us for custom quotes on large quantities.</p>
              </div>
              <div>
                <h4 class="font-medium mb-1">How often do you have sales?</h4>
                <p class="text-gray-600 text-sm">We regularly offer seasonal discounts, festival sales, and flash promotions. Follow us for updates!</p>
              </div>
              <div>
                <h4 class="font-medium mb-1">Do you have a loyalty program?</h4>
                <p class="text-gray-600 text-sm">We're launching a customer loyalty program soon! Regular customers enjoy priority service and special offers.</p>
              </div>
            </div>
          </div>

          <div class="border border-gray-200 rounded-lg p-4">
            <h3 class="font-semibold text-lg mb-2 text-primary">📞 Customer Support</h3>
            <div class="space-y-4">
              <div>
                <h4 class="font-medium mb-1">What are your customer service hours?</h4>
                <p class="text-gray-600 text-sm">Saturday-Thursday: 9:00 AM - 8:00 PM, Friday: 2:00 PM - 8:00 PM. Emergency support available via WhatsApp.</p>
              </div>
              <div>
                <h4 class="font-medium mb-1">How quickly do you respond to emails?</h4>
                <p class="text-gray-600 text-sm">We typically respond to emails within 24 hours during business days, often much faster.</p>
              </div>
              <div>
                <h4 class="font-medium mb-1">Can I track my order?</h4>
                <p class="text-gray-600 text-sm">Yes, you'll receive SMS updates and can call us anytime for order status. Real-time tracking available for premium deliveries.</p>
              </div>
            </div>
          </div>

          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-8">
            <h3 class="font-semibold text-blue-800 mb-2">Still have questions?</h3>
            <p class="text-blue-700 text-sm mb-3">Can't find what you're looking for? Our friendly team is here to help!</p>
            <div class="flex flex-wrap gap-4">
              <span class="text-sm"><strong>Call:</strong> +880 1534 207276</span>
              <span class="text-sm"><strong>Email:</strong> info@alauddinssupershop.com</span>
              <span class="text-sm"><strong>WhatsApp:</strong> Available 24/7</span>
            </div>
          </div>
        </div>
      </div>
    `,
    metaTitle: 'FAQs | Common Questions About Baby Products & Orders',
    metaDescription: 'Find answers to frequently asked questions about ordering baby products, delivery, returns, and customer service at Alauddin\'s Super Shop.'
  },
  // FOOTER LINKS
  // HELP SECTION PAGES
  // Already created: Contact Us, Delivery Information, Privacy Policy, Terms & Conditions, Return & Exchange Policy, Frequently Asked Questions

  // ABOUT US SECTION PAGES
  // Already created: About Us (Our Story)
  {
    title: 'BD Shipping',
    slug: 'shipping',
    content: `
      <div class="max-w-4xl mx-auto">
        <h2 class="text-2xl font-bold mb-6 text-primary">Bangladesh Shipping Information</h2>
        <div class="space-y-6 text-gray-700">
          <section>
            <h3 class="text-xl font-semibold mb-3 text-primary">📦 Nationwide Delivery</h3>
            <p class="mb-4">Alauddin's Super Shop offers reliable shipping services across all 64 districts of Bangladesh. We partner with trusted courier services to ensure your baby products reach you safely and on time, no matter where you are.</p>
          </section>

          <section>
            <h3 class="text-xl font-semibold mb-3 text-primary">🚚 Delivery Timeframes</h3>
            <ul class="list-disc list-inside space-y-2 ml-4">
              <li><strong>Dhaka City:</strong> Same-day delivery for orders placed before 2 PM. Next-day delivery for orders placed after 2 PM.</li>
              <li><strong>Outside Dhaka (Major Cities):</strong> 2-3 business days.</li>
              <li><strong>Remote Areas:</strong> 3-5 business days, depending on courier service reach.</li>
            </ul>
            <p class="mt-4 text-sm text-gray-500">Please note: Delivery times are estimates and may vary due to unforeseen circumstances like public holidays, political unrest, or natural disasters.</p>
          </section>

          <section>
            <h3 class="text-xl font-semibold mb-3 text-primary">💰 Shipping Charges</h3>
            <ul class="list-disc list-inside space-y-2 ml-4">
              <li><strong>Dhaka City:</strong> ৳80 - ৳120 (depending on package size/weight). Free delivery for orders above ৳2000.</li>
              <li><strong>Outside Dhaka:</strong> ৳150 - ৳250 (depending on package size/weight and destination).</li>
            </ul>
            <p class="mt-4 text-sm text-gray-500">Exact shipping costs will be calculated at checkout based on your order and delivery location.</p>
          </section>

          <section>
            <h3 class="text-xl font-semibold mb-3 text-primary">✅ Order Tracking</h3>
            <p class="mb-4">Once your order is dispatched, you will receive an SMS notification with tracking details (if applicable) and the estimated delivery time. Our customer service team is also available to provide updates on your order status.</p>
          </section>

          <section>
            <h3 class="text-xl font-semibold mb-3 text-primary">📞 Contact for Shipping Inquiries</h3>
            <p>For any questions regarding your shipment or our delivery policies, please contact us:</p>
            <div class="bg-gray-50 p-4 rounded-lg mt-3">
              <p><strong>Phone:</strong> +880 1534 207276</p>
              <p><strong>Email:</strong> shipping@alauddinssupershop.com</p>
            </div>
          </section>
        </div>
      </div>
    `,
    metaTitle: 'BD Shipping | Nationwide Delivery for Baby Products in Bangladesh',
    metaDescription: 'Learn about Alauddin\'s Super Shop\'s nationwide shipping services in Bangladesh. Fast and reliable delivery for all your baby product needs.'
  },
  {
    title: 'Showroom Lookbook',
    slug: 'lookbook',
    content: `
      <div class="max-w-4xl mx-auto">
        <h2 class="text-2xl font-bold mb-6 text-primary">Our Showroom Lookbook</h2>
        <div class="space-y-6 text-gray-700">
          <section>
            <h3 class="text-xl font-semibold mb-3 text-primary">Step Inside Our World of Baby Essentials</h3>
            <p class="mb-4">Welcome to the virtual tour of Alauddin's Super Shop showroom! We've curated a lookbook to give you a glimpse of our extensive collection of baby products, designed to meet every need of your little one.</p>
            <p class="mb-4">Our showroom is a vibrant space where you can explore, touch, and feel the quality of our products, from the softest clothing to the most innovative strollers and engaging toys.</p>
          </section>

          <section>
            <h3 class="text-xl font-semibold mb-3 text-primary">What You'll Find in Our Showroom:</h3>
            <ul class="list-disc list-inside space-y-2 ml-4">
              <li><strong>Nursery Furniture:</strong> Cribs, changing tables, and comfortable gliders.</li>
              <li><strong>Strollers & Car Seats:</strong> A wide range of options for safety and convenience.</li>
              <li><strong>Feeding Essentials:</strong> Bottles, high chairs, and weaning supplies.</li>
              <li><strong>Baby Apparel:</strong> Adorable and comfortable clothing for all ages.</li>
              <li><strong>Toys & Learning:</strong> Educational and fun toys for every developmental stage.</li>
              <li><strong>Health & Safety:</strong> Monitors, safety gates, and grooming kits.</li>
            </ul>
          </section>

          <section>
            <h3 class="text-xl font-semibold mb-3 text-primary">Visit Us Today!</h3>
            <p class="mb-4">While this lookbook offers a peek, nothing compares to experiencing our showroom in person. Our friendly staff are always on hand to guide you through our collections and help you find the perfect items for your family.</p>
            <div class="bg-gray-50 p-4 rounded-lg mt-3">
              <p><strong>Showroom Address:</strong> 123 Baby Street, Dhaka, Bangladesh 1000</p>
              <p><strong>Business Hours:</strong> Saturday - Thursday: 9:00 AM - 8:00 PM, Friday: 2:00 PM - 8:00 PM</p>
              <p><strong>Phone:</strong> +880 1534 207276</p>
            </div>
          </section>
        </div>
      </div>
    `,
    metaTitle: 'Showroom Lookbook | Explore Alauddin\'s Super Shop Baby Products',
    metaDescription: 'Take a virtual tour of Alauddin\'s Super Shop showroom. Explore our extensive collection of baby furniture, strollers, clothing, and toys in Dhaka, Bangladesh.'
  }
,
  {
    title: 'Trade Shows',
    slug: 'trade-shows',
    content: `
      <div class="max-w-4xl mx-auto">
        <h2 class="text-2xl font-bold mb-6 text-primary">Alauddin's Super Shop at Trade Shows</h2>
        <div class="space-y-6 text-gray-700">
          <section>
            <h3 class="text-xl font-semibold mb-3 text-primary">Connecting with the Industry and Our Customers</h3>
            <p class="mb-4">Alauddin's Super Shop actively participates in various national and international trade shows and exhibitions related to baby products, childcare, and retail. These events provide us with invaluable opportunities to:</p>
            <ul class="list-disc list-inside space-y-2 ml-4">
              <li>Discover the latest innovations and trends in the baby product industry.</li>
              <li>Network with leading manufacturers and suppliers from around the globe.</li>
              <li>Showcase our diverse range of high-quality baby products to a wider audience.</li>
              <li>Engage directly with parents and caregivers, understanding their evolving needs and preferences.</li>
              <li>Strengthen our relationships with existing partners and forge new collaborations.</li>
            </ul>
          </section>

          <section>
            <h3 class="text-xl font-semibold mb-3 text-primary">Upcoming & Past Participations</h3>
            <p class="mb-4">Stay tuned to this page and our social media channels for announcements about our upcoming trade show participations. We often offer exclusive discounts and previews of new arrivals at these events!</p>
            <div class="bg-gray-50 p-4 rounded-lg">
              <h4 class="font-medium mb-2">Recent Participations:</h4>
              <ul class="list-disc list-inside space-y-1 ml-4">
                <li>Bangladesh Baby & Kids Expo 2023 (Dhaka)</li>
                <li>International Toy Fair 2022 (Nuremberg, Germany - as visitor)</li>
                <li>Dhaka International Trade Fair (DITF) 2021 (Dhaka)</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 class="text-xl font-semibold mb-3 text-primary">Why Visit Our Booth?</h3>
            <ul class="list-disc list-inside space-y-2 ml-4">
              <li><strong>Exclusive Deals:</strong> Special pricing and bundles available only at the show.</li>
              <li><strong>Product Demos:</strong> Get hands-on experience with our strollers, car seats, and innovative gadgets.</li>
              <li><strong>Expert Advice:</strong> Our team will be on hand to answer all your questions and offer personalized recommendations.</li>
              <li><strong>New Arrivals:</strong> Be among the first to see and purchase our latest product lines.</li>
            </ul>
          </section>

          <section>
            <h3 class="text-xl font-semibold mb-3 text-primary">Connect With Us</h3>
            <p>If you are a manufacturer, supplier, or a business interested in collaboration, please reach out to us. We are always looking for opportunities to expand our product offerings and partnerships.</p>
            <div class="bg-gray-50 p-4 rounded-lg mt-3">
              <p><strong>Email for Business Inquiries:</strong> partnerships@alauddinssupershop.com</p>
              <p><strong>General Inquiries:</strong> info@alauddinssupershop.com</p>
            </div>
          </section>
        </div>
      </div>
    `,
    metaTitle: 'Alauddin\'s Super Shop at Trade Shows | Baby Product Exhibitions',
    metaDescription: 'Discover Alauddin\'s Super Shop\'s participation in baby product trade shows and exhibitions. Find out about our upcoming events and past participations.'
  },
  {
    title: 'Ethical Policy',
    slug: 'ethics',
    content: `
      <div class="max-w-4xl mx-auto">
        <h2 class="text-2xl font-bold mb-6 text-primary">Our Ethical Policy</h2>
        <div class="space-y-6 text-gray-700">
          <section>
            <h3 class="text-xl font-semibold mb-3 text-primary">Commitment to Responsible Business Practices</h3>
            <p class="mb-4">At Alauddin's Super Shop, we are committed to conducting our business with the highest standards of ethics, integrity, and social responsibility. Our ethical policy guides every aspect of our operations, from sourcing products to treating our employees and engaging with our community.</p>
          </section>

          <section>
            <h3 class="text-xl font-semibold mb-3 text-primary">Our Core Ethical Principles:</h3>
            <ul class="list-disc list-inside space-y-2 ml-4">
              <li><strong>Fair Labor Practices:</strong> We ensure that all our suppliers adhere to fair labor practices, including safe working conditions, fair wages, and no child labor or forced labor.</li>
              <li><strong>Product Safety & Quality:</strong> We prioritize the safety and quality of all baby products we offer, ensuring they meet or exceed international safety standards and are free from harmful substances.</li>
              <li><strong>Environmental Responsibility:</strong> We strive to minimize our environmental footprint by promoting eco-friendly products, reducing waste, and encouraging sustainable practices throughout our supply chain.</li>
              <li><strong>Transparency & Honesty:</strong> We are transparent in our dealings with customers, suppliers, and partners, providing accurate information and maintaining honest communication.</li>
              <li><strong>Customer Well-being:</strong> We are dedicated to the well-being of our customers, offering reliable products and responsive customer service.</li>
              <li><strong>Community Engagement:</strong> We believe in giving back to the community and support initiatives that benefit children and families in Bangladesh.</li>
            </ul>
          </section>

          <section>
            <h3 class="text-xl font-semibold mb-3 text-primary">Supplier Code of Conduct</h3>
            <p class="mb-4">We require all our suppliers and partners to comply with our Supplier Code of Conduct, which outlines our expectations regarding labor standards, environmental protection, and business ethics. Regular audits and assessments are conducted to ensure compliance.</p>
          </section>

          <section>
            <h3 class="text-xl font-semibold mb-3 text-primary">Reporting Concerns</h3>
            <p>We encourage anyone who has concerns about our ethical practices or those of our suppliers to contact us. All reports will be handled with confidentiality and investigated thoroughly.</p>
            <div class="bg-gray-50 p-4 rounded-lg mt-3">
              <p><strong>Email for Ethical Concerns:</strong> ethics@alauddinssupershop.com</p>
              <p><strong>Phone:</strong> +880 1534 207276</p>
            </div>
          </section>
        </div>
      </div>
    `,
    metaTitle: 'Ethical Policy | Alauddin\'s Super Shop - Responsible Business Practices',
    metaDescription: 'Learn about Alauddin\'s Super Shop\'s ethical policy, our commitment to fair labor, product safety, environmental responsibility, and transparent business practices.'
  },
  {
    title: 'Sustainability Mission',
    slug: 'sustainability',
    content: `
      <div class="max-w-4xl mx-auto">
        <h2 class="text-2xl font-bold mb-6 text-primary">Our Sustainability Mission</h2>
        <div class="space-y-6 text-gray-700">
          <section>
            <h3 class="text-xl font-semibold mb-3 text-primary">Building a Greener Future for Our Little Ones</h3>
            <p class="mb-4">At Alauddin's Super Shop, we recognize our responsibility to protect the planet for future generations. Our sustainability mission is to integrate environmentally friendly practices into every aspect of our business, from the products we offer to our daily operations.</p>
          </section>

          <section>
            <h3 class="text-xl font-semibold mb-3 text-primary">Key Pillars of Our Sustainability Mission:</h3>
            <ul class="list-disc list-inside space-y-2 ml-4">
              <li><strong>Eco-Friendly Product Selection:</strong> Prioritizing baby products made from sustainable materials, organic cotton, recycled content, and those with reduced chemical footprints.</li>
              <li><strong>Waste Reduction:</strong> Implementing strategies to minimize waste in our packaging, shipping, and in-store operations. This includes using recyclable and biodegradable packaging materials where possible.</li>
              <li><strong>Energy Efficiency:</strong> Striving to reduce our energy consumption in our facilities and encouraging energy-efficient practices among our team.</li>
              <li><strong>Sustainable Sourcing:</strong> Working with suppliers who share our commitment to sustainability, ensuring responsible sourcing of raw materials and ethical production processes.</li>
              <li><strong>Educating & Empowering:</strong> Providing information to our customers about sustainable choices and encouraging them to adopt eco-conscious habits for their families.</li>
              <li><strong>Community & Environment:</strong> Supporting local environmental initiatives and promoting awareness about ecological preservation within our community.</li>
            </ul>
          </section>

          <section>
            <h3 class="text-xl font-semibold mb-3 text-primary">Our Progress & Future Goals</h3>
            <p class="mb-4">We are continuously working to improve our sustainability performance. Some of our ongoing efforts include:</p>
            <ul class="list-disc list-inside space-y-2 ml-4">
              <li>Increasing the percentage of eco-certified products in our inventory.</li>
              <li>Transitioning to 100% recyclable or compostable packaging for our own-brand items.</li>
              <li>Exploring partnerships with local recycling programs.</li>
              <li>Reducing plastic usage in our supply chain.</li>
            </ul>
          </section>

          <section>
            <h3 class="text-xl font-semibold mb-3 text-primary">Join Us on Our Journey</h3>
            <p>We believe that every small step contributes to a larger positive impact. By choosing Alauddin's Super Shop, you are supporting a business committed to a more sustainable future for our children and the planet.</p>
            <div class="bg-gray-50 p-4 rounded-lg mt-3">
              <p><strong>Have suggestions or questions?</strong></p>
              <p>Email us at: sustainability@alauddinssupershop.com</p>
            </div>
          </section>
        </div>
      </div>
    `,
    metaTitle: 'Sustainability Mission | Alauddin\'s Super Shop - Eco-Friendly Baby Products',
    metaDescription: 'Learn about Alauddin\'s Super Shop\'s sustainability mission. We are committed to offering eco-friendly baby products and promoting environmentally responsible practices.'
  }
]

async function seedFooterPages() {
  try {
    console.log('🌱 Starting footer pages seeding...')

    // Clear existing footer pages
    await db.delete(footerPages)
    console.log('✅ Cleared existing footer pages')

    // Insert new footer pages
    for (const [index, page] of footerPagesData.entries()) {
      await db.insert(footerPages).values({
        title: page.title,
        slug: page.slug,
        content: page.content,
        metaTitle: page.metaTitle,
        metaDescription: page.metaDescription,
        isActive: true,
        sortOrder: index + 1
      })
      console.log(`✅ Created footer page: ${page.title}`)
    }

    console.log('🎉 Footer pages seeding completed successfully!')
    console.log(`📊 Total pages created: ${footerPagesData.length}`)

    // Display summary
    console.log('\n📝 Created pages:')
    footerPagesData.forEach((page, index) => {
      console.log(`${index + 1}. ${page.title} (/${page.slug})`)
    })

  } catch (error) {
    console.error('❌ Error seeding footer pages:', error)
    throw error
  } finally {
    sqlite.close()
  }
}

// Run the seeding function
seedFooterPages()
  .then(() => {
    console.log('✅ Footer pages seeding process completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Footer pages seeding failed:', error)
    process.exit(1)
  })
