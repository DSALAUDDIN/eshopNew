import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { uploadImage } from '@/lib/upload'

export async function POST(request: NextRequest) {
  try {
    console.log('📤 Hero carousel upload request received')

    const formData = await request.formData()
    const files = formData.getAll('hero_images') as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 })
    }

    // Limit to 4 images maximum
    if (files.length > 4) {
      return NextResponse.json({ error: 'Maximum 4 images allowed' }, { status: 400 })
    }

    const uploadedImages: string[] = []

    for (const file of files) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({
          error: `Invalid file type for ${file.name}. Only JPEG, PNG, WebP, and GIF are allowed.`
        }, { status: 400 })
      }

      // Validate file size (10MB limit for hero images)
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxSize) {
        return NextResponse.json({
          error: `File ${file.name} too large. Maximum size is 10MB.`
        }, { status: 400 })
      }

      let heroImageUrl: string

      try {
        // Try Cloudinary upload first
        if (process.env.CLOUDINARY_CLOUD_NAME &&
            process.env.CLOUDINARY_API_KEY &&
            process.env.CLOUDINARY_API_SECRET) {
          console.log('🌤️ Using Cloudinary upload for hero image:', file.name)
          heroImageUrl = await uploadImage(file, 'southern-fashion-decor/hero')
        } else {
          throw new Error('Cloudinary not configured, using local upload')
        }
      } catch (cloudinaryError) {
        console.log('⚠️ Cloudinary failed, using local upload:', cloudinaryError instanceof Error ? cloudinaryError.message : String(cloudinaryError))

        // Fallback to local file upload
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Create uploads directory if it doesn't exist
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'hero')
        if (!existsSync(uploadDir)) {
          await mkdir(uploadDir, { recursive: true })
        }

        // Generate unique filename
        const timestamp = Date.now()
        const randomId = Math.random().toString(36).substring(2, 15)
        const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
        const filename = `hero-${timestamp}-${randomId}-${originalName}`
        const filepath = path.join(uploadDir, filename)

        await writeFile(filepath, buffer)
        heroImageUrl = `/uploads/hero/${filename}`

        console.log('✅ Local upload successful:', heroImageUrl)
      }

      uploadedImages.push(heroImageUrl)
    }

    // Update settings with new hero carousel images
    const settingsPath = path.join(process.cwd(), 'data', 'settings.json')

    let settings = {}
    try {
      if (existsSync(settingsPath)) {
        const settingsContent = await import('fs').then(fs =>
          fs.promises.readFile(settingsPath, 'utf8')
        )
        settings = JSON.parse(settingsContent)
      }
    } catch (error) {
      console.log('Creating new settings file')
    }

    // Update settings with new hero carousel
    const updatedSettings = {
      ...settings,
      hero_carousel: uploadedImages,
      hero_banner: uploadedImages[0], // Keep the first image as fallback for backward compatibility
      last_updated: new Date().toISOString()
    }

    await import('fs').then(fs =>
      fs.promises.writeFile(settingsPath, JSON.stringify(updatedSettings, null, 2))
    )

    // Also update template.json if it exists
    try {
      const templatePath = path.join(process.cwd(), 'config', 'template.json')
      if (existsSync(templatePath)) {
        const templateContent = await import('fs').then(fs =>
          fs.promises.readFile(templatePath, 'utf8')
        )
        const template = JSON.parse(templateContent)

        template.branding = template.branding || {}
        template.branding.hero_carousel = uploadedImages
        template.branding.hero_banner = uploadedImages[0]

        await import('fs').then(fs =>
          fs.promises.writeFile(templatePath, JSON.stringify(template, null, 2))
        )

        console.log('✅ Updated template.json with new hero carousel')
      }
    } catch (error) {
      console.log('⚠️ Could not update template.json:', error instanceof Error ? error.message : String(error))
    }

    console.log('✅ Hero carousel upload successful:', uploadedImages)

    return NextResponse.json({
      success: true,
      heroImages: uploadedImages,
      message: `${uploadedImages.length} hero images uploaded successfully!`
    })

  } catch (error) {
    console.error('❌ Hero carousel upload error:', error)
    return NextResponse.json({
      error: 'Hero carousel upload failed: ' + (error instanceof Error ? error.message : String(error))
    }, { status: 500 })
  }
}
