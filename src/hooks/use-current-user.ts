import { useMemo } from 'react'
import { cookieUtils } from '@/lib/cookies'
import { getRoleFromToken, type UserRole } from '@/lib/jwt'

export const useCurrentUser = () => {
  const token = cookieUtils.getToken()

  return useMemo(() => {
    const role: UserRole = getRoleFromToken(token)
    return {
      role,
      isEnthusiast: role === 'enthusiast',
      isScientist: role === 'scientist',
    }
  }, [token])
}
