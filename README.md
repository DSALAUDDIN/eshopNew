# E-Commerce Master Template

A high-performance, fully customizable e-commerce template built with Next.js 14, TypeScript, Prisma, and Tailwind CSS.

## 🚀 Features

### Core Features
- **Next.js 14** with App Router for optimal performance
- **TypeScript** for type safety and better development experience
- **Prisma ORM** with SQLite/PostgreSQL support
- **Tailwind CSS** for rapid UI development
- **Radix UI** components for accessibility
- **Zustand** for state management
- **React Hook Form** for form handling

### E-commerce Features
- Product catalog with categories and subcategories
- Shopping cart and checkout system
- User authentication (register/login)
- Order management system
- Review and rating system
- Admin dashboard for complete store management
- Search and filtering capabilities
- Responsive design for all devices

### Admin Dashboard
- Product management (CRUD operations)
- Category management
- Order tracking and management
- Customer management
- Review moderation
- Settings and configuration
- Social media links management
- Footer pages management

## 🛠 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone and setup**
```bash
git clone <repository-url>
cd your-project-name
npm install
```

2. **Environment Setup**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Database Setup**
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

4. **Run Development Server**
```bash
npm run dev
```

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── admin/             # Admin dashboard pages
│   ├── category/          # Category pages
│   ├── product/           # Product detail pages
│   └── ...
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   └── ...
├── lib/                   # Utilities and configurations
├── prisma/               # Database schema and migrations
├── hooks/                # Custom React hooks
└── data/                 # Static data and configurations
```

## 🎨 Customization Guide

### 1. Brand Configuration

Edit `data/settings.json`:
```json
{
  "siteName": "Your Store Name",
  "siteDescription": "Your store description",
  "logo": "/your-logo.png",
  "primaryColor": "#your-color",
  "secondaryColor": "#your-secondary-color"
}
```

### 2. Database Schema

Modify `prisma/schema.prisma` for your specific needs:
- Add custom product fields
- Modify user properties
- Add new entities

### 3. Categories

Update categories in `lib/categories.ts` or through admin dashboard.

### 4. Styling

Customize in `tailwind.config.ts`:
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: 'your-primary-color',
        secondary: 'your-secondary-color',
      }
    }
  }
}
```

### 5. Components

All components are modular and can be easily customized:
- UI components in `components/ui/`
- Business components in `components/`

## 🔧 Configuration Files

### Environment Variables (.env)
```env
# Database
DATABASE_URL="file:./dev.db"

# Authentication
JWT_SECRET="your-jwt-secret"

# Admin Credentials
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="your-secure-password"

# File Upload
UPLOAD_DIR="public/uploads"
MAX_FILE_SIZE="5MB"
```

### Deployment

#### Vercel (Recommended)
```bash
npm run build
npx vercel --prod
```

#### Other Platforms
```bash
npm run build
npm start
```

## 📊 Performance Optimizations

- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Automatic with App Router
- **Static Generation**: Pre-generated pages where possible
- **Lazy Loading**: Components and images
- **Bundle Analysis**: Built-in with Next.js

## 🛡 Security Features

- JWT-based authentication
- Input validation with Zod
- SQL injection protection with Prisma
- XSS protection
- CSRF protection

## 📱 Mobile Responsive

- Mobile-first design approach
- Touch-friendly interfaces
- Optimized for all screen sizes
- Progressive Web App ready

## 🧪 Testing

```bash
# Run tests
npm test

# Run e2e tests
npm run test:e2e
```

## 📈 Analytics & SEO

- Built-in SEO optimization
- Meta tags management
- Structured data for products
- Analytics ready (Google Analytics, etc.)

## 🔄 Migration from Other Projects

1. **Update branding** in `data/settings.json`
2. **Modify database schema** in `prisma/schema.prisma`
3. **Update categories** and products
4. **Customize styling** in Tailwind config
5. **Deploy** to your preferred platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if needed
5. Submit a pull request

## 📄 License

MIT License - feel free to use for commercial projects.

## 🆘 Support

- Documentation: [Link to docs]
- Issues: [GitHub Issues]
- Community: [Discord/Forum link]

---

**Built with ❤️ for the developer community**
