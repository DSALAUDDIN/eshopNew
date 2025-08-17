'use server'

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/prisma'
import { users } from '@/lib/db/schema'
import { verifyPassword, hashPassword, verifyAdmin } from '@/lib/auth'
import { eq } from 'drizzle-orm'

export async function POST(request: NextRequest) {
  try {
    // Step 1: Verify the admin user from the token
    const admin = await verifyAdmin(request)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Step 2: Parse the request body
    const { currentPassword, newPassword } = await request.json()
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Current and new passwords are required' }, { status: 400 })
    }

    // Step 3: Fetch the user from the database
    const userResults = await db
      .select()
      .from(users)
      .where(eq(users.id, admin.userId))
      .limit(1)
    const user = userResults[0]

    if (!user) {
      return NextResponse.json({ error: 'Admin user not found' }, { status: 404 })
    }

    // Step 4: Verify the current password
    const isMatch = await verifyPassword(currentPassword, user.password)
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid current password' }, { status: 400 })
    }

    // Step 5: Hash the new password
    const hashedPassword = await hashPassword(newPassword)

    // Step 6: Update the user's password in the database
    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, admin.userId))

    return NextResponse.json({ message: 'Password changed successfully' })

  } catch (error) {
    console.error('Error changing password:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: 'Internal server error', details: errorMessage }, { status: 500 })
  }
}
