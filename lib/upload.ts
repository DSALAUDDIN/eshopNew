import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // Force HTTPS URLs
})

export async function uploadImage(file: File, folder: string = 'southern-fashion-decor'): Promise<string> {
  try {
    console.log('🚀 Starting Cloudinary upload...')

    // Validate Cloudinary configuration
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      throw new Error('Cloudinary configuration is missing. Please check environment variables.')
    }

    const buffer = await file.arrayBuffer()
    const base64 = Buffer.from(buffer).toString('base64')
    const dataURI = `data:${file.type};base64,${base64}`

    const result = await cloudinary.uploader.upload(dataURI, {
      folder,
      resource_type: 'auto',
      quality: 'auto', // Optimize quality automatically
      fetch_format: 'auto', // Optimize format automatically
      transformation: [
        { quality: 'auto:good' },
        { fetch_format: 'auto' }
      ]
    })

    console.log('✅ Cloudinary upload successful:', result.secure_url)
    return result.secure_url
  } catch (error) {
    console.error('❌ Cloudinary upload error:', error)
    throw new Error(`Failed to upload image: ${error.message}`)
  }
}

export async function deleteImage(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId)
  } catch (error) {
    console.error('Error deleting image:', error)
    throw new Error('Failed to delete image')
  }
}

export function extractPublicId(url: string): string {
  const parts = url.split('/')
  const filename = parts[parts.length - 1]
  return filename.split('.')[0]
}
