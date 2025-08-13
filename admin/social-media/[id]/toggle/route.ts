import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { socialMediaSettings } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

// PATCH /api/admin/social-media/[id]/toggle - Toggle social media setting active status
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { isActive } = body

    const [updatedSetting] = await db
      .update(socialMediaSettings)
      .set({
        isActive,
        updatedAt: new Date(),
      })
      .where(eq(socialMediaSettings.id, params.id))
      .returning()

    if (!updatedSetting) {
      return NextResponse.json(
        { error: 'Social media setting not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(updatedSetting)
  } catch (error) {
    console.error('Error toggling social media setting:', error)
    return NextResponse.json(
      { error: 'Failed to toggle social media setting' },
      { status: 500 }
    )
  }
}
