import type { Actuator } from '@/types'

export const mockActuators: Actuator[] = [
  // Project 1
  {
    id: 'actuator-1',
    deviceId: 'device-1',
    name: 'Atuador A',
    unitOfMeasurement: '°C',
    alert: {
      minValue: 0,
      maxValue: 100,
    },
    health: {
      minValue: 0,
      maxValue: 100,
    },
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'actuator-2',
    deviceId: 'device-1',
    name: 'Atuador B',
    unitOfMeasurement: 'mm',
    alert: {
      minValue: 0,
      maxValue: 100,
    },
    health: {
      minValue: 0,
      maxValue: 100,
    },
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'actuator-4',
    deviceId: 'device-2',
    name: 'Atuador D',
    unitOfMeasurement: 'kPa',
    alert: {
      minValue: 0,
      maxValue: 100,
    },
    health: {
      minValue: 0,
      maxValue: 100,
    },
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  // Project 2
  {
    id: 'actuator-5',
    deviceId: 'device-3',
    name: 'Atuador E',
    unitOfMeasurement: 'mg/L',
    alert: {
      minValue: 0,
      maxValue: 100,
    },
    health: {
      minValue: 0,
      maxValue: 100,
    },
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'actuator-6',
    deviceId: 'device-3',
    name: 'Atuador F',
    unitOfMeasurement: 'ppm',
    alert: {
      minValue: 0,
      maxValue: 100,
    },
    health: {
      minValue: 0,
      maxValue: 100,
    },
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'actuator-7',
    deviceId: 'device-4',
    name: 'Atuador G',
    unitOfMeasurement: 'lux',
    alert: {
      minValue: 0,
      maxValue: 100,
    },
    health: {
      minValue: 0,
      maxValue: 100,
    },
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
]