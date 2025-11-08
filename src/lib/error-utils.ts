import type { AxiosError } from 'axios'

interface ErrorDetails {
  field?: string
  value?: unknown
  minLength?: number
  maxLength?: number
  timestamp?: string
  [key: string]: unknown
}

interface ApiErrorResponse {
  success: false
  code?: string
  details?: ErrorDetails
  message?: string
  error?: string | {
    message?: string
    code?: string
    details?: ErrorDetails
  }
  timestamp?: string
  type?: string
}

const getFieldLabel = (field: string): string => {
  const fieldMap: Record<string, string> = {
    name: 'Nome',
    description: 'Descrição',
    projectId: 'Projeto',
    deviceType: 'Tipo de dispositivo',
    status: 'Status',
    phone: 'Telefone',
    token: 'Token',
  }

  return fieldMap[field] || field
}

const extractErrorFromObject = (errorObj: Record<string, unknown>): string | null => {
  if (errorObj.message && typeof errorObj.message === 'string') {
    return errorObj.message
  }

  if (errorObj.details && typeof errorObj.details === 'object' && errorObj.details !== null) {
    const details = errorObj.details as ErrorDetails
    const field = details.field
    const fieldLabel = field ? getFieldLabel(field) : 'Campo'

    if (details.minLength) {
      return `${fieldLabel} deve ter pelo menos ${details.minLength} caracteres`
    }

    if (details.maxLength) {
      return `${fieldLabel} deve ter no máximo ${details.maxLength} caracteres`
    }
  }

  if (errorObj.code && typeof errorObj.code === 'string') {
    return errorObj.code
  }

  return null
}

export const extractErrorMessage = (error: unknown): string => {
  if (!error) {
    return 'Erro desconhecido'
  }

  const axiosError = error as AxiosError<ApiErrorResponse>

  if (axiosError.response?.data) {
    const errorData = axiosError.response.data

    if (errorData.message) {
      return errorData.message
    }

    if (errorData.error) {
      if (typeof errorData.error === 'string') {
        return errorData.error
      }

      if (typeof errorData.error === 'object' && errorData.error !== null) {
        const extracted = extractErrorFromObject(errorData.error as Record<string, unknown>)
        if (extracted) {
          return extracted
        }

        const errorStr = JSON.stringify(errorData.error)
        if (errorStr !== '{}') {
          return `Erro: ${errorStr}`
        }
      }
    }

    if (errorData.details) {
      const extracted = extractErrorFromObject(errorData.details as Record<string, unknown>)
      if (extracted) {
        return extracted
      }
    }

    if (errorData.code) {
      return errorData.code
    }

    if (errorData.type) {
      return `Erro do tipo: ${errorData.type}`
    }
  }

  if (axiosError.message) {
    return axiosError.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Erro desconhecido'
}

