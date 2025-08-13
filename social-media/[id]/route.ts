import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { socialMediaSettings } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

// PUT /api/admin/social-media/[id] - Update social media setting
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { url, isActive, sortOrder } = body

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    const updateData: any = {
      url,
      updatedAt: new Date(),
    }
    if (typeof isActive === 'boolean') updateData.isActive = isActive
    if (typeof sortOrder === 'number') updateData.sortOrder = sortOrder

    const [updatedSetting] = await db
      .update(socialMediaSettings)
      .set(updateData)
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
    console.error('Error updating social media setting:', error)
    return NextResponse.json(
      { error: 'Failed to update social media setting' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/social-media/[id] - Delete social media setting
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const [deletedSetting] = await db
      .delete(socialMediaSettings)
      .where(eq(socialMediaSettings.id, params.id))
      .returning()

    if (!deletedSetting) {
      return NextResponse.json(
        { error: 'Social media setting not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      message: 'Social media setting deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting social media setting:', error)
    return NextResponse.json(
      { error: 'Failed to delete social media setting' },
      { status: 500 }
    )
  }
}
