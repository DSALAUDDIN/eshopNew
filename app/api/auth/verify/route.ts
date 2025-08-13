export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'
import { db } from '@/lib/prisma'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    const decoded = verifyToken(token) as any
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const userResults = await db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        isTradeCustomer: users.isTradeCustomer
      })
      .from(users)
      .where(eq(users.id, decoded.userId))
      .limit(1)

    const user = userResults[0]

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Token verification error:', error)
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
}
