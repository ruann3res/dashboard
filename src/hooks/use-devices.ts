import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { get, post, put, del } from '@/services/api'
import { QueryKeys } from '@/lib/query-keys'
import { useToast } from '@/hooks'
import { extractErrorMessage } from '@/lib/error-utils'
import type { Device, DeviceType, DeviceStatus } from '@/types'

interface DevicesResponse {
  success: boolean
  data: {
    devices: Device[]
    total: number
  }
  timestamp: string
}

interface DeviceResponse {
  success: boolean
  data: {
    device: Device
  }
  timestamp: string
}

interface CreateDeviceRequest {
  projectId: string
  name: string
  description: string
  deviceType: DeviceType
  status?: DeviceStatus
}

interface CreateDeviceResponse {
  success: boolean
  data: {
    serialNumber: string
  }
  timestamp: string
}

interface UpdateDeviceRequest {
  projectId?: string
  name?: string
  description?: string
  deviceType?: DeviceType
  status?: DeviceStatus
}

interface DeleteDeviceResponse {
  success: boolean
  data: {
    message: string
  }
  timestamp: string
}

export const useDevices = (projectId?: string | null) => {
  return useQuery({
    queryKey: [QueryKeys.DEVICES, projectId],
    queryFn: async () => {
      const url = projectId ? `/devices?projectId=${projectId}` : '/devices'
      const response = await get<DevicesResponse>(url)
      return response.data.devices
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos
    placeholderData: [],
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) {
        return false
      }
      return failureCount < 2
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })
}

export const useDevice = (id: string) => {
  return useQuery({
    queryKey: [QueryKeys.DEVICES, id],
    queryFn: async () => {
      const response = await get<DeviceResponse>(`/devices/${id}`)
      return response.data.device
    },
    enabled: !!id,
  })
}

export const useCreateDevice = () => {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: async (data: CreateDeviceRequest) => {
      return post<CreateDeviceRequest, CreateDeviceResponse>('/devices', data)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QueryKeys.DEVICES] })
      await queryClient.refetchQueries({ 
        queryKey: [QueryKeys.DEVICES],
        type: 'active'
      })
    },
    onError: (error: unknown) => {
      const message = extractErrorMessage(error)
      showToast(message, 'error')
    },
  })
}

export const useUpdateDevice = () => {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateDeviceRequest }) => {
      return put<UpdateDeviceRequest, DeviceResponse>(`/devices/${id}`, data)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QueryKeys.DEVICES] })
      await queryClient.refetchQueries({ 
        queryKey: [QueryKeys.DEVICES],
        type: 'active'
      })
      showToast('Dispositivo atualizado com sucesso!', 'success')
    },
    onError: (error: unknown) => {
      const message = extractErrorMessage(error)
      showToast(message, 'error')
    },
  })
}

export const useDeleteDevice = () => {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: async (id: string) => {
      return del<DeleteDeviceResponse>(`/devices/${id}`)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QueryKeys.DEVICES] })
      await queryClient.refetchQueries({ 
        queryKey: [QueryKeys.DEVICES],
        type: 'active'
      })
      showToast('Dispositivo excluído com sucesso!', 'success')
    },
    onError: (error: unknown) => {
      const message = extractErrorMessage(error)
      showToast(message, 'error')
    },
  })
}

