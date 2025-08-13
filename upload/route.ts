import { NextRequest, NextResponse } from 'next/server'
import { uploadImage } from '@/lib/upload'

export async function POST(request: NextRequest) {
  console.log('🔄 Upload endpoint called')

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const type = formData.get('type') as string

    console.log('📁 File details:', {
      name: file?.name,
      size: file?.size,
      type: file?.type,
      uploadType: type
    })

    if (!file) {
      console.log('❌ No file provided')
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      console.log('❌ Invalid file type:', file.type)
      return NextResponse.json({
        error: 'Invalid file type. Only images are allowed.'
      }, { status: 400 })
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024 // 5MB in bytes
    if (file.size > maxSize) {
      console.log('❌ File too large:', file.size)
      return NextResponse.json({
        error: 'File too large. Maximum size is 5MB.'
      }, { status: 400 })
    }

    console.log('📤 Uploading to Cloudinary...')

    // Upload to Cloudinary with proper folder structure
    const folder = type ? `southern-fashion-decor/${type}` : 'southern-fashion-decor/general'
    const cloudinaryUrl = await uploadImage(file, folder)

    console.log('✅ File uploaded successfully to Cloudinary:', cloudinaryUrl)

    return NextResponse.json({
      success: true,
      url: cloudinaryUrl,
      filename: file.name,
      cloudinary: true
    })

  } catch (error) {
    console.error('❌ Upload error:', error)

    // Provide more specific error messages
    let errorMessage = 'Upload failed'
    if (error instanceof Error) {
      if (error.message.includes('Invalid image file')) {
        errorMessage = 'Invalid image file format'
      } else if (error.message.includes('File too large')) {
        errorMessage = 'File size exceeds limit'
      } else if (error.message.includes('Cloudinary')) {
        errorMessage = 'Image service temporarily unavailable'
      } else {
        errorMessage = error.message
      }
    }

    return NextResponse.json({
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 })
  }
}
