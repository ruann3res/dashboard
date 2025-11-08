import { Navigate, useLocation } from 'react-router-dom'
import { cookieUtils } from '@/lib/cookies'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation()
  const token = cookieUtils.getToken()
  const hasToken = !!token

  if (!hasToken) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

