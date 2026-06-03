import { useQuery } from '@tanstack/react-query'
import { get } from '@/services/api'
import { QueryKeys } from '@/lib/query-keys'
import { SENSOR_POLL_INTERVAL_MS } from './use-sensor-data'
import type { Actuator } from '@/types/actuator'
import type { SensorReading } from '@/types/sensor-data'
import type {
  PublicProjectData,
  PublicProjectDataResponse,
  PublicProjectsDataResponse,
} from '@/types/public-sensor-data'

const toSensorReadings = (
  project: PublicProjectData,
  deviceId: string | null
): SensorReading[] => {
  const devices = deviceId
    ? project.devices.filter((device) => device.deviceId === deviceId)
    : project.devices

  return devices.flatMap((device) =>
    device.actors.map((actor) => {
      const readings = actor.data.map((point) => ({
        id: point.id,
        actorId: actor.actorId,
        value: point.value,
        timestamp: point.timestamp,
      }))

      const actuator: Actuator = {
        id: actor.actorId,
        deviceId: device.deviceId,
        name: actor.actorName,
        unitOfMeasurement: actor.unitOfMeasurement,
        createdAt: '',
        updatedAt: '',
      }

      return {
        actuator,
        latest: readings[0] ?? null,
        readings,
        total: readings.length,
        isFetching: false,
      }
    })
  )
}

export const usePublicProjectsList = (poll = false) => {
  return useQuery({
    queryKey: [QueryKeys.PUBLIC_PROJECTS],
    queryFn: async () => {
      const response = await get<PublicProjectsDataResponse>('/general/projects/data?limit=10')
      return (response.data.projects ?? []).map((project) => ({
        id: project.projectId,
        name: project.projectName,
      }))
    },
    staleTime: poll ? 0 : 1000 * 60,
    refetchInterval: poll ? SENSOR_POLL_INTERVAL_MS : false,
    refetchOnWindowFocus: poll,
  })
}

export const usePublicSensorData = (projectId: string | null, deviceId: string | null) => {
  const query = useQuery({
    queryKey: [QueryKeys.PUBLIC_SENSOR_DATA, projectId],
    queryFn: async () => {
      const response = await get<PublicProjectDataResponse>(
        `/general/projects/${projectId}/data?limit=20`
      )
      return response.data
    },
    enabled: !!projectId,
    refetchInterval: SENSOR_POLL_INTERVAL_MS,
    staleTime: 0,
    refetchOnWindowFocus: true,
    retry: (failureCount, error: { response?: { status?: number } }) => {
      if (error?.response?.status === 401 || error?.response?.status === 403) return false
      return failureCount < 2
    },
  })

  const sensors = query.data ? toSensorReadings(query.data, deviceId) : []
  const devices = query.data?.devices ?? []

  return {
    sensors,
    devices,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    lastUpdatedAt: query.dataUpdatedAt,
  }
}
