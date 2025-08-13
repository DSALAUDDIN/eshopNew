import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/prisma'
import { users } from '@/lib/db/schema'
import { hashPassword } from '@/lib/auth'
import { eq } from 'drizzle-orm'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, role = 'USER' } = await request.json()

    // Check if user already exists
    const existingUserResults = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)
    const existingUser = existingUserResults[0]

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const newUser = await db
      .insert(users)
      .values({
        email,
        name,
        password: hashedPassword,
        role: role,
      })
      .returning({
        id: users.id,
        email: users.email,
        name: users.name,
        role: users.role,
        isTradeCustomer: users.isTradeCustomer,
        createdAt: users.createdAt,
      })

    return NextResponse.json(newUser[0], { status: 201 })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
