import http from './http'
import type { AxiosRequestConfig } from 'axios'
import { featureFlags } from '@/lib/feature-flags'
import { routeMock } from './mocks'

/**
 * Intercepta chamadas de API e usa mocks quando a feature flag estiver ativa
 */
const useMockIfEnabled = async <T>(
  method: string,
  url: string,
  realCall: () => Promise<T>,
  body?: any
): Promise<T> => {
  if (featureFlags.useMockApi()) {
    console.log(`[MOCK API] ${method} ${url}`, body ? { body } : '')
    try {
      const mockResponse = await routeMock(method, url, body)
      return mockResponse as T
    } catch (error: any) {
      // Simula erro do axios
      const axiosError = {
        response: error.response || {
          status: 500,
          data: { success: false, message: 'Erro no mock' },
        },
        message: error.message || 'Erro desconhecido',
      }
      throw axiosError
    }
  }

  return realCall()
}

export async function get<Output>(
  url: string,
  config?: AxiosRequestConfig
): Promise<Output> {
  return useMockIfEnabled(
    'GET',
    url,
    async () => {
      const { data } = await http.get<Output>(url, config)
      return data
    }
  )
}

export async function post<Input, Output>(
  url: string,
  body?: Input,
  config?: AxiosRequestConfig
): Promise<Output> {
  return useMockIfEnabled(
    'POST',
    url,
    async () => {
      const { data } = await http.post<Output>(url, body, config)
      return data
    },
    body
  )
}

export async function put<Input, Output>(
  url: string,
  body?: Input,
  config?: AxiosRequestConfig
): Promise<Output> {
  return useMockIfEnabled(
    'PUT',
    url,
    async () => {
      const { data } = await http.put<Output>(url, body, config)
      return data
    },
    body
  )
}

export async function patch<Input, Output>(
  url: string,
  body?: Input,
  config?: AxiosRequestConfig
): Promise<Output> {
  return useMockIfEnabled(
    'PATCH',
    url,
    async () => {
      const { data } = await http.patch<Output>(url, body, config)
      return data
    },
    body
  )
}

export async function del<Output>(
  url: string,
  config?: AxiosRequestConfig
): Promise<Output> {
  return useMockIfEnabled(
    'DELETE',
    url,
    async () => {
      const { data } = await http.delete<Output>(url, config)
      return data
    }
  )
}
