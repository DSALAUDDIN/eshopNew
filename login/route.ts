import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/prisma'
import { users } from '@/lib/db/schema'
import { verifyPassword, generateToken } from '@/lib/auth'
import { eq } from 'drizzle-orm'

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Login attempt started')

    const { email, password } = await request.json()

    if (!email || !password) {
      console.log('❌ Missing email or password')
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    console.log('🔍 Looking up user:', email)

    // Find user using Drizzle
    const userResults = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)
    const user = userResults[0]

    if (!user) {
      console.log('❌ User not found:', email)
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    console.log('✅ User found:', user.email)

    // Verify JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET not configured')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password)
    if (!isValidPassword) {
      console.log('❌ Invalid password for:', email)
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    console.log('✅ Password verified for:', email)

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    })

    const userResponse = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isTradeCustomer: user.isTradeCustomer
    }

    console.log('✅ Login successful for:', email)
    return NextResponse.json({ user: userResponse, token })
  } catch (error) {
    // Type guard to safely access error properties
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    const errorStack = error instanceof Error ? error.stack : undefined
    const errorName = error instanceof Error ? error.name : 'Error'

    console.error('❌ Login error details:', {
      message: errorMessage,
      stack: errorStack,
      name: errorName
    })

    return NextResponse.json(
      {
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    )
  }
}
