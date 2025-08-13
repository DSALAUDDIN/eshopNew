#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import readline from 'readline'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const question = (query: string): Promise<string> =>
  new Promise(resolve => rl.question(query, resolve))

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

function isValidHexColor(hex: string): boolean {
  const hexRegex = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
  return hexRegex.test(hex)
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

function saveThemeConfig(config: any) {
  try {
    const configPath = path.join(process.cwd(), 'config', 'template.json')
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
    return true
  } catch (error) {
    console.error('❌ Could not save theme config:', error)
    return false
  }
}

async function changeThemeColor() {
  console.log('🎨 Theme Color Changer')
  console.log('='.repeat(40))

  try {
    // Load current theme
    const themeConfig = loadThemeConfig()
    if (!themeConfig) {
      console.error('❌ Could not load theme configuration')
      return
    }

    console.log(`🏪 Current Store: ${themeConfig.branding?.siteName || 'Unknown'}`)
    console.log(`🎨 Current Primary Color: ${themeConfig.theme?.colors?.primary || 'Not set'}`)

    // Get new color from user
    const newColor = await question('\n💡 Enter new hex color (e.g., #ff6b6b or ff6b6b): ')

    if (!newColor.trim()) {
      console.log('❌ No color entered. Exiting...')
      return
    }

    // Validate hex color
    const colorToApply = newColor.startsWith('#') ? newColor : `#${newColor}`

    if (!isValidHexColor(colorToApply)) {
      console.log('❌ Invalid hex color format. Please use format like #ff6b6b or ff6b6b')
      return
    }

    console.log(`\n✅ Valid color detected: ${colorToApply}`)

    // Preview the change
    console.log('\n📋 PREVIEW CHANGES')
    console.log('='.repeat(40))
    console.log(`Store: ${themeConfig.branding.siteName}`)
    console.log(`Old Color: ${themeConfig.theme.colors.primary}`)
    console.log(`New Color: ${colorToApply}`)

    const confirm = await question('\n🔄 Apply this color change? (y/n): ')

    if (confirm.toLowerCase() !== 'y') {
      console.log('❌ Color change cancelled.')
      return
    }

    // Update theme configuration
    themeConfig.theme.colors.primary = colorToApply

    if (!saveThemeConfig(themeConfig)) {
      return
    }

    console.log('\n🎨 Applying new color...')

    // Convert to HSL and apply to CSS
    const primaryHsl = hexToHsl(colorToApply)
    const secondaryHsl = hexToHsl(themeConfig.theme.colors.secondary || '#64748b')
    const accentHsl = hexToHsl(themeConfig.theme.colors.accent || '#06b6d4')
    const successHsl = hexToHsl(themeConfig.theme.colors.success || '#10b981')
    const errorHsl = hexToHsl(themeConfig.theme.colors.error || '#ef4444')

    // Generate updated CSS
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
    /* PRIMARY COLOR: ${colorToApply} */
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

/* Direct color utilities */
.text-brand-primary {
  color: ${colorToApply} !important;
}

.bg-brand-primary {
  background-color: ${colorToApply} !important;
}

.border-brand-primary {
  border-color: ${colorToApply} !important;
}

.hover\\:bg-brand-primary:hover {
  background-color: ${colorToApply} !important;
}

/* Custom animations */
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

/* Applied: ${colorToApply} on ${new Date().toLocaleString()} */`

    // Write CSS file
    const cssPath = path.join(process.cwd(), 'app', 'globals.css')
    fs.writeFileSync(cssPath, dynamicCSS)

    // Update environment file
    const envPath = path.join(process.cwd(), '.env')
    if (fs.existsSync(envPath)) {
      let envContent = fs.readFileSync(envPath, 'utf8')
      envContent = envContent.replace(
        /THEME_PRIMARY_COLOR=.*/,
        `THEME_PRIMARY_COLOR="${colorToApply}"`
      )
      fs.writeFileSync(envPath, envContent)
    }

    console.log('\n🎉 SUCCESS!')
    console.log('='.repeat(40))
    console.log(`✅ Theme color changed to: ${colorToApply}`)
    console.log(`✅ Updated theme configuration`)
    console.log(`✅ Updated CSS variables`)
    console.log(`✅ Updated environment file`)
    console.log('\n🔄 Restart your dev server to see the changes:')
    console.log('   npm run dev')

  } catch (error) {
    console.error('❌ Error changing theme color:', error)
  } finally {
    rl.close()
  }
}

if (require.main === module) {
  changeThemeColor()
}

export { changeThemeColor }
