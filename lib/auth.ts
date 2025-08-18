import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(payload: any): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '7d' })
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!)
  } catch (error) {
    return null
  }
}

export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  return null
}

interface DecodedToken {
    userId: string;
    email: string;
    role: string;
    iat: number;
    exp: number;
}

export async function verifyAdmin(request: NextRequest): Promise<DecodedToken | null> {
    const token = getTokenFromRequest(request);
    if (!token) {
        return null;
    }

    const decodedToken = verifyToken(token) as DecodedToken | null;
    if (!decodedToken) {
        return null;
    }

    if (decodedToken.role === 'ADMIN' || decodedToken.role === 'SUPER_ADMIN') {
        return decodedToken;
    }

    return null;
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `ORD-${timestamp}-${random}`
}

export function generateSKU(productName: string): string {
  const prefix = productName
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .substring(0, 3)
  const timestamp = Date.now().toString().slice(-6)
  return `${prefix}-${timestamp}`
}

export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '') // Fix: use replace instead of trim for removing leading/trailing dashes
}
