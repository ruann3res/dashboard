import { useMutation } from '@tanstack/react-query'
import { post } from '@/services/api'
import { useToast } from '@/hooks'
import { cookieUtils } from '@/lib/cookies'
import { extractErrorMessage } from '@/lib/error-utils'

interface AuthRequest {
  phone: string
}

interface AuthResponse {
  success: boolean
  message: string
  data: {
    token: string
  }
}

interface AuthVerifyRequest {
  token: string
}

interface AuthVerifyResponse {
  success: boolean
  message: string
  data: {
    token: string
  }
}

export const useAuth = () => {
  const { showToast } = useToast()

  return useMutation({
    mutationFn: async (phone: string) => {
      return post<AuthRequest, AuthResponse>('/auth', { phone })
    },
    onSuccess: (data) => {
      const token = data.data?.token
      if (token && token !== 'undefined' && token.trim() !== '') {
        localStorage.setItem('temp_auth_token', token)
      }
      showToast(data.message || 'Código enviado com sucesso!', 'success')
    },
    onError: (error: unknown) => {
      const message = extractErrorMessage(error)
      showToast(message, 'error')
    },
  })
}

export const useAuthVerify = () => {
  const { showToast } = useToast()

  return useMutation({
    mutationFn: async (token: string) => {
      return post<AuthVerifyRequest, AuthVerifyResponse>('/auth/verify', { token })
    },
    onSuccess: (data) => {
      const jwtToken = data.data.token
      cookieUtils.setToken(jwtToken)
      showToast(data.message || 'Autenticação verificada com sucesso!', 'success')
    },
    onError: (error: unknown) => {
      const message = extractErrorMessage(error)
      showToast(message, 'error')
    },
  })
}

