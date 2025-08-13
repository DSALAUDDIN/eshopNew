#!/usr/bin/env node

import fs from 'fs'
import path from 'path'

// Function to load template configuration
function loadTemplateConfig() {
  try {
    const configPath = path.join(process.cwd(), 'config', 'template.json')
    const configData = fs.readFileSync(configPath, 'utf8')
    return JSON.parse(configData)
  } catch (error) {
    console.error('❌ Failed to load template config:', error)
    return null
  }
}

// Function to convert hex to HSL
function hexToHsl(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0, s = 0, l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h /= 6
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`
}

async function applyFullCustomization() {
  const config = loadTemplateConfig()
  if (!config) {
    console.error('❌ Could not load template configuration')
    return
  }

  console.log('🚀 Applying full customization for:', config.branding.siteName)

  try {
    // 1. Update CSS with custom colors
    const primaryHsl = hexToHsl(config.theme.colors.primary)
    const secondaryHsl = hexToHsl(config.theme.colors.secondary)
    const accentHsl = hexToHsl(config.theme.colors.accent)
    const successHsl = hexToHsl(config.theme.colors.success)
    const errorHsl = hexToHsl(config.theme.colors.error)

    const dynamicCSS = `@tailwind base;
@tailwind components;
@tailwind utilities;

@font-face {
  font-family: "Brandon";
  src: url("/fonts/Brandon_reg.ttf") format("truetype");
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: ${primaryHsl};
    --primary-foreground: 210 40% 98%;
    --secondary: ${secondaryHsl};
    --secondary-foreground: 222.2 84% 4.9%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: ${accentHsl};
    --accent-foreground: 222.2 84% 4.9%;
    --destructive: ${errorHsl};
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: ${primaryHsl};
    --radius: 0.5rem;
    --chart-1: ${primaryHsl};
    --chart-2: ${secondaryHsl};
    --chart-3: ${accentHsl};
    --chart-4: ${successHsl};
    --chart-5: ${errorHsl};
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: ${primaryHsl};
    --primary-foreground: 222.2 84% 4.9%;
    --secondary: ${secondaryHsl};
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: ${accentHsl};
    --accent-foreground: 210 40% 98%;
    --destructive: ${errorHsl};
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
    --chart-1: ${primaryHsl};
    --chart-2: ${secondaryHsl};
    --chart-3: ${accentHsl};
    --chart-4: ${successHsl};
    --chart-5: ${errorHsl};
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}

.font-brandon {
  font-family: "Brandon", sans-serif;
}

.text-brand-primary {
  color: hsl(var(--primary));
}

.bg-brand-primary {
  background-color: hsl(var(--primary));
}

.border-brand-primary {
  border-color: hsl(var(--primary));
}

@layer utilities {
  .animate-fade-in {
    animation: fadeIn 0.5s ease-in-out;
  }
  
  .animate-slide-up {
    animation: slideUp 0.3s ease-out;
  }
  
  .animate-scale-in {
    animation: scaleIn 0.2s ease-out;
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes scaleIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}`

    fs.writeFileSync(path.join(process.cwd(), 'app', 'globals.css'), dynamicCSS)
    console.log('✅ Updated CSS with custom colors')

    // 2. Update footer with custom store name
    const footerPath = path.join(process.cwd(), 'components', 'footer.tsx')
    let footerContent = fs.readFileSync(footerPath, 'utf8')

    footerContent = footerContent.replace(
      /© \d{4} Southern Fashion & Décor\. All rights reserved\./g,
      `© ${new Date().getFullYear()} ${config.branding.siteName}. All rights reserved.`
    )

    fs.writeFileSync(footerPath, footerContent)
    console.log('✅ Updated footer with custom store name')

    // 3. Update product share messages
    const productPagePath = path.join(process.cwd(), 'app', 'product', '[id]', 'page.tsx')
    let productContent = fs.readFileSync(productPagePath, 'utf8')

    productContent = productContent.replace(
      /Check out this .* at Southern Fashion & Decor/g,
      `Check out this \${product.name} at ${config.branding.siteName}`
    )

    fs.writeFileSync(productPagePath, productContent)
    console.log('✅ Updated product share messages')

    // 4. Update site settings file
    const settingsPath = path.join(process.cwd(), 'data', 'settings.json')
    let settingsData
    try {
      settingsData = JSON.parse(fs.readFileSync(settingsPath, 'utf8'))
    } catch {
      settingsData = {}
    }

    settingsData.site_name = config.branding.siteName
    settingsData.site_description = config.branding.siteDescription
    settingsData.currency = config.ecommerce.currency
    settingsData.currency_symbol = config.ecommerce.currencySymbol

    fs.writeFileSync(settingsPath, JSON.stringify(settingsData, null, 2))
    console.log('✅ Updated site settings')

    // 5. Update package.json
    const packagePath = path.join(process.cwd(), 'package.json')
    const packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
    packageData.name = config.branding.siteName.toLowerCase().replace(/\s+/g, '-')
    packageData.description = `${config.branding.siteDescription} - Built with E-Commerce Master Template`
    fs.writeFileSync(packagePath, JSON.stringify(packageData, null, 2))
    console.log('✅ Updated package.json')

    console.log('\n🎉 Full customization applied successfully!')
    console.log('🔄 Restart your dev server to see all changes: npm run dev')

  } catch (error) {
    console.error('❌ Error applying customization:', error)
  }
}

if (require.main === module) {
  applyFullCustomization()
}

export { applyFullCustomization }
