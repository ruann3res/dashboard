import { FilterDevice } from '@/pages/App/Actuator/components/ActuatorFilters/FilterDevice'
import type { MonitorFilters as MonitorFiltersType } from '@/types'

interface MonitorFiltersProps {
  filters: MonitorFiltersType
  onFiltersChange: (filters: MonitorFiltersType) => void
}

export const MonitorFilters = ({ filters, onFiltersChange }: MonitorFiltersProps) => {
  const handleDeviceChange = (deviceId: string | null) => {
    onFiltersChange({ deviceId })
  }

  return (
    <div className="card bg-base-100 shadow-xl p-6 rounded-box">
      <div className="flex flex-col md:flex-row flex-wrap gap-4">
        <FilterDevice
          selectedDeviceId={filters.deviceId}
          onDeviceChange={handleDeviceChange}
        />
      </div>
    </div>
  )
}
