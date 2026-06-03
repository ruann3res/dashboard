import type { Actuator } from './actuator'

export interface SensorDataPoint {
  id: string
  actorId: string
  value: number
  timestamp: string
}

export interface SensorReading {
  actuator: Actuator
  latest: SensorDataPoint | null
  readings: SensorDataPoint[]
  total: number
  isFetching: boolean
}

export interface MonitorFilters {
  deviceId: string | null
  projectId?: string | null
}

export type SensorStatus = 'success' | 'warning' | 'error' | 'neutral'
