import { useQueries } from '@tanstack/react-query'
import { get } from '@/services/api'
import { QueryKeys } from '@/lib/query-keys'
import { useActuators } from './use-actuators'
import type { SensorDataPoint, SensorReading } from '@/types/sensor-data'

export const SENSOR_POLL_INTERVAL_MS = 5000

interface ActorDataApiItem {
  id: string
  actor_id: string
  value: number
  timestamp: string
}

interface ActorDataApiResponse {
  success: boolean
  data: {
    data: ActorDataApiItem[]
    total: number
  }
  timestamp: string
}

const transformDataPoint = (item: ActorDataApiItem): SensorDataPoint => ({
  id: item.id,
  actorId: item.actor_id,
  value: item.value,
  timestamp: item.timestamp,
})

export const useDeviceSensorData = (deviceId: string | null) => {
  const {
    data: actuators = [],
    isLoading: isLoadingActuators,
    isFetching: isFetchingActuators,
  } = useActuators(deviceId, { poll: !!deviceId })

  const actorDataQueries = useQueries({
    queries: actuators.map((actuator) => ({
      queryKey: [QueryKeys.ACTOR_DATA, actuator.id],
      queryFn: async () => {
        const response = await get<ActorDataApiResponse>(`/actors/${actuator.id}/data`)
        return response.data.data.map(transformDataPoint)
      },
      enabled: !!deviceId,
      refetchInterval: SENSOR_POLL_INTERVAL_MS,
      staleTime: 0,
      retry: (failureCount: number, error: { response?: { status?: number } }) => {
        if (error?.response?.status === 401) return false
        return failureCount < 2
      },
      refetchOnWindowFocus: true,
    })),
  })

  const sensors: SensorReading[] = actuators.map((actuator, index) => {
    const query = actorDataQueries[index]
    const readings = query?.data ?? []

    return {
      actuator,
      latest: readings[0] ?? null,
      readings,
      total: readings.length,
      isFetching: query?.isFetching ?? false,
    }
  })

  const isLoading =
    isLoadingActuators ||
    (actuators.length > 0 && actorDataQueries.some((q) => q.isLoading && !q.data))

  const isFetching = isFetchingActuators || actorDataQueries.some((q) => q.isFetching)
  const lastUpdatedAt = Math.max(0, ...actorDataQueries.map((q) => q.dataUpdatedAt || 0))

  return {
    sensors,
    actuators,
    isLoading,
    isFetching,
    lastUpdatedAt,
  }
}
