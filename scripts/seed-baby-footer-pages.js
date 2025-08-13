const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const footerPages = [
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
            <div class="space-y-4">
              <p class="text-gray-600">
                We're here to help you find the perfect products for your baby. 
                Our knowledgeable team is ready to assist with product recommendations, 
                orders, and any questions you may have.
              </p>
              <div class="bg-blue-50 p-4 rounded-lg">
                <h4 class="font-medium text-primary mb-2">Quick Support</h4>
                <p class="text-sm text-gray-600">
                  For urgent inquiries, call us directly or visit our store. 
                  We also offer WhatsApp support for your convenience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
    metaTitle: 'Contact Us | Aluddin\'s Super Shop',
    metaDescription: 'Get in touch with Aluddin\'s Super Shop. Find our contact information, store location, and customer support details.'
  },
  {
    title: 'Delivery',
    slug: 'delivery',
    content: `
      <div class="max-w-4xl mx-auto">
        <h2 class="text-2xl font-bold mb-6 text-primary">Delivery Information</h2>
        <div class="space-y-8">
          <section>
            <h3 class="text-xl font-semibold mb-4 text-primary">Delivery Areas</h3>
            <div class="grid md:grid-cols-2 gap-6">
              <div class="bg-green-50 p-4 rounded-lg">
                <h4 class="font-medium text-green-800 mb-2">🚚 Inside Dhaka</h4>
                <ul class="text-sm text-green-700 space-y-1">
                  <li>• Delivery Time: 1-2 business days</li>
                  <li>• Delivery Charge: ৳60</li>
                  <li>• Free delivery on orders over ৳2000</li>
                </ul>
              </div>
              <div class="bg-blue-50 p-4 rounded-lg">
                <h4 class="font-medium text-blue-800 mb-2">🚛 Outside Dhaka</h4>
                <ul class="text-sm text-blue-700 space-y-1">
                  <li>• Delivery Time: 2-4 business days</li>
                  <li>• Delivery Charge: ৳120</li>
                  <li>• Free delivery on orders over ৳3000</li>
                </ul>
              </div>
            </div>
          </section>
          
          <section>
            <h3 class="text-xl font-semibold mb-4 text-primary">Delivery Process</h3>
            <div class="grid md:grid-cols-3 gap-4">
              <div class="text-center p-4">
                <div class="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-3">1</div>
                <h4 class="font-medium mb-2">Order Confirmation</h4>
                <p class="text-sm text-gray-600">We confirm your order within 2 hours</p>
              </div>
              <div class="text-center p-4">
                <div class="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-3">2</div>
                <h4 class="font-medium mb-2">Packaging</h4>
                <p class="text-sm text-gray-600">Careful packaging with baby-safe materials</p>
              </div>
              <div class="text-center p-4">
                <div class="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-3">3</div>
                <h4 class="font-medium mb-2">Delivery</h4>
                <p class="text-sm text-gray-600">Safe delivery to your doorstep</p>
              </div>
            </div>
          </section>
          
          <section class="bg-yellow-50 p-6 rounded-lg">
            <h3 class="text-xl font-semibold mb-4 text-yellow-800">Special Care for Baby Items</h3>
            <ul class="space-y-2 text-yellow-700">
              <li>✓ All baby items are carefully sanitized before packaging</li>
              <li>✓ Fragile items receive extra protective packaging</li>
              <li>✓ Temperature-sensitive products are handled with special care</li>
              <li>✓ Each package includes care instructions</li>
            </ul>
          </section>
        </div>
      </div>
    `,
    metaTitle: 'Delivery Information | Aluddin\'s Super Shop',
    metaDescription: 'Learn about our delivery options for baby items. Fast, safe delivery across Bangladesh with special care for baby products.'
  },
  {
    title: 'Terms & Conditions',
    slug: 'terms',
    content: `
      <div class="max-w-4xl mx-auto">
        <h2 class="text-2xl font-bold mb-6 text-primary">Terms & Conditions</h2>
        <div class="space-y-8">
          <div class="bg-yellow-50 p-6 rounded-lg">
            <p class="text-yellow-800">
              By using Aluddin's Super Shop website and services, you agree to these terms and conditions. 
              Please read them carefully before making any purchases.
            </p>
          </div>
          
          <section>
            <h3 class="text-xl font-semibold mb-4 text-primary">Product Information</h3>
            <div class="space-y-4 text-gray-600">
              <p>
                We strive to provide accurate product descriptions, images, and pricing. However, 
                we do not warrant that product descriptions or content is error-free, complete, 
                reliable, current, or accurate.
              </p>
              <p>
                All baby products meet safety standards and regulations. We recommend following 
                manufacturer guidelines for age-appropriate use.
              </p>
            </div>
          </section>
          
          <section>
            <h3 class="text-xl font-semibold mb-4 text-primary">Ordering and Payment</h3>
            <div class="space-y-4">
              <div>
                <h4 class="font-medium mb-2">Order Acceptance</h4>
                <p class="text-sm text-gray-600">
                  We reserve the right to refuse or cancel any order for any reason, including 
                  product availability, errors in pricing, or suspected fraud.
                </p>
              </div>
              <div>
                <h4 class="font-medium mb-2">Payment Terms</h4>
                <ul class="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• Cash on Delivery (COD) available</li>
                  <li>• Online payment via bKash, Nagad, Rocket</li>
                  <li>• Bank transfer options available</li>
                  <li>• All prices are in Bangladeshi Taka (BDT)</li>
                </ul>
              </div>
            </div>
          </section>
          
          <section>
            <h3 class="text-xl font-semibold mb-4 text-primary">Delivery Terms</h3>
            <div class="bg-blue-50 p-4 rounded-lg">
              <ul class="text-blue-700 space-y-2">
                <li>• Delivery times are estimates and may vary</li>
                <li>• Risk of loss transfers to customer upon delivery</li>
                <li>• Customer must inspect products upon delivery</li>
                <li>• Any damage during shipping must be reported within 24 hours</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    `,
    metaTitle: 'Terms & Conditions | Aluddin\'s Super Shop',
    metaDescription: 'Read our terms and conditions for shopping at Aluddin\'s Super Shop. Important information about orders, delivery, and policies.'
  },
  {
    title: 'Privacy Policy',
    slug: 'privacy',
    content: `
      <div class="max-w-4xl mx-auto">
        <h2 class="text-2xl font-bold mb-6 text-primary">Privacy Policy</h2>
        <div class="space-y-8">
          <div class="bg-blue-50 p-6 rounded-lg">
            <p class="text-blue-800">
              At Aluddin's Super Shop, we are committed to protecting your privacy and ensuring 
              the security of your personal information. This policy explains how we collect, 
              use, and protect your data.
            </p>
          </div>
          
          <section>
            <h3 class="text-xl font-semibold mb-4 text-primary">Information We Collect</h3>
            <div class="space-y-4">
              <div>
                <h4 class="font-medium mb-2">Personal Information</h4>
                <ul class="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• Name, email address, and phone number</li>
                  <li>• Delivery address and billing information</li>
                  <li>• Order history and preferences</li>
                </ul>
              </div>
              <div>
                <h4 class="font-medium mb-2">Automatically Collected Information</h4>
                <ul class="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• Website usage data and cookies</li>
                  <li>• Device information and IP address</li>
                  <li>• Browser type and operating system</li>
                </ul>
              </div>
            </div>
          </section>
          
          <section>
            <h3 class="text-xl font-semibold mb-4 text-primary">Data Security</h3>
            <div class="bg-green-50 p-4 rounded-lg">
              <ul class="text-green-700 space-y-2">
                <li>✓ SSL encryption for all transactions</li>
                <li>✓ Secure payment processing</li>
                <li>✓ Regular security audits</li>
                <li>✓ Limited access to personal data</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    `,
    metaTitle: 'Privacy Policy | Aluddin\'s Super Shop',
    metaDescription: 'Read our privacy policy to understand how we collect, use, and protect your personal information at Aluddin\'s Super Shop.'
  },
  {
    title: 'Trade Shows',
    slug: 'trade-shows',
    content: `
      <div class="max-w-4xl mx-auto">
        <h2 class="text-2xl font-bold mb-6 text-primary">Trade Shows</h2>
        <p class="text-gray-700 mb-4">Discover our participation in national and international trade shows. We showcase our latest products, connect with partners, and stay updated with industry trends to bring you the best in baby and children’s products.</p>
        <ul class="list-disc ml-6 text-gray-600">
          <li>Annual Baby & Kids Expo, Dhaka</li>
          <li>International Toy Fair, Germany</li>
          <li>Local Community Baby Fairs</li>
        </ul>
      </div>
    `,
    metaTitle: 'Trade Shows | Aluddin\'s Super Shop',
    metaDescription: 'Learn about our participation in trade shows and expos. Stay updated with our latest events and product showcases.'
  },
  {
    title: 'Ethical Policy',
    slug: 'ethics',
    content: `
      <div class="max-w-4xl mx-auto">
        <h2 class="text-2xl font-bold mb-6 text-primary">Ethical Policy</h2>
        <p class="text-gray-700 mb-4">We are committed to ethical business practices. Our products are sourced responsibly, and we ensure fair labor, safe working conditions, and respect for human rights throughout our supply chain.</p>
        <ul class="list-disc ml-6 text-gray-600">
          <li>No child labor or forced labor</li>
          <li>Fair wages and safe workplaces</li>
          <li>Transparent sourcing and supplier audits</li>
        </ul>
      </div>
    `,
    metaTitle: 'Ethical Policy | Aluddin\'s Super Shop',
    metaDescription: 'Read about our ethical sourcing, fair labor, and responsible business practices at Aluddin\'s Super Shop.'
  },
  {
    title: 'Sustainability Mission',
    slug: 'sustainability',
    content: `
      <div class="max-w-4xl mx-auto">
        <h2 class="text-2xl font-bold mb-6 text-primary">Sustainability Mission</h2>
        <p class="text-gray-700 mb-4">Our mission is to reduce our environmental impact and promote sustainability. We use eco-friendly packaging, support green initiatives, and encourage responsible consumption for a better future.</p>
        <ul class="list-disc ml-6 text-gray-600">
          <li>Eco-friendly and recyclable packaging</li>
          <li>Energy-efficient operations</li>
          <li>Support for local and sustainable products</li>
        </ul>
      </div>
    `,
    metaTitle: 'Sustainability Mission | Aluddin\'s Super Shop',
    metaDescription: 'Discover our sustainability mission and eco-friendly initiatives at Aluddin\'s Super Shop.'
  },

  // ABOUT US SECTION PAGES
  {
    title: 'Our Story',
    slug: 'our-story',
    content: `
      <div class="max-w-4xl mx-auto">
        <h2 class="text-2xl font-bold mb-6 text-primary">Our Story</h2>
        <div class="space-y-8">
          
          <div class="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
            <h3 class="text-xl font-semibold mb-4 text-primary">A Journey Born from Love</h3>
            <p class="text-gray-700 leading-relaxed">
              Aluddin's Super Shop began as a dream in the heart of a young father who wanted nothing but the best for his newborn child. What started as a small collection of carefully selected baby items has grown into Bangladesh's trusted destination for premium baby products.
            </p>
          </div>

          <section>
            <h3 class="text-xl font-semibold mb-4 text-primary">The Beginning (2015)</h3>
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <p class="text-gray-600 mb-4">
                  In 2015, when Aluddin became a father for the first time, he struggled to find quality baby products that met international safety standards at affordable prices in Bangladesh. The market was filled with either very expensive imported items or products of questionable quality.
                </p>
                <p class="text-gray-600">
                  This personal experience sparked an idea: "Why not create a place where every parent can access premium baby products without breaking the bank?"
                </p>
              </div>
              <div class="bg-gray-50 p-4 rounded-lg">
                <h4 class="font-medium text-primary mb-2">Our First Values</h4>
                <ul class="text-sm text-gray-600 space-y-1">
                  <li>✓ Safety first, always</li>
                  <li>✓ Quality without compromise</li>
                  <li>✓ Affordable for every family</li>
                  <li>✓ Trust through transparency</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h3 class="text-xl font-semibold mb-4 text-primary">Growing with Families (2016-2020)</h3>
            <div class="space-y-4">
              <p class="text-gray-600">
                What started as a small shop quickly grew as word spread among parents. We realized that our mission resonated with thousands of families across Bangladesh who were looking for the same thing - reliable, safe, and affordable baby products.
              </p>
              <div class="grid md:grid-cols-3 gap-4">
                <div class="text-center p-4">
                  <div class="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">👶</div>
                  <h4 class="font-medium mb-2">2016</h4>
                  <p class="text-sm text-gray-600">Served our first 100 families</p>
                </div>
                <div class="text-center p-4">
                  <div class="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">🌟</div>
                  <h4 class="font-medium mb-2">2018</h4>
                  <p class="text-sm text-gray-600">Expanded to 500+ products</p>
                </div>
                <div class="text-center p-4">
                  <div class="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">🚚</div>
                  <h4 class="font-medium mb-2">2020</h4>
                  <p class="text-sm text-gray-600">Launched nationwide delivery</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h3 class="text-xl font-semibold mb-4 text-primary">Digital Transformation (2021-Present)</h3>
            <div class="bg-blue-50 p-6 rounded-lg">
              <p class="text-blue-800 mb-4">
                The pandemic taught us the importance of being accessible to families when they need us most. We launched our online platform to ensure that no parent has to compromise on their baby's needs, regardless of circumstances.
              </p>
              <div class="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 class="font-medium text-blue-800 mb-2">What We've Achieved</h4>
                  <ul class="text-sm text-blue-700 space-y-1">
                    <li>• 10,000+ happy families served</li>
                    <li>• 1,000+ baby products available</li>
                    <li>• Delivery to all 64 districts</li>
                    <li>• 99.5% customer satisfaction rate</li>
                  </ul>
                </div>
                <div>
                  <h4 class="font-medium text-blue-800 mb-2">Our Promise Today</h4>
                  <ul class="text-sm text-blue-700 space-y-1">
                    <li>• Quality products you can trust</li>
                    <li>• Expert advice from parent to parent</li>
                    <li>• Fast, reliable delivery</li>
                    <li>• Customer service that cares</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h3 class="text-xl font-semibold mb-4 text-primary">Our Vision for the Future</h3>
            <div class="space-y-4">
              <p class="text-gray-600">
                As we look ahead, our vision remains unchanged: to be the most trusted partner for parents in Bangladesh. We're continuously expanding our product range, improving our services, and finding new ways to support families in their parenting journey.
              </p>
              <div class="bg-green-50 p-4 rounded-lg">
                <h4 class="font-medium text-green-800 mb-2">🌱 Coming Soon</h4>
                <ul class="text-sm text-green-700 space-y-1">
                  <li>• Parenting workshops and classes</li>
                  <li>• Exclusive baby product lines</li>
                  <li>• Mobile app for easier shopping</li>
                  <li>• Subscription boxes for growing babies</li>
                </ul>
              </div>
            </div>
          </section>

          <section class="bg-primary/10 p-6 rounded-lg">
            <h3 class="text-xl font-semibold mb-4 text-primary">Thank You for Being Part of Our Story</h3>
            <p class="text-gray-700">
              Every family we serve becomes part of our extended family. Your trust, feedback, and support have helped us grow from a small shop to a nationwide brand. As we continue this journey, we promise to never forget our roots and the values that started it all - providing the best for your babies, because they deserve nothing less.
            </p>
          </section>
        </div>
      </div>
    `,
    metaTitle: 'Our Story | Aluddin\'s Super Shop - From Dreams to Reality',
    metaDescription: 'Discover the inspiring story behind Aluddin\'s Super Shop - how a father\'s love for his child grew into Bangladesh\'s trusted baby products destination.'
  },
  {
    title: 'Showroom',
    slug: 'showroom',
    content: `
      <div class="max-w-4xl mx-auto">
        <h2 class="text-2xl font-bold mb-6 text-primary">Visit Our Showroom</h2>
        <div class="space-y-8">
          
          <div class="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
            <h3 class="text-xl font-semibold mb-4 text-primary">Experience Baby Products in Person</h3>
            <p class="text-gray-700 leading-relaxed">
              Our showroom is designed with families in mind. Come and see, touch, and test our baby products 
              in a comfortable, welcoming environment where your little ones are always welcome.
            </p>
          </div>

          <section>
            <h3 class="text-xl font-semibold mb-4 text-primary">Showroom Features</h3>
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div class="bg-white border border-gray-200 p-4 rounded-lg">
                <div class="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mb-3">👶</div>
                <h4 class="font-medium text-primary mb-2">Interactive Baby Zone</h4>
                <p class="text-sm text-gray-600">Safe play area where babies can try products while parents shop</p>
              </div>
              <div class="bg-white border border-gray-200 p-4 rounded-lg">
                <div class="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mb-3">🛏️</div>
                <h4 class="font-medium text-primary mb-2">Sleep & Furniture Display</h4>
                <p class="text-sm text-gray-600">Full-size cribs, strollers, and furniture you can test</p>
              </div>
              <div class="bg-white border border-gray-200 p-4 rounded-lg">
                <div class="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mb-3">🍼</div>
                <h4 class="font-medium text-primary mb-2">Feeding Station</h4>
                <p class="text-sm text-gray-600">Comfortable area to feed and change your baby while shopping</p>
              </div>
              <div class="bg-white border border-gray-200 p-4 rounded-lg">
                <div class="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mb-3">👨‍👩‍👧‍👦</div>
                <h4 class="font-medium text-primary mb-2">Family Consultation Area</h4>
                <p class="text-sm text-gray-600">Private space for product recommendations and advice</p>
              </div>
              <div class="bg-white border border-gray-200 p-4 rounded-lg">
                <div class="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mb-3">🎈</div>
                <h4 class="font-medium text-primary mb-2">Kids Play Corner</h4>
                <p class="text-sm text-gray-600">Safe play area for older siblings while parents browse</p>
              </div>
              <div class="bg-white border border-gray-200 p-4 rounded-lg">
                <div class="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mb-3">🛒</div>
                <h4 class="font-medium text-primary mb-2">Easy Shopping Experience</h4>
                <p class="text-sm text-gray-600">Wide aisles, clear organization, and baby-cart accessibility</p>
              </div>
            </div>
          </section>

          <section>
            <h3 class="text-xl font-semibold mb-4 text-primary">Showroom Location & Hours</h3>
            <div class="grid md:grid-cols-2 gap-8">
              <div class="bg-blue-50 p-6 rounded-lg">
                <h4 class="font-medium text-blue-800 mb-4">📍 Location</h4>
                <div class="space-y-2 text-blue-700">
                  <p class="font-medium">Aluddin's Super Shop Showroom</p>
                  <p>123 Baby Street, Ground Floor</p>
                  <p>Dhanmondi, Dhaka 1205</p>
                  <p>Near Dhanmondi Lake (Opposite City Hospital)</p>
                </div>
                <div class="mt-4">
                  <a href="#" class="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">Get Directions</a>
                </div>
              </div>
              <div class="bg-green-50 p-6 rounded-lg">
                <h4 class="font-medium text-green-800 mb-4">🕒 Opening Hours</h4>
                <div class="space-y-2 text-green-700 text-sm">
                  <div class="flex justify-between">
                    <span>Saturday - Thursday:</span>
                    <span class="font-medium">9:00 AM - 8:00 PM</span>
                  </div>
                  <div class="flex justify-between">
                    <span>Friday:</span>
                    <span class="font-medium">2:00 PM - 8:00 PM</span>
                  </div>
                  <div class="mt-3 p-2 bg-green-100 rounded">
                    <p class="text-xs">Extended hours during Eid and special occasions</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h3 class="text-xl font-semibold mb-4 text-primary">Services Available at Showroom</h3>
            <div class="bg-gray-50 p-6 rounded-lg">
              <div class="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 class="font-medium text-primary mb-3">🛍️ Shopping Services</h4>
                  <ul class="text-sm text-gray-600 space-y-1">
                    <li>• Product demonstration and testing</li>
                    <li>• Size and fit consultation</li>
                    <li>• Age-appropriate recommendations</li>
                    <li>• Gift wrapping services</li>
                    <li>• Same-day pickup available</li>
                  </ul>
                </div>
                <div>
                  <h4 class="font-medium text-primary mb-3">👨‍⚕️ Expert Services</h4>
                  <ul class="text-sm text-gray-600 space-y-1">
                    <li>• Parenting advice from experienced staff</li>
                    <li>• Product safety consultations</li>
                    <li>• Custom product orders</li>
                    <li>• Returns and exchanges</li>
                    <li>• Loyalty program enrollment</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section class="bg-yellow-50 p-6 rounded-lg">
            <h3 class="text-xl font-semibold mb-4 text-yellow-800">Special Events & Workshops</h3>
            <div class="space-y-4">
              <p class="text-yellow-700">
                Our showroom regularly hosts special events for parents and families:
              </p>
              <div class="grid md:grid-cols-2 gap-4">
                <ul class="text-sm text-yellow-700 space-y-1">
                  <li>• Monthly parenting workshops</li>
                  <li>• Baby product demonstrations</li>
                  <li>• New parent support groups</li>
                  <li>• Seasonal sales events</li>
                </ul>
                <ul class="text-sm text-yellow-700 space-y-1">
                  <li>• Product launch previews</li>
                  <li>• Kids' birthday party packages</li>
                  <li>• Breastfeeding support sessions</li>
                  <li>• Baby photography sessions</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h3 class="text-xl font-semibold mb-4 text-primary">Visit Us Today</h3>
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <p class="text-gray-600 mb-4">
                  We'd love to welcome you and your family to our showroom. Our friendly staff is ready 
                  to help you find exactly what you need for your little one.
                </p>
                <div class="space-y-2">
                  <p class="text-sm text-gray-600">📞 Call ahead to reserve consultation time</p>
                  <p class="text-sm text-gray-600">🚗 Free parking available</p>
                  <p class="text-sm text-gray-600">♿ Wheelchair and stroller accessible</p>
                </div>
              </div>
              <div class="bg-primary/10 p-4 rounded-lg">
                <h4 class="font-medium text-primary mb-2">Contact Information</h4>
                <div class="space-y-1 text-sm">
                  <p>📞 Phone: +880 1534 207276</p>
                  <p>📧 Email: showroom@alauddinssupershop.com</p>
                  <p>💬 WhatsApp: +880 1534 207276</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    `,
    metaTitle: 'Visit Our Showroom | Aluddin\'s Super Shop',
    metaDescription: 'Visit our family-friendly showroom in Dhaka. Interactive displays, expert consultation, and hands-on experience with baby products.'
  },
  {
    title: 'Lookbook',
    slug: 'lookbook',
    content: `
      <div class="max-w-4xl mx-auto">
        <h2 class="text-2xl font-bold mb-6 text-primary">Baby Style Lookbook</h2>
        <div class="space-y-8">
          
          <div class="bg-gradient-to-r from-pink-50 to-blue-50 p-6 rounded-lg">
            <h3 class="text-xl font-semibold mb-4 text-primary">Inspire Your Baby's Style Journey</h3>
            <p class="text-gray-700 leading-relaxed">
              Discover adorable outfit combinations, nursery setups, and styling tips that make your 
              baby look and feel amazing. Our lookbook showcases real families and their beautiful 
              moments with our products.
            </p>
          </div>

          <section>
            <h3 class="text-xl font-semibold mb-4 text-primary">Seasonal Collections</h3>
            <div class="grid md:grid-cols-2 gap-6">
              <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div class="bg-gradient-to-r from-yellow-100 to-orange-100 p-4">
                  <h4 class="font-medium text-orange-800 mb-2">🌞 Summer Comfort Collection</h4>
                  <p class="text-sm text-orange-700">Light, breathable fabrics perfect for Bangladesh's hot weather</p>
                </div>
                <div class="p-4">
                  <ul class="text-sm text-gray-600 space-y-1">
                    <li>• Cotton rompers and onesies</li>
                    <li>• Breathable sleep sets</li>
                    <li>• Sun protection accessories</li>
                    <li>• Light blankets and swaddles</li>
                  </ul>
                </div>
              </div>
              <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div class="bg-gradient-to-r from-blue-100 to-gray-100 p-4">
                  <h4 class="font-medium text-blue-800 mb-2">🌧️ Monsoon Ready Collection</h4>
                  <p class="text-sm text-blue-700">Cozy and protective clothing for rainy season</p>
                </div>
                <div class="p-4">
                  <ul class="text-sm text-gray-600 space-y-1">
                    <li>• Water-resistant outer wear</li>
                    <li>• Quick-dry fabrics</li>
                    <li>• Warm layering pieces</li>
                    <li>• Anti-slip socks and shoes</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h3 class="text-xl font-semibold mb-4 text-primary">Age-Based Style Guides</h3>
            <div class="space-y-6">
              <div class="bg-purple-50 p-6 rounded-lg">
                <h4 class="font-medium text-purple-800 mb-4">👶 Newborn (0-3 months)</h4>
                <div class="grid md:grid-cols-3 gap-4">
                  <div>
                    <h5 class="text-sm font-medium mb-2">Essential Pieces</h5>
                    <ul class="text-xs text-gray-600 space-y-1">
                      <li>• Soft cotton bodysuits</li>
                      <li>• Kimono-style tops</li>
                      <li>• Footless pants</li>
                      <li>• Sleep gowns</li>
                    </ul>
                  </div>
                  <div>
                    <h5 class="text-sm font-medium mb-2">Comfort Features</h5>
                    <ul class="text-xs text-gray-600 space-y-1">
                      <li>• No buttons on the back</li>
                      <li>• Easy diaper access</li>
                      <li>• Soft, tagless labels</li>
                      <li>• Expandable necklines</li>
                    </ul>
                  </div>
                  <div>
                    <h5 class="text-sm font-medium mb-2">Color Palette</h5>
                    <ul class="text-xs text-gray-600 space-y-1">
                      <li>• Soft pastels</li>
                      <li>• Gender-neutral tones</li>
                      <li>• Calming colors</li>
                      <li>• Natural whites and creams</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div class="bg-green-50 p-6 rounded-lg">
                <h4 class="font-medium text-green-800 mb-4">🍼 Infant (3-12 months)</h4>
                <div class="grid md:grid-cols-3 gap-4">
                  <div>
                    <h5 class="text-sm font-medium mb-2">Active Wear</h5>
                    <ul class="text-xs text-gray-600 space-y-1">
                      <li>• Stretchy leggings</li>
                      <li>• Play-friendly tops</li>
                      <li>• Crawler-friendly knees</li>
                      <li>• Easy-wash fabrics</li>
                    </ul>
                  </div>
                  <div>
                    <h5 class="text-sm font-medium mb-2">Development Support</h5>
                    <ul class="text-xs text-gray-600 space-y-1">
                      <li>• Non-slip socks</li>
                      <li>• Sensory-friendly textures</li>
                      <li>• Tummy-time friendly</li>
                      <li>• Safe closures</li>
                    </ul>
                  </div>
                  <div>
                    <h5 class="text-sm font-medium mb-2">Fun Patterns</h5>
                    <ul class="text-xs text-gray-600 space-y-1">
                      <li>• Animal prints</li>
                      <li>• Geometric patterns</li>
                      <li>• Bright, engaging colors</li>
                      <li>• Educational motifs</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div class="bg-orange-50 p-6 rounded-lg">
                <h4 class="font-medium text-orange-800 mb-4">🚶 Toddler (12+ months)</h4>
                <div class="grid md:grid-cols-3 gap-4">
                  <div>
                    <h5 class="text-sm font-medium mb-2">Active Explorer</h5>
                    <ul class="text-xs text-gray-600 space-y-1">
                      <li>• Durable play clothes</li>
                      <li>• Comfortable shoes</li>
                      <li>• Layering pieces</li>
                      <li>• Weather protection</li>
                    </ul>
                  </div>
                  <div>
                    <h5 class="text-sm font-medium mb-2">Independence Features</h5>
                    <ul class="text-xs text-gray-600 space-y-1">
                      <li>• Easy-on designs</li>
                      <li>• Velcro fastenings</li>
                      <li>• Learning-friendly buttons</li>
                      <li>• Size indicators</li>
                    </ul>
                  </div>
                  <div>
                    <h5 class="text-sm font-medium mb-2">Personal Expression</h5>
                    <ul class="text-xs text-gray-600 space-y-1">
                      <li>• Character themes</li>
                      <li>• Favorite colors</li>
                      <li>• Mix-and-match sets</li>
                      <li>• Special occasion wear</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h3 class="text-xl font-semibold mb-4 text-primary">Nursery Style Inspiration</h3>
            <div class="grid md:grid-cols-2 gap-6">
              <div class="bg-blue-50 p-4 rounded-lg">
                <h4 class="font-medium text-blue-800 mb-3">🌙 Peaceful Sleep Haven</h4>
                <ul class="text-sm text-blue-700 space-y-1">
                  <li>• Soft, muted color schemes</li>
                  <li>• Blackout curtains for better sleep</li>
                  <li>• Comfortable nursing chair</li>
                  <li>• Night light with timer</li>
                  <li>• Sound machine for white noise</li>
                </ul>
              </div>
              <div class="bg-pink-50 p-4 rounded-lg">
                <h4 class="font-medium text-pink-800 mb-3">🎨 Creative Play Space</h4>
                <ul class="text-sm text-pink-700 space-y-1">
                  <li>• Bright, stimulating colors</li>
                  <li>• Soft play mats and rugs</li>
                  <li>• Organized toy storage</li>
                  <li>• Art display area</li>
                  <li>• Reading nook with cushions</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h3 class="text-xl font-semibold mb-4 text-primary">Styling Tips from Parents</h3>
            <div class="bg-gray-50 p-6 rounded-lg">
              <div class="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 class="font-medium text-primary mb-3">👩‍👧 Mom's Favorites</h4>
                  <ul class="text-sm text-gray-600 space-y-2">
                    <li>• "Always have backup outfits in your diaper bag"</li>
                    <li>• "Choose prints that hide stains well"</li>
                    <li>• "Invest in quality basics that mix and match"</li>
                    <li>• "Comfort over cuteness for everyday wear"</li>
                  </ul>
                </div>
                <div>
                  <h4 class="font-medium text-primary mb-3">👨‍👦 Dad's Practical Tips</h4>
                  <ul class="text-sm text-gray-600 space-y-2">
                    <li>• "Snap closures are faster than buttons"</li>
                    <li>• "Check washing instructions before buying"</li>
                    <li>• "Size up for longer wear and comfort"</li>
                    <li>• "Dark colors hide everyday wear better"</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section class="bg-primary/10 p-6 rounded-lg">
            <h3 class="text-xl font-semibold mb-4 text-primary">Share Your Style</h3>
            <div class="space-y-4">
              <p class="text-gray-700">
                We love seeing how our products look in real homes with real families! 
                Share your baby's style moments with us and get featured in our lookbook.
              </p>
              <div class="flex flex-col sm:flex-row gap-3">
                <a href="#" class="bg-primary text-white px-4 py-2 rounded-lg text-center hover:bg-primary/90 transition-colors">Share on Instagram</a>
                <a href="#" class="border border-primary text-primary px-4 py-2 rounded-lg text-center hover:bg-primary/10 transition-colors">Submit Photos</a>
              </div>
              <p class="text-xs text-gray-500">Tag us @alauddinsupershop or use #AlauddinBabyStyle</p>
            </div>
          </section>
        </div>
      </div>
    `,
    metaTitle: 'Baby Style Lookbook | Aluddin\'s Super Shop',
    metaDescription: 'Get inspired with our baby style lookbook. Seasonal collections, age-based guides, and nursery inspiration for your little one.'
  },
  {
    title: 'About Us',
    slug: 'about',
    content: `
      <div class="max-w-4xl mx-auto">
        <h2 class="text-2xl font-bold mb-6 text-primary">About Aluddin's Super Shop</h2>
        <div class="space-y-6">
          <p class="text-lg leading-relaxed">
            Welcome to Aluddin's Super Shop, your trusted destination for premium baby items and essentials. 
            We are dedicated to providing the highest quality products for your little ones, ensuring their 
            comfort, safety, and happiness.
          </p>
          
          <div class="grid md:grid-cols-2 gap-8">
            <div>
              <h3 class="text-xl font-semibold mb-4 text-primary">Our Mission</h3>
              <p>
                To provide parents with the best baby products at affordable prices, ensuring every child 
                gets the care and comfort they deserve. We believe in quality, safety, and exceptional 
                customer service.
              </p>
            </div>
            <div>
              <h3 class="text-xl font-semibold mb-4 text-primary">Why Choose Us?</h3>
              <ul class="space-y-2">
                <li>✓ Premium quality baby products</li>
                <li>✓ Safe and certified items</li>
                <li>✓ Competitive prices</li>
                <li>✓ Fast and reliable delivery</li>
                <li>✓ Excellent customer support</li>
              </ul>
            </div>
          </div>
          
          <div class="bg-gray-50 p-6 rounded-lg">
            <h3 class="text-xl font-semibold mb-4 text-primary">Our Story</h3>
            <p>
              Founded with love and care for children, Aluddin's Super Shop started as a small family 
              business with the vision of making quality baby products accessible to all parents. 
              Today, we serve thousands of happy families across Bangladesh.
            </p>
          </div>
        </div>
      </div>
    `,
    metaTitle: 'About Us | Aluddin\'s Super Shop - Premium Baby Items',
    metaDescription: 'Learn about Aluddin\'s Super Shop, your trusted destination for premium baby items. Discover our mission, values, and commitment to quality.'
  },
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
            <div class="space-y-4">
              <p class="text-gray-600">
                We're here to help you find the perfect products for your baby. 
                Our knowledgeable team is ready to assist with product recommendations, 
                orders, and any questions you may have.
              </p>
              <div class="bg-blue-50 p-4 rounded-lg">
                <h4 class="font-medium text-primary mb-2">Quick Support</h4>
                <p class="text-sm text-gray-600">
                  For urgent inquiries, call us directly or visit our store. 
                  We also offer WhatsApp support for your convenience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
    metaTitle: 'Contact Us | Aluddin\'s Super Shop',
    metaDescription: 'Get in touch with Aluddin\'s Super Shop. Find our contact information, store location, and customer support details.'
  },
  {
    title: 'Shipping & Delivery',
    slug: 'shipping',
    content: `
      <div class="max-w-4xl mx-auto">
        <h2 class="text-2xl font-bold mb-6 text-primary">Shipping & Delivery Information</h2>
        <div class="space-y-8">
          <section>
            <h3 class="text-xl font-semibold mb-4 text-primary">Delivery Areas</h3>
            <div class="grid md:grid-cols-2 gap-6">
              <div class="bg-green-50 p-4 rounded-lg">
                <h4 class="font-medium text-green-800 mb-2">🚚 Inside Dhaka</h4>
                <ul class="text-sm text-green-700 space-y-1">
                  <li>• Delivery Time: 1-2 business days</li>
                  <li>• Delivery Charge: ৳60</li>
                  <li>• Free delivery on orders over ৳2000</li>
                </ul>
              </div>
              <div class="bg-blue-50 p-4 rounded-lg">
                <h4 class="font-medium text-blue-800 mb-2">🚛 Outside Dhaka</h4>
                <ul class="text-sm text-blue-700 space-y-1">
                  <li>• Delivery Time: 2-4 business days</li>
                  <li>• Delivery Charge: ৳120</li>
                  <li>• Free delivery on orders over ৳3000</li>
                </ul>
              </div>
            </div>
          </section>
          
          <section>
            <h3 class="text-xl font-semibold mb-4 text-primary">Delivery Process</h3>
            <div class="grid md:grid-cols-3 gap-4">
              <div class="text-center p-4">
                <div class="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-3">1</div>
                <h4 class="font-medium mb-2">Order Confirmation</h4>
                <p class="text-sm text-gray-600">We confirm your order within 2 hours</p>
              </div>
              <div class="text-center p-4">
                <div class="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-3">2</div>
                <h4 class="font-medium mb-2">Packaging</h4>
                <p class="text-sm text-gray-600">Careful packaging with baby-safe materials</p>
              </div>
              <div class="text-center p-4">
                <div class="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-3">3</div>
                <h4 class="font-medium mb-2">Delivery</h4>
                <p class="text-sm text-gray-600">Safe delivery to your doorstep</p>
              </div>
            </div>
          </section>
          
          <section class="bg-yellow-50 p-6 rounded-lg">
            <h3 class="text-xl font-semibold mb-4 text-yellow-800">Special Care for Baby Items</h3>
            <ul class="space-y-2 text-yellow-700">
              <li>✓ All baby items are carefully sanitized before packaging</li>
              <li>✓ Fragile items receive extra protective packaging</li>
              <li>✓ Temperature-sensitive products are handled with special care</li>
              <li>✓ Each package includes care instructions</li>
            </ul>
          </section>
        </div>
      </div>
    `,
    metaTitle: 'Shipping & Delivery | Aluddin\'s Super Shop',
    metaDescription: 'Learn about our shipping and delivery options for baby items. Fast, safe delivery across Bangladesh with special care for baby products.'
  },
  {
    title: 'Return & Exchange Policy',
    slug: 'returns',
    content: `
      <div class="max-w-4xl mx-auto">
        <h2 class="text-2xl font-bold mb-6 text-primary">Return & Exchange Policy</h2>
        <div class="space-y-8">
          <div class="bg-green-50 p-6 rounded-lg">
            <h3 class="text-xl font-semibold mb-4 text-green-800">Easy Returns for Baby Items</h3>
            <p class="text-green-700">
              We understand that shopping for baby items can be challenging. That's why we offer 
              a hassle-free return and exchange policy to ensure your complete satisfaction.
            </p>
          </div>
          
          <section>
            <h3 class="text-xl font-semibold mb-4 text-primary">Return Period</h3>
            <div class="grid md:grid-cols-2 gap-6">
              <div class="border border-gray-200 p-4 rounded-lg">
                <h4 class="font-medium mb-2">📦 Unopened Items</h4>
                <p class="text-sm text-gray-600">30 days from delivery date</p>
              </div>
              <div class="border border-gray-200 p-4 rounded-lg">
                <h4 class="font-medium mb-2">👶 Used Baby Items</h4>
                <p class="text-sm text-gray-600">7 days from delivery (hygiene items not returnable)</p>
              </div>
            </div>
          </section>
          
          <section>
            <h3 class="text-xl font-semibold mb-4 text-primary">Return Conditions</h3>
            <div class="space-y-4">
              <div class="flex items-start space-x-3">
                <div class="text-green-500 mt-1">✓</div>
                <div>
                  <h4 class="font-medium">Original Packaging</h4>
                  <p class="text-sm text-gray-600">Items must be in original packaging with all tags attached</p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <div class="text-green-500 mt-1">✓</div>
                <div>
                  <h4 class="font-medium">Receipt Required</h4>
                  <p class="text-sm text-gray-600">Original receipt or order confirmation email needed</p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <div class="text-green-500 mt-1">✓</div>
                <div>
                  <h4 class="font-medium">Quality Check</h4>
                  <p class="text-sm text-gray-600">Items will be inspected for damage or excessive use</p>
                </div>
              </div>
            </div>
          </section>
          
          <section>
            <h3 class="text-xl font-semibold mb-4 text-primary">Non-Returnable Items</h3>
            <div class="bg-red-50 p-4 rounded-lg">
              <ul class="space-y-2 text-red-700 text-sm">
                <li>• Opened baby food, formula, or consumables</li>
                <li>• Used diapers, wipes, or hygiene products</li>
                <li>• Personalized or customized items</li>
                <li>• Items damaged by misuse</li>
              </ul>
            </div>
          </section>
          
          <section>
            <h3 class="text-xl font-semibold mb-4 text-primary">How to Return</h3>
            <div class="grid md:grid-cols-3 gap-4">
              <div class="text-center p-4">
                <div class="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-3">1</div>
                <h4 class="font-medium mb-2">Contact Us</h4>
                <p class="text-sm text-gray-600">Call or email us about your return</p>
              </div>
              <div class="text-center p-4">
                <div class="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-3">2</div>
                <h4 class="font-medium mb-2">Package Items</h4>
                <p class="text-sm text-gray-600">Pack items securely in original packaging</p>
              </div>
              <div class="text-center p-4">
                <div class="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-3">3</div>
                <h4 class="font-medium mb-2">Get Refund</h4>
                <p class="text-sm text-gray-600">Receive refund within 5-7 business days</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    `,
    metaTitle: 'Return & Exchange Policy | Aluddin\'s Super Shop',
    metaDescription: 'Learn about our easy return and exchange policy for baby items. Hassle-free returns with flexible terms to ensure your satisfaction.'
  }
]

async function seedFooterPages() {
  try {
    console.log('🌱 Starting footer pages seeding...')

    // Clear existing footer pages
    await prisma.footerPage.deleteMany({})
    console.log('🗑️ Cleared existing footer pages')

    // Create new footer pages
    for (const page of footerPages) {
      await prisma.footerPage.create({
        data: page
      })
      console.log(`✅ Created footer page: ${page.title}`)
    }

    console.log(`🎉 Successfully seeded ${footerPages.length} footer pages!`)
    console.log('📄 Created pages:')
    footerPages.forEach(page => {
      console.log(`   • ${page.title} (/${page.slug})`)
    })

  } catch (error) {
    console.error('❌ Error seeding footer pages:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the seeding
seedFooterPages()
  .catch((error) => {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  })
