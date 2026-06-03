export type UserRole = 'scientist' | 'enthusiast'

export interface JwtPayload {
  userId?: string
  role?: string
  username?: string
  email?: string
}

export const decodeJwtPayload = (token: string): JwtPayload | null => {
  try {
    const payload = token.split('.')[1]
    if (!payload) return null
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/'))) as JwtPayload
  } catch {
    return null
  }
}

export const getRoleFromToken = (token: string | undefined): UserRole => {
  if (!token) return 'scientist'
  const payload = decodeJwtPayload(token)
  return payload?.role === 'enthusiast' ? 'enthusiast' : 'scientist'
}
