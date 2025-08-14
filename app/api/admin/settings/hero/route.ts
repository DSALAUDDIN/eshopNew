import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { uploadImage } from '@/lib/upload';

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
          {
            error: `Invalid file type for ${file.name}. Only JPEG, PNG, WebP, and GIF are allowed.`,
          },
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
        if (
          !process.env.CLOUDINARY_CLOUD_NAME ||
          !process.env.CLOUDINARY_API_KEY ||
          !process.env.CLOUDINARY_API_SECRET
        ) {
          throw new Error('Cloudinary environment variables are not configured.');
        }

        console.log('🌤️ Using Cloudinary upload for hero image:', file.name);
        const heroImageUrl = await uploadImage(file, 'southern-fashion-decor/hero');
        uploadedImages.push(heroImageUrl);
      } catch (uploadError) {
        const errorMessage =
          uploadError instanceof Error ? uploadError.message : String(uploadError);
        console.error('❌ Cloudinary upload failed:', errorMessage);
        return NextResponse.json(
          { error: 'Image upload failed. Please check server configuration.' },
          { status: 500 }
        );
      }
    }

    const settingsPath = path.join(process.cwd(), 'data', 'settings.json');

    let settings = {};
    try {
      if (existsSync(settingsPath)) {
        const settingsContent = await import('fs').then((fs) =>
          fs.promises.readFile(settingsPath, 'utf8')
        );
        settings = JSON.parse(settingsContent);
      }
    } catch (error) {
      console.log('Creating new settings file');
    }

    const updatedSettings = {
      ...settings,
      hero_carousel: uploadedImages,
      hero_banner: uploadedImages[0],
      last_updated: new Date().toISOString(),
    };

    await import('fs').then((fs) =>
      fs.promises.writeFile(settingsPath, JSON.stringify(updatedSettings, null, 2))
    );

    try {
      const templatePath = path.join(process.cwd(), 'config', 'template.json');
      if (existsSync(templatePath)) {
        const templateContent = await import('fs').then((fs) =>
          fs.promises.readFile(templatePath, 'utf8')
        );
        const template = JSON.parse(templateContent);

        template.branding = template.branding || {};
        template.branding.hero_carousel = uploadedImages;
        template.branding.hero_banner = uploadedImages[0];

        await import('fs').then((fs) =>
          fs.promises.writeFile(templatePath, JSON.stringify(template, null, 2))
        );

        console.log('✅ Updated template.json with new hero carousel');
      }
    } catch (error) {
      console.log(
        '⚠️ Could not update template.json:',
        error instanceof Error ? error.message : String(error)
      );
    }

    console.log('✅ Hero carousel upload successful:', uploadedImages);

    return NextResponse.json({
      success: true,
      heroImages: uploadedImages,
      message: `${uploadedImages.length} hero images uploaded successfully!`,
    });
  } catch (error) {
    console.error('❌ Hero carousel upload error:', error);
    return NextResponse.json(
      {
        error: 'Hero carousel upload failed: ' + (error instanceof Error ? error.message : String(error)),
      },
      { status: 500 }
    );
  }
}
