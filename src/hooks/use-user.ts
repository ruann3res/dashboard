import { useMutation } from '@tanstack/react-query'
import { post } from '@/services/api'
import { useToast } from '@/hooks'
import { cookieUtils } from '@/lib/cookies'
import { extractErrorMessage } from '@/lib/error-utils'
import type { CreateUserRequest, CreateUserResponse } from '@/types'

export const useCreateUser = () => {
  const { showToast } = useToast()

  return useMutation({
    mutationFn: async (data: CreateUserRequest) => {
      return post<CreateUserRequest, CreateUserResponse>('/users', data)
    },
    onSuccess: (data) => {
      if (data.data?.token) {
        cookieUtils.setToken(data.data.token)
      }
      showToast(data.message || 'Usuário criado com sucesso!', 'success')
    },
    onError: (error: unknown) => {
      const message = extractErrorMessage(error)
      showToast(message, 'error')
    },
  })
}
