import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { socialMediaSettings } from '@/lib/db/schema'
import { asc } from 'drizzle-orm'

// GET /api/admin/social-media - List all social media settings
export async function GET() {
  try {
    const settings = await db.select().from(socialMediaSettings)
      .orderBy(asc(socialMediaSettings.sortOrder), asc(socialMediaSettings.platform))

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching social media settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch social media settings' },
      { status: 500 }
    )
  }
}

// POST /api/admin/social-media - Create new social media setting
export async function POST(request: Request) {
  try {
    const { platform, url, isActive = true, sortOrder = 0 } = await request.json()

    if (!platform || !url) {
      return NextResponse.json(
        { error: 'Platform and URL are required' },
        { status: 400 }
      )
    }

    const [newSetting] = await db.insert(socialMediaSettings).values({
      id: crypto.randomUUID(),
      platform,
      url,
      isActive,
      sortOrder,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning()

    return NextResponse.json(newSetting, { status: 201 })
  } catch (error) {
    console.error('Error creating social media setting:', error)
    return NextResponse.json(
      { error: 'Failed to create social media setting' },
      { status: 500 }
    )
  }
}
