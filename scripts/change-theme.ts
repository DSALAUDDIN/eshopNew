#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { generateDynamicCSS } from './generate-dynamic-css.js'
import { generateDynamicSettings } from './generate-dynamic-settings.js'

function changeThemeColor() {
  console.log('🎨 Theme Color Changer - Update Your Store Colors Instantly!')
  console.log('')

  const configPath = path.join(process.cwd(), 'config', 'template.json')

  if (!fs.existsSync(configPath)) {
    console.error('❌ Template configuration not found!')
    console.log('💡 Run: npx tsx scripts/setup-template.ts first')
    return
  }

  try {
    // Read current configuration
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))

    console.log('📋 Current Theme Colors:')
    console.log(`   Primary: ${config.theme.colors.primary}`)
    console.log(`   Secondary: ${config.theme.colors.secondary}`)
    console.log(`   Accent: ${config.theme.colors.accent}`)
    console.log('')

    // Example color changes
    console.log('🎨 To change colors, edit config/template.json and run this script again')
    console.log('')
    console.log('💡 Example color schemes:')
    console.log('   Blue Theme: #3b82f6, #e0f2fe, #06b6d4')
    console.log('   Green Theme: #10b981, #ecfdf5, #059669')
    console.log('   Purple Theme: #8b5cf6, #f3e8ff, #7c3aed')
    console.log('   Orange Theme: #f97316, #fff7ed, #ea580c')
    console.log('')

    // Regenerate CSS and settings with current colors
    console.log('🔄 Regenerating CSS and settings with current theme colors...')
    generateDynamicCSS()
    generateDynamicSettings()

    console.log('')
    console.log('✅ Theme and settings updated successfully!')
    console.log('🔄 Restart your dev server (npm run dev) to see changes')

  } catch (error) {
    console.error('❌ Error updating theme:', error)
  }
}

if (require.main === module) {
  changeThemeColor()
}

export { changeThemeColor }
