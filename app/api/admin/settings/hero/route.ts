import { NextRequest, NextResponse } from 'next/server';
import { uploadImage } from '@/lib/upload';
import { db } from '@/lib/prisma';
import { settings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// Helper function to update a setting in the database
async function updateSetting(key: string, value: any) {
  const stringValue = JSON.stringify(value);
  await db.insert(settings)
    .values({ key, value: stringValue, type: 'json' })
    .onConflictDoUpdate({ target: settings.key, set: { value: stringValue, updatedAt: new Date() } });
}

export async function POST(request: NextRequest) {
  try {
    console.log('📤 Hero carousel upload request received');

    const formData = await request.formData();
    const files = formData.getAll('hero_images') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    if (files.length > 4) {
      return NextResponse.json({ error: 'Maximum 4 images allowed' }, { status: 400 });
    }

    const uploadedImages: string[] = [];

    for (const file of files) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: `Invalid file type for ${file.name}. Only JPEG, PNG, WebP, and GIF are allowed.` },
          { status: 400 }
        );
      }

      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        return NextResponse.json(
          { error: `File ${file.name} too large. Maximum size is 10MB.` },
          { status: 400 }
        );
      }

      try {
        if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
          throw new Error('Cloudinary environment variables are not configured.');
        }

        console.log('🌤️ Using Cloudinary upload for hero image:', file.name);
        const heroImageUrl = await uploadImage(file, 'southern-fashion-decor/hero');
        uploadedImages.push(heroImageUrl);

      } catch (uploadError) {
        const errorMessage = uploadError instanceof Error ? uploadError.message : String(uploadError);
        console.error('❌ Cloudinary upload failed:', errorMessage);
        return NextResponse.json(
          { error: 'Image upload failed. Please check server configuration and credentials.' },
          { status: 500 }
        );
      }
    }

    // Update database settings
    await updateSetting('hero_carousel', uploadedImages);
    await updateSetting('hero_banner', uploadedImages[0] || ''); // Use first image as main banner

    console.log('✅ Hero carousel upload successful and settings saved to database:', uploadedImages);

    return NextResponse.json({
      success: true,
      heroImages: uploadedImages,
      message: `${uploadedImages.length} hero images uploaded successfully!`,
    });

  } catch (error) {
    console.error('❌ Hero carousel upload error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred: ' + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}
