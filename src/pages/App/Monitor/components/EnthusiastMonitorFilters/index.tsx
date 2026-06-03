import { usePublicProjectsList } from '@/hooks/use-public-sensor-data'
import type { MonitorFilters as MonitorFiltersType } from '@/types'
import type { PublicDeviceData } from '@/types/public-sensor-data'

interface EnthusiastMonitorFiltersProps {
  filters: MonitorFiltersType
  onFiltersChange: (filters: MonitorFiltersType) => void
  devices: PublicDeviceData[]
  isLoadingDevices: boolean
}

export const EnthusiastMonitorFilters = ({
  filters,
  onFiltersChange,
  devices,
  isLoadingDevices,
}: EnthusiastMonitorFiltersProps) => {
  const { data: projects = [], isLoading: isLoadingProjects } = usePublicProjectsList(true)

  const handleProjectChange = (projectId: string | null) => {
    onFiltersChange({ projectId, deviceId: null })
  }

  const handleDeviceChange = (deviceId: string | null) => {
    onFiltersChange({ ...filters, deviceId })
  }

  return (
    <div className="card bg-base-100 shadow-xl p-6 rounded-box">
      <div className="flex flex-col md:flex-row flex-wrap gap-4">
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text text-sm font-medium text-base-content/70">
              Projeto público *
            </span>
          </label>
          <select
            className="select select-bordered w-full"
            value={filters.projectId || ''}
            onChange={(e) => handleProjectChange(e.target.value || null)}
            disabled={isLoadingProjects}
            aria-label="Filtrar por projeto público"
          >
            <option value="">Selecione um projeto</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        {filters.projectId && (
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text text-sm font-medium text-base-content/70">
                Dispositivo
              </span>
            </label>
            <select
              className="select select-bordered w-full"
              value={filters.deviceId || ''}
              onChange={(e) => handleDeviceChange(e.target.value || null)}
              disabled={isLoadingDevices}
              aria-label="Filtrar por dispositivo"
            >
              <option value="">Todos os dispositivos</option>
              {devices.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.deviceName}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  )
}
