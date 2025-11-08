import { useNavigate } from 'react-router-dom'
import { cookieUtils } from '@/lib/cookies'

export const useLogout = () => {
  const navigate = useNavigate()

  const logout = () => {
    cookieUtils.removeToken()
    navigate('/login')
  }

  return { logout }
}

