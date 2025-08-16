// app/api/admin/upload/route.ts
import { NextResponse } from 'next/server'
import { uploadImage } from '@/lib/cloudinary'

export const runtime = 'nodejs' // Edge এ Cloudinary SDK চলবে না

export async function POST(req: Request) {
  try {
    const form = await req.formData()
    const file = form.get('file')
    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file' }, { status: 400 })
    }

    const { url, public_id } = await uploadImage(file as File, 'southern-fashion-decor')
    return NextResponse.json({ success: true, url, public_id })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Upload failed' }, { status: 500 })
  }
}
