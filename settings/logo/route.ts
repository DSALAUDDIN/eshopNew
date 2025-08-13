import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir, readFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { uploadImage } from '@/lib/upload'

export async function POST(request: NextRequest) {
  try {
    console.log('📤 Logo upload request received')

    const formData = await request.formData()
    const file = formData.get('logo') as File

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({
        error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.'
      }, { status: 400 })
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({
        error: 'File too large. Maximum size is 5MB.'
      }, { status: 400 })
    }

    let logoUrl: string

    try {
      // Try Cloudinary upload first
      if (process.env.CLOUDINARY_CLOUD_NAME &&
          process.env.CLOUDINARY_API_KEY &&
          process.env.CLOUDINARY_API_SECRET) {
        console.log('🌤️ Using Cloudinary upload')
        logoUrl = await uploadImage(file, 'southern-fashion-decor/logo')
      } else {
        throw new Error('Cloudinary not configured, using local upload')
      }
    } catch (cloudinaryError) {
      const errorMessage = cloudinaryError instanceof Error ? cloudinaryError.message : 'Unknown error'
      console.log('⚠️ Cloudinary failed, using local upload:', errorMessage)

      // Fallback to local file upload
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Create uploads directory if it doesn't exist
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'logo')
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true })
      }

      // Generate unique filename
      const timestamp = Date.now()
      const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      const filename = `logo-${timestamp}-${originalName}`
      const filepath = path.join(uploadDir, filename)

      await writeFile(filepath, buffer)
      logoUrl = `/uploads/logo/${filename}`

      console.log('✅ Local upload successful:', logoUrl)
    }

    // Update settings with new logo URL
    const settingsPath = path.join(process.cwd(), 'data', 'settings.json')

    let settings: Record<string, any> = {}
    try {
      if (existsSync(settingsPath)) {
        const settingsContent = await readFile(settingsPath, 'utf8')
        settings = JSON.parse(settingsContent)
      }
    } catch (error) {
      console.log('Creating new settings file')
    }

    // Update settings with new logo
    const updatedSettings = {
      ...settings,
      site_logo: logoUrl,
      last_updated: new Date().toISOString()
    }

    await writeFile(settingsPath, JSON.stringify(updatedSettings, null, 2))

    // Also update template.json if it exists
    try {
      const templatePath = path.join(process.cwd(), 'config', 'template.json')
      if (existsSync(templatePath)) {
        const templateContent = await readFile(templatePath, 'utf8')
        const template = JSON.parse(templateContent)

        template.branding = template.branding || {}
        template.branding.logo = logoUrl

        await writeFile(templatePath, JSON.stringify(template, null, 2))

        console.log('✅ Updated template.json with new logo')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.log('⚠️ Could not update template.json:', errorMessage)
    }

    console.log('✅ Logo upload successful:', logoUrl)

    return NextResponse.json({
      success: true,
      logoUrl,
      message: 'Logo uploaded successfully!'
    })

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('❌ Logo upload error:', error)
    return NextResponse.json({
      error: 'Logo upload failed: ' + errorMessage
    }, { status: 500 })
  }
}
