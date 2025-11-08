export interface AlertRange {
  minValue: number
  maxValue: number
}

export interface HealthRange {
  minValue: number
  maxValue: number
}

export interface Actuator {
  id: string
  deviceId: string
  name: string
  unitOfMeasurement: string
  alert?: AlertRange
  health?: HealthRange
  createdAt: string
  updatedAt: string
}

export interface ActuatorRow {
  id: string
  name: string
  deviceName: string
  unitOfMeasurement: string
  alert?: AlertRange
  health?: HealthRange
  updatedAt: Date
}

export interface ActuatorFilters {
  deviceId: string | null
}