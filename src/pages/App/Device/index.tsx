import { useState, useMemo } from 'react'
import { DeviceHeader } from './components/DeviceHeader'
import { DeviceFilters } from './components/DeviceFilters'
import { DeviceSettingsModal } from './components/DeviceSettingsModal'
import { CreateDeviceModal } from './components/CreateDeviceModal'
import { SerialNumberModal } from './components/SerialNumberModal'
import { DataTable } from '@/components/ui/DataTable'
import { useDevices, useUpdateDevice, useDeleteDevice, useCreateDevice } from '@/hooks/use-devices'
import { useProjects } from '@/hooks/use-projects'
import { useToast } from '@/hooks'
import { createColumns } from './components/device-table-columns'
import type { DeviceRow } from '@/types/device-table'
import type { Device } from '@/types'
import type { DeviceSettingsFormData } from './components/DeviceSettingsModal'
import type { CreateDeviceFormData } from './components/CreateDeviceModal'

export const DevicePage = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [editingDevice, setEditingDevice] = useState<Device | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [serialNumber, setSerialNumber] = useState<string | null>(null)
  const [isSerialNumberModalOpen, setIsSerialNumberModalOpen] = useState(false)

  const { data: devicesData = [], isLoading } = useDevices(selectedProjectId)
  const { data: projectsData } = useProjects()
  const { showToast } = useToast()
  const updateDeviceMutation = useUpdateDevice()
  const deleteDeviceMutation = useDeleteDevice()
  const createDeviceMutation = useCreateDevice()

  const columns = useMemo(() => createColumns(), [])

  const deviceRows = useMemo(() => {
    return devicesData.map(device => {
      const project = projectsData?.data?.projects?.find(p => p.id === device.projectId)
      return {
        id: device.id,
        name: device.name,
        status: device.status === 'online' ? 'online' : 'offline',
        projectName: project?.name || 'Unknown',
        lastUpdate: new Date(device.updatedAt),
      } satisfies DeviceRow
    })
  }, [devicesData, projectsData])

  const showLoading = isLoading && devicesData.length === 0

  const handleEditClick = (deviceId: string) => {
    const device = devicesData.find(d => d.id === deviceId)
    if (device) {
      setEditingDevice(device)
    }
  }

  const handleUpdate = async (deviceId: string, data: DeviceSettingsFormData) => {
    try {
      await updateDeviceMutation.mutateAsync({
        id: deviceId,
        data: {
          projectId: data.projectId,
          name: data.name,
          description: data.description,
          deviceType: data.deviceType,
          status: data.status,
        },
      })
      setEditingDevice(null)
    } catch (error) {
      // Error já é tratado no hook
    }
  }

  const handleDelete = async (deviceId: string) => {
    try {
      await deleteDeviceMutation.mutateAsync(deviceId)
      setEditingDevice(null)
    } catch (error) {
      // Error já é tratado no hook
    }
  }

  const handleCloseModal = () => {
    setEditingDevice(null)
  }

  const handleCreateClick = () => {
    const projects = projectsData?.data?.projects || []
    if (projects.length === 0) {
      showToast('É necessário ter pelo menos um projeto para criar um dispositivo. Crie um projeto primeiro.', 'warning')
      return
    }
    setIsCreateModalOpen(true)
  }

  const handleCreateDevice = async (data: CreateDeviceFormData) => {
    try {
      const response = await createDeviceMutation.mutateAsync({
        projectId: data.projectId,
        name: data.name,
        description: data.description,
        deviceType: data.deviceType,
        status: data.status,
      })
      setIsCreateModalOpen(false)
      if (response?.data?.serialNumber) {
        setSerialNumber(response.data.serialNumber)
        setIsSerialNumberModalOpen(true)
      }
    } catch (error) {
      // Error já é tratado no hook
    }
  }

  return (
    <>
      <div className="p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <DeviceHeader onCreateClick={handleCreateClick} />

          <DeviceFilters
            selectedProjectId={selectedProjectId}
            onProjectChange={setSelectedProjectId}
          />

          <div className="card bg-base-100 shadow-xl p-6 rounded-box">
            {showLoading ? (
              <div className="flex justify-center items-center py-12">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : (
              <DataTable<DeviceRow>
                data={deviceRows}
                columns={columns}
                getRowId={(row) => row.id}
                emptyMessage="Nenhum dispositivo encontrado"
                meta={{ onEditClick: handleEditClick }}
              />
            )}
          </div>
        </div>
      </div>

      <DeviceSettingsModal
        device={editingDevice}
        onClose={handleCloseModal}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />

      <CreateDeviceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateDevice}
      />

      {serialNumber && (
        <SerialNumberModal
          isOpen={isSerialNumberModalOpen}
          serialNumber={serialNumber}
          onClose={() => {
            setIsSerialNumberModalOpen(false)
            setSerialNumber(null)
          }}
        />
      )}
    </>
  )
}