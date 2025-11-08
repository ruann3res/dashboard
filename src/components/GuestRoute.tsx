import { Navigate } from 'react-router-dom'
import { cookieUtils } from '@/lib/cookies'

interface GuestRouteProps {
  children: React.ReactNode
}

export const GuestRoute = ({ children }: GuestRouteProps) => {
  const hasToken = cookieUtils.hasToken()

  if (hasToken) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

