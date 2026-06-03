import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { get, post, put, del } from '@/services/api'
import { QueryKeys } from '@/lib/query-keys'
import { useToast } from '@/hooks'
import { extractErrorMessage } from '@/lib/error-utils'
import type { Actuator, AlertRange, HealthRange } from '@/types/actuator'

export const ACTUATORS_POLL_INTERVAL_MS = 5000

interface UseActuatorsOptions {
  /** Ativa refetch periódico — necessário no monitor pois atores são criados via /actor-data */
  poll?: boolean
}

// API Response types (snake_case)
interface ActorApiResponse {
  id: string
  device_id: string
  name: string
  unit_of_measurement: string
  alert?: {
    min_value: number
    max_value: number
  }
  health?: {
    min_value: number
    max_value: number
  }
  created_at: string
  updated_at: string
}

interface ActorsApiResponse {
  success: boolean
  data: {
    actors: ActorApiResponse[]
  }
  timestamp: string
}

interface ActorApiResponseSingle {
  success: boolean
  data: {
    actor: ActorApiResponse
  }
  timestamp: string
}

// Request types (snake_case for API)
interface CreateActorApiRequest {
  device_id: string
  name: string
  unit_of_measurement: string
  alert?: {
    min_value: number
    max_value: number
  }
  health?: {
    min_value: number
    max_value: number
  }
}

interface UpdateActorApiRequest {
  name?: string
  unit_of_measurement?: string
  alert?: {
    min_value: number
    max_value: number
  }
  health?: {
    min_value: number
    max_value: number
  }
}

interface DeleteActorApiResponse {
  success: boolean
  data: {
    message: string
  }
  timestamp: string
}

// Transform functions
const transformActorApiToActuator = (apiActor: ActorApiResponse): Actuator => {
  return {
    id: apiActor.id,
    deviceId: apiActor.device_id,
    name: apiActor.name,
    unitOfMeasurement: apiActor.unit_of_measurement,
    alert: apiActor.alert
      ? {
          minValue: apiActor.alert.min_value,
          maxValue: apiActor.alert.max_value,
        }
      : undefined,
    health: apiActor.health
      ? {
          minValue: apiActor.health.min_value,
          maxValue: apiActor.health.max_value,
        }
      : undefined,
    createdAt: apiActor.created_at,
    updatedAt: apiActor.updated_at,
  }
}

const transformActuatorToApiRequest = (actuator: {
  deviceId: string
  name: string
  unitOfMeasurement: string
  alert?: AlertRange
  health?: HealthRange
}): CreateActorApiRequest => {
  const request: CreateActorApiRequest = {
    device_id: actuator.deviceId,
    name: actuator.name,
    unit_of_measurement: actuator.unitOfMeasurement,
  }

  if (actuator.alert !== undefined) {
    request.alert = {
      min_value: actuator.alert.minValue,
      max_value: actuator.alert.maxValue,
    }
  }

  if (actuator.health !== undefined) {
    request.health = {
      min_value: actuator.health.minValue,
      max_value: actuator.health.maxValue,
    }
  }

  return request
}

const transformUpdateToApiRequest = (update: {
  name?: string
  unitOfMeasurement?: string
  alert?: AlertRange
  health?: HealthRange
}): UpdateActorApiRequest => {
  const request: UpdateActorApiRequest = {}
  
  if (update.name !== undefined) {
    request.name = update.name
  }
  
  if (update.unitOfMeasurement !== undefined) {
    request.unit_of_measurement = update.unitOfMeasurement
  }
  
  if (update.alert !== undefined) {
    request.alert = {
      min_value: update.alert.minValue,
      max_value: update.alert.maxValue,
    }
  }
  
  if (update.health !== undefined) {
    request.health = {
      min_value: update.health.minValue,
      max_value: update.health.maxValue,
    }
  }
  
  return request
}

export const useActuators = (deviceId?: string | null, options?: UseActuatorsOptions) => {
  const poll = options?.poll ?? false

  return useQuery({
    queryKey: [QueryKeys.ACTUATORS, deviceId || 'all'],
    queryFn: async () => {
      if (!deviceId) {
        throw new Error('device_id é obrigatório')
      }
      const url = `/actors?device_id=${deviceId}`
      const response = await get<ActorsApiResponse>(url)
      return response.data.actors.map(transformActorApiToActuator)
    },
    enabled: !!deviceId,
    staleTime: poll ? 0 : 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    placeholderData: [],
    refetchInterval: poll ? ACTUATORS_POLL_INTERVAL_MS : false,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) {
        return false
      }
      return failureCount < 2
    },
    refetchOnWindowFocus: poll,
    refetchOnMount: true,
  })
}

export const useActuator = (id: string) => {
  return useQuery({
    queryKey: [QueryKeys.ACTUATORS, id],
    queryFn: async () => {
      const response = await get<ActorApiResponseSingle>(`/actors/${id}`)
      return transformActorApiToActuator(response.data.actor)
    },
    enabled: !!id,
  })
}

interface CreateActuatorRequest {
  deviceId: string
  name: string
  unitOfMeasurement: string
  alert?: AlertRange
  health?: HealthRange
}

interface UpdateActuatorRequest {
  name?: string
  unitOfMeasurement?: string
  alert?: AlertRange
  health?: HealthRange
}

export const useCreateActuator = () => {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: async (data: CreateActuatorRequest) => {
      const apiRequest = transformActuatorToApiRequest(data)
      const response = await post<CreateActorApiRequest, ActorApiResponseSingle>('/actors', apiRequest)
      return transformActorApiToActuator(response.data.actor)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QueryKeys.ACTUATORS] })
      await queryClient.refetchQueries({ 
        queryKey: [QueryKeys.ACTUATORS],
        type: 'active'
      })
      showToast('Atuador criado com sucesso!', 'success')
    },
    onError: (error: unknown) => {
      const message = extractErrorMessage(error)
      showToast(message, 'error')
    },
  })
}

export const useUpdateActuator = () => {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateActuatorRequest }) => {
      const apiRequest = transformUpdateToApiRequest(data)
      const response = await put<UpdateActorApiRequest, ActorApiResponseSingle>(`/actors/${id}`, apiRequest)
      return transformActorApiToActuator(response.data.actor)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QueryKeys.ACTUATORS] })
      await queryClient.refetchQueries({ 
        queryKey: [QueryKeys.ACTUATORS],
        type: 'active'
      })
      showToast('Atuador atualizado com sucesso!', 'success')
    },
    onError: (error: unknown) => {
      const message = extractErrorMessage(error)
      showToast(message, 'error')
    },
  })
}

export const useDeleteActuator = () => {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: async (id: string) => {
      return del<DeleteActorApiResponse>(`/actors/${id}`)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QueryKeys.ACTUATORS] })
      await queryClient.refetchQueries({ 
        queryKey: [QueryKeys.ACTUATORS],
        type: 'active'
      })
      showToast('Atuador excluído com sucesso!', 'success')
    },
    onError: (error: unknown) => {
      const message = extractErrorMessage(error)
      showToast(message, 'error')
    },
  })
}
