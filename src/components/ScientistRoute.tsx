import { Navigate } from 'react-router-dom'
import { useCurrentUser } from '@/hooks/use-current-user'

interface ScientistRouteProps {
  children: React.ReactNode
}

export const ScientistRoute = ({ children }: ScientistRouteProps) => {
  const { isEnthusiast } = useCurrentUser()

  if (isEnthusiast) {
    return <Navigate to="/monitor" replace />
  }

  return <>{children}</>
}
