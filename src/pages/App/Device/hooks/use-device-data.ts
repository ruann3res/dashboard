import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { QueryKeys } from '@/lib/query-keys'
import { devices } from '@/pages/App/Projects/mockData'
import type { Project, Device } from '@/types'
import type { DeviceSettingsFormData } from '../components/DeviceSettingsModal'

const fetchProjects = async (): Promise<Project[]> => {
  const { projects } = await import('@/pages/App/Projects/mockData')
  await new Promise(resolve => setTimeout(resolve, 300))
  return projects
}

const fetchDevices = async (projectId: string | null): Promise<Device[]> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  if (!projectId) return [...devices]
  return devices.filter(device => device.projectId === projectId)
}

const updateDevice = async (deviceId: string, data: DeviceSettingsFormData): Promise<Device> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  const deviceIndex = devices.findIndex(d => d.id === deviceId)
  if (deviceIndex === -1) {
    throw new Error('Device not found')
  }
  
  const updatedDevice: Device = {
    ...devices[deviceIndex],
    name: data.name,
    status: data.status as Device['status'],
    deviceType: data.deviceType as Device['deviceType'],
    projectId: data.projectId,
    cultura: data.cultura,
    vazao: data.vazao,
    lat: data.lat,
    longitude: data.longitude,
    updatedAt: new Date().toISOString(),
  }
  
  devices[deviceIndex] = updatedDevice
  return updatedDevice
}

const deleteDevice = async (deviceId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  const deviceIndex = devices.findIndex(d => d.id === deviceId)
  if (deviceIndex === -1) {
    throw new Error('Device not found')
  }
  devices.splice(deviceIndex, 1)
}

export const useProjects = () => {
  return useQuery({
    queryKey: [QueryKeys.PROJECTS],
    queryFn: fetchProjects,
  })
}

export const useDevices = (projectId: string | null) => {
  return useQuery({
    queryKey: [QueryKeys.DEVICES, projectId],
    queryFn: () => fetchDevices(projectId),
  })
}

export const useUpdateDevice = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ deviceId, data }: { deviceId: string; data: DeviceSettingsFormData }) =>
      updateDevice(deviceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.DEVICES] })
    },
  })
}

export const useDeleteDevice = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deleteDevice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.DEVICES] })
    },
  })
}

