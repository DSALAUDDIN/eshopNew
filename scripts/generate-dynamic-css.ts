#!/usr/bin/env node

import fs from 'fs'
import path from 'path'

// Function to convert hex to HSL
function hexToHsl(hex: string): string {
  // Remove the hash if it exists
  hex = hex.replace('#', '')

  // Parse r, g, b values
  const r = parseInt(hex.substr(0, 2), 16) / 255
  const g = parseInt(hex.substr(2, 2), 16) / 255
  const b = parseInt(hex.substr(4, 2), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

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

  h = Math.round(h * 360)
  s = Math.round(s * 100)
  const lValue = Math.round(l * 100)

  return `${h} ${s}% ${lValue}%`
}

function generateDynamicCSS() {
  console.log('🎨 Generating dynamic CSS from theme configuration...')

  try {
    // Read the template configuration
    const configPath = path.join(process.cwd(), 'config', 'template.json')
    if (!fs.existsSync(configPath)) {
      console.error('❌ Template configuration not found!')
      return
    }

    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
    const { colors } = config.theme

    // Convert hex colors to HSL
    const primaryHsl = hexToHsl(colors.primary)
    const secondaryHsl = hexToHsl(colors.secondary)
    const accentHsl = hexToHsl(colors.accent || '#06b6d4')

    console.log(`🎨 Primary: ${colors.primary} → ${primaryHsl}`)
    console.log(`🎨 Secondary: ${colors.secondary} → ${secondaryHsl}`)
    console.log(`🎨 Accent: ${colors.accent} → ${accentHsl}`)

    // Generate the dynamic CSS content
    const cssContent = `@tailwind base;
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
    /* PRIMARY COLOR FROM THEME: ${colors.primary} */
    --primary: ${primaryHsl};
    --primary-foreground: 210 40% 98%;
    /* SECONDARY COLOR FROM THEME: ${colors.secondary} */
    --secondary: ${secondaryHsl};
    --secondary-foreground: 222.2 84% 4.9%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    /* ACCENT COLOR FROM THEME: ${colors.accent} */
    --accent: ${accentHsl};
    --accent-foreground: 222.2 84% 4.9%;
    /* ERROR COLOR FROM THEME: #ef4444 */
    --destructive: 0 84% 60%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    /* RING COLOR MATCHES PRIMARY */
    --ring: ${primaryHsl};
    --radius: 0.5rem;
    /* CHART COLORS FROM THEME */
    --chart-1: ${primaryHsl};
    --chart-2: ${secondaryHsl};
    --chart-3: ${accentHsl};
    --chart-4: 160 84% 39%;
    --chart-5: 0 84% 60%;
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
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: ${primaryHsl};
    --chart-1: ${primaryHsl};
    --chart-2: ${secondaryHsl};
    --chart-3: ${accentHsl};
    --chart-4: 160 84% 39%;
    --chart-5: 0 84% 60%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    font-family: ${config.theme.fonts.body}, sans-serif;
  }
  h1, h2, h3, h4, h5, h6 {
    font-family: ${config.theme.fonts.heading}, sans-serif;
  }
}

/* Font families */
.font-brandon {
  font-family: "Brandon", sans-serif;
}

.font-heading {
  font-family: ${config.theme.fonts.heading}, sans-serif;
}

.font-body {
  font-family: ${config.theme.fonts.body}, sans-serif;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: hsl(var(--muted));
}

::-webkit-scrollbar-thumb {
  background: hsl(var(--primary) / 0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--primary) / 0.5);
}

/* Animations */
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
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

.animate-slide-up {
  animation: slideUp 0.3s ease-out;
}

.animate-scale-in {
  animation: scaleIn 0.2s ease-out;
}`

    // Write the updated CSS file
    const cssPath = path.join(process.cwd(), 'app', 'globals.css')
    fs.writeFileSync(cssPath, cssContent, 'utf8')

    console.log('✅ Dynamic CSS generated successfully!')
    console.log(`🎨 Store: ${config.branding.siteName}`)
    console.log(`🎨 Primary Color: ${colors.primary} (HSL: ${primaryHsl})`)
    console.log(`🎨 Secondary Color: ${colors.secondary} (HSL: ${secondaryHsl})`)
    console.log('🔄 Your app will now use dynamic colors from theme configuration!')

  } catch (error) {
    console.error('❌ Error generating dynamic CSS:', error)
  }
}

if (require.main === module) {
  generateDynamicCSS()
}

export { generateDynamicCSS }
