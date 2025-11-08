import { useState, useMemo } from 'react'
import { ActuatorHeader } from './components/ActuatorHeader'
import { ActuatorFilters } from './components/ActuatorFilters'
import { CreateActuatorModal } from './components/CreateActuatorModal'
import { EditActuatorModal } from './components/EditActuatorModal'
import { DataTable } from '@/components/ui/DataTable'
import { useActuators } from '@/hooks/use-actuators'
import { useDevices } from '@/hooks/use-devices'
import { useToast } from '@/hooks'
import { createColumns } from './components/actuator-table-columns'
import type { ActuatorFilters as ActuatorFiltersType, ActuatorRow } from '@/types'

const initialFilters: ActuatorFiltersType = {
  deviceId: null,
}

export const ActuatorPage = () => {
  const [filters, setFilters] = useState<ActuatorFiltersType>(initialFilters)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingActuatorId, setEditingActuatorId] = useState<string | null>(null)

  const { data: actuators = [], isLoading } = useActuators(filters.deviceId)
  const { data: allDevices = [] } = useDevices(null)
  const { showToast } = useToast()

  const columns = useMemo(() => createColumns(), [])

  const actuatorRows = useMemo(() => {
    if (!actuators || actuators.length === 0) {
      return []
    }

    return actuators.map(actuator => {
      const device = allDevices.find(d => d.id === actuator.deviceId)
      return {
        id: actuator.id,
        name: actuator.name,
        deviceName: device?.name || 'Unknown',
        unitOfMeasurement: actuator.unitOfMeasurement,
        alert: actuator.alert,
        health: actuator.health,
        updatedAt: new Date(actuator.updatedAt),
      } satisfies ActuatorRow
    })
  }, [actuators, allDevices])

  const showLoading = isLoading && actuators.length === 0

  const handleEditClick = (actuatorId: string) => {
    setEditingActuatorId(actuatorId)
  }

  const handleCreateClick = () => {
    if (allDevices.length === 0) {
      showToast('É necessário ter pelo menos um dispositivo para criar um atuador. Crie um dispositivo primeiro.', 'warning')
      return
    }
    setIsCreateModalOpen(true)
  }

  return (
    <>
      <div className="p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <ActuatorHeader onCreateClick={handleCreateClick} />

          <ActuatorFilters
            filters={filters}
            onFiltersChange={setFilters}
          />

          <div className="card bg-base-100 shadow-xl p-6 rounded-box">
            {!filters.deviceId ? (
              <div className="flex justify-center items-center py-12">
                <p className="text-base-content/70 text-lg">
                  Selecione um dispositivo para visualizar os atuadores.
                </p>
              </div>
            ) : showLoading ? (
              <div className="flex justify-center items-center py-12">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : (
              <DataTable<ActuatorRow>
                data={actuatorRows}
                columns={columns}
                getRowId={(row) => row.id}
                emptyMessage="Nenhum atuador encontrado para este dispositivo"
                meta={{ onEditClick: handleEditClick }}
              />
            )}
          </div>
        </div>
      </div>

      <CreateActuatorModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <EditActuatorModal
        actuatorId={editingActuatorId}
        onClose={() => setEditingActuatorId(null)}
      />
    </>
  )
}

