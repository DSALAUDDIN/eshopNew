#!/usr/bin/env node

import fs from 'fs'
import path from 'path'

// Function to convert hex color to HSL values for CSS variables
function hexToHsl(hex: string): string {
  // Remove the hash if present
  hex = hex.replace('#', '')

  // Parse the hex values
  const r = parseInt(hex.slice(0, 2), 16) / 255
  const g = parseInt(hex.slice(2, 4), 16) / 255
  const b = parseInt(hex.slice(4, 6), 16) / 255

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

function loadThemeConfig() {
  try {
    const configPath = path.join(process.cwd(), 'config', 'template.json')
    const configData = fs.readFileSync(configPath, 'utf8')
    return JSON.parse(configData)
  } catch (error) {
    console.error('❌ Could not load theme config:', error)
    return null
  }
}

export function applyPrimaryColorFromTheme() {
  console.log('🎨 Applying primary color from theme configuration...')

  const themeConfig = loadThemeConfig()
  if (!themeConfig) {
    console.error('❌ Could not load theme configuration')
    return false
  }

  const primaryColor = themeConfig.theme?.colors?.primary
  if (!primaryColor) {
    console.error('❌ No primary color found in theme configuration')
    return false
  }

  console.log(`🎨 Found primary color: ${primaryColor}`)

  try {
    // Convert colors to HSL
    const primaryHsl = hexToHsl(primaryColor)
    const secondaryHsl = hexToHsl(themeConfig.theme.colors.secondary || '#64748b')
    const accentHsl = hexToHsl(themeConfig.theme.colors.accent || '#06b6d4')
    const successHsl = hexToHsl(themeConfig.theme.colors.success || '#10b981')
    const errorHsl = hexToHsl(themeConfig.theme.colors.error || '#ef4444')

    console.log(`✅ Primary HSL: ${primaryHsl}`)

    // Generate dynamic CSS with theme colors
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
    /* PRIMARY COLOR FROM THEME: ${primaryColor} */
    --primary: ${primaryHsl};
    --primary-foreground: 210 40% 98%;
    /* SECONDARY COLOR FROM THEME: ${themeConfig.theme.colors.secondary} */
    --secondary: ${secondaryHsl};
    --secondary-foreground: 222.2 84% 4.9%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    /* ACCENT COLOR FROM THEME: ${themeConfig.theme.colors.accent} */
    --accent: ${accentHsl};
    --accent-foreground: 222.2 84% 4.9%;
    /* ERROR COLOR FROM THEME: ${themeConfig.theme.colors.error} */
    --destructive: ${errorHsl};
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
    /* PRIMARY COLOR FROM THEME IN DARK MODE */
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

/* Custom font classes */
.font-brandon {
  font-family: "Brandon", sans-serif;
}

/* Theme-based brand colors - DIRECTLY FROM THEME CONFIG */
.text-brand-primary {
  color: ${primaryColor};
}

.bg-brand-primary {
  background-color: ${primaryColor};
}

.border-brand-primary {
  border-color: ${primaryColor};
}

.hover\\:bg-brand-primary:hover {
  background-color: ${primaryColor};
}

.focus\\:ring-brand-primary:focus {
  --tw-ring-color: ${primaryColor};
}

/* Custom animations for smooth UX */
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
}

/* THEME VERIFICATION COMMENT */
/* Store: ${themeConfig.branding.siteName} */
/* Primary Color: ${primaryColor} */
/* Generated: ${new Date().toLocaleString()} */`

    // Write the CSS file
    const cssPath = path.join(process.cwd(), 'app', 'globals.css')
    fs.writeFileSync(cssPath, dynamicCSS)

    console.log('✅ CSS updated with primary color from theme!')
    console.log(`🏪 Store: ${themeConfig.branding.siteName}`)
    console.log(`🎨 Primary Color Applied: ${primaryColor}`)

    return true

  } catch (error) {
    console.error('❌ Failed to apply primary color:', error)
    return false
  }
}

if (require.main === module) {
  applyPrimaryColorFromTheme()
}

export default applyPrimaryColorFromTheme
