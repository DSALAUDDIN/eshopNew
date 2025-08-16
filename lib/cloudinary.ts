// lib/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary'
import streamifier from 'streamifier'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
})

type Uploadable = File | Blob | Buffer | ArrayBuffer | Uint8Array

export async function uploadImage(
    file: Uploadable,
    folder: string = 'southern-fashion-decor'
): Promise<{ url: string; public_id: string }> {
    try {
        // 1) Normalize to Buffer (works for File/Blob/ArrayBuffer/Uint8Array/Buffer)
        let buf: Buffer
        if (Buffer.isBuffer(file)) {
            buf = file
        } else if (file instanceof Uint8Array) {
            buf = Buffer.from(file)
        } else if (file instanceof ArrayBuffer) {
            buf = Buffer.from(file)
        } else {
            // File | Blob
            const ab = await (file as Blob).arrayBuffer()
            buf = Buffer.from(ab)
        }

        // 2) Stream to Cloudinary (no base64, no huge RAM spike)
        const result = await new Promise<any>((resolve, reject) => {
            const upload = cloudinary.uploader.upload_stream(
                {
                    folder,
                    resource_type: 'image', // unknown/HEIC হলে 'auto' দিন
                    use_filename: true,
                    // কিছু স্মার্ট অপ্টিমাইজেশন:
                    quality: 'auto',
                    fetch_format: 'auto',
                },
                (err, res) => (err ? reject(err) : resolve(res))
            )
            streamifier.createReadStream(buf).pipe(upload)
        })

        return { url: result.secure_url, public_id: result.public_id }
    } catch (error: any) {
        console.error('❌ Cloudinary upload error:', error)
        throw new Error(`Failed to upload image: ${error?.message || 'unknown error'}`)
    }
}

export async function deleteImage(publicId: string): Promise<void> {
    try {
        await cloudinary.uploader.destroy(publicId)
    } catch (error) {
        console.error('❌ Cloudinary delete error:', error)
        throw new Error('Failed to delete image')
    }
}

/**
 * Version-safe public_id extractor
 * Works for URLs like:
 * https://res.cloudinary.com/<cloud>/image/upload/v1712345678/folder/name.jpg
 */
export function extractPublicId(url: string): string {
    try {
        const u = new URL(url)
        const parts = u.pathname.split('/') // ['', '<res>', '<type>', 'upload', 'v123', 'folder', 'name.jpg']
        // Drop leading '', res, type, 'upload'
        const uploadIdx = parts.findIndex(p => p === 'upload')
        const tail = parts.slice(uploadIdx + 1)
        // Remove version segment if starts with v<digits>
        const tailNoVersion = tail[0]?.match(/^v\d+$/) ? tail.slice(1) : tail
        const last = tailNoVersion[tailNoVersion.length - 1] || ''
        const filename = last.split('.')[0]
        const folder = tailNoVersion.slice(0, -1).join('/')
        return folder ? `${folder}/${filename}` : filename
    } catch {
        // Fallback for plain strings
        const clean = url.split('?')[0].split('#')[0]
        const path = clean.replace(/^https?:\/\/[^/]+\/[^/]+\/[^/]+\/upload\/?/, '')
        return path.replace(/\/v\d+\//, '').replace(/\.[^.]+$/, '')
    }
}
