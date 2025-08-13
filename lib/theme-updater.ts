import fs from 'fs'
import path from 'path'

// Function to convert hex color to HSL values for CSS variables
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

export function updateCSSWithTheme() {
  try {
    // Read template configuration
    const configPath = path.join(process.cwd(), 'config', 'template.json')
    const configData = fs.readFileSync(configPath, 'utf8')
    const config = JSON.parse(configData)

    // Convert hex colors to HSL
    const primaryHsl = hexToHsl(config.theme.colors.primary)
    const secondaryHsl = hexToHsl(config.theme.colors.secondary)
    const accentHsl = hexToHsl(config.theme.colors.accent)
    const successHsl = hexToHsl(config.theme.colors.success)
    const errorHsl = hexToHsl(config.theme.colors.error)

    // Generate dynamic CSS content
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

/* Custom font classes */
.font-brandon {
  font-family: "Brandon", sans-serif;
}

/* Store-specific brand colors */
.text-brand-primary {
  color: hsl(var(--primary));
}

.bg-brand-primary {
  background-color: hsl(var(--primary));
}

.border-brand-primary {
  border-color: hsl(var(--primary));
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
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}`

    // Write the updated CSS file
    const cssPath = path.join(process.cwd(), 'app', 'globals.css')
    fs.writeFileSync(cssPath, dynamicCSS)

    console.log('✅ CSS updated with your theme colors!')
    return true

  } catch (error) {
    console.error('❌ Failed to update CSS:', error)
    return false
  }
}

// Also update the site title in layout.tsx
export function updateSiteMetadata() {
  try {
    const configPath = path.join(process.cwd(), 'config', 'template.json')
    const configData = fs.readFileSync(configPath, 'utf8')
    const config = JSON.parse(configData)

    const layoutPath = path.join(process.cwd(), 'app', 'layout.tsx')
    let layoutContent = fs.readFileSync(layoutPath, 'utf8')

    // Update site name in metadata
    layoutContent = layoutContent.replace(
      /title:\s*["'][^"']*["']/,
      `title: "${config.branding.siteName}"`
    )
    
    layoutContent = layoutContent.replace(
      /description:\s*["'][^"']*["']/,
      `description: "${config.branding.siteDescription}"`
    )

    fs.writeFileSync(layoutPath, layoutContent)
    console.log('✅ Site metadata updated!')
    return true

  } catch (error) {
    console.error('❌ Failed to update metadata:', error)
    return false
  }
}
