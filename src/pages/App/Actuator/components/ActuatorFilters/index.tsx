import { FilterDevice } from './FilterDevice'
import type { ActuatorFilters as ActuatorFiltersType } from '@/types'

interface ActuatorFiltersProps {
  filters: ActuatorFiltersType
  onFiltersChange: (filters: ActuatorFiltersType) => void
}

export const ActuatorFilters = ({ filters, onFiltersChange }: ActuatorFiltersProps) => {
  const handleDeviceChange = (deviceId: string | null) => {
    onFiltersChange({
      deviceId,
    })
  }

  return (
    <div className="card bg-base-100 shadow-xl p-6 rounded-box mb-6">
      <div className="flex flex-col md:flex-row flex-wrap gap-4">
        <FilterDevice
          selectedDeviceId={filters.deviceId}
          onDeviceChange={handleDeviceChange}
        />
      </div>
    </div>
  )
}

