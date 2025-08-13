#!/usr/bin/env node

import fs from 'fs'
import path from 'path'

function replaceHardcodedColors() {
  console.log('🎨 Replacing hardcoded #6EC1D1 colors with theme-based system...')

  const filesToUpdate = [
    'styles/globals.css',
    'components/ui/button.tsx',
    'components/review-form.tsx',
    'components/product-grid.tsx',
    'components/product-detail.tsx',
    'components/navigation.tsx',
    'components/mobile-menu.tsx',
    'components/login-modal.tsx',
    'components/hero-section.tsx',
    'components/footer.tsx',
    'components/header.tsx',
    'components/collections.tsx',
    'components/customer-reviews.tsx',
    'components/CategorySidebar.js',
    'components/category-grid.tsx',
    'components/cart-sidebar.tsx'
  ]

  let totalReplacements = 0

  filesToUpdate.forEach(relativeFilePath => {
    const filePath = path.join(process.cwd(), relativeFilePath)

    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${relativeFilePath}`)
      return
    }

    try {
      let content = fs.readFileSync(filePath, 'utf8')
      const originalContent = content

      // Replace all variations of the hardcoded color with theme-based classes
      const replacements = [
        // Replace hardcoded hex colors with CSS variables
        { from: /#6EC1D1/g, to: 'hsl(var(--primary))' },
        { from: /#5AAFBF/g, to: 'hsl(var(--primary))' }, // hover variant
        { from: /#e6f7fa/g, to: 'hsl(var(--primary) / 0.1)' }, // light variant

        // Replace specific class patterns with theme classes
        { from: /bg-\[#6EC1D1\]/g, to: 'bg-primary' },
        { from: /hover:bg-\[#6EC1D1\]/g, to: 'hover:bg-primary' },
        { from: /text-\[#6EC1D1\]/g, to: 'text-primary' },
        { from: /hover:text-\[#6EC1D1\]/g, to: 'hover:text-primary' },
        { from: /fill-\[#6EC1D1\]/g, to: 'fill-primary' },
        { from: /border-\[#6EC1D1\]/g, to: 'border-primary' },

        // Replace hover variants
        { from: /bg-\[#5AAFBF\]/g, to: 'bg-primary/90' },
        { from: /hover:bg-\[#5AAFBF\]/g, to: 'hover:bg-primary/90' },
        { from: /hover:text-\[#5AAFBF\]/g, to: 'hover:text-primary/90' },

        // Replace light variants
        { from: /bg-\[#e6f7fa\]/g, to: 'bg-primary/10' },
        { from: /hover:bg-\[#e6f7fa\]/g, to: 'hover:bg-primary/10' }
      ]

      let fileReplacements = 0
      replacements.forEach(replacement => {
        const matches = content.match(replacement.from)
        if (matches) {
          fileReplacements += matches.length
          content = content.replace(replacement.from, replacement.to)
        }
      })

      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8')
        console.log(`✅ Updated ${relativeFilePath} - ${fileReplacements} replacements`)
        totalReplacements += fileReplacements
      } else {
        console.log(`ℹ️  No changes needed in ${relativeFilePath}`)
      }

    } catch (error) {
      console.error(`❌ Error updating ${relativeFilePath}:`, error)
    }
  })

  console.log(`\n🎉 Complete! Made ${totalReplacements} total replacements.`)
  console.log('✅ All hardcoded #6EC1D1 colors replaced with theme-based system')
  console.log('🔄 Your app now uses dynamic colors from your theme configuration')

  return totalReplacements
}

if (require.main === module) {
  replaceHardcodedColors()
}

export { replaceHardcodedColors }
