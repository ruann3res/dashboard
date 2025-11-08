import { FilterProject } from './FilterProject'

interface DeviceFiltersProps {
  selectedProjectId: string | null
  onProjectChange: (projectId: string | null) => void
}

export const DeviceFilters = ({ selectedProjectId, onProjectChange }: DeviceFiltersProps) => {
  return (
    <div className="card bg-base-100 shadow-xl p-6 rounded-box mb-6">
      <div className="flex flex-col md:flex-row flex-wrap gap-4">
        <FilterProject
          selectedProjectId={selectedProjectId}
          onProjectChange={onProjectChange}
        />
      </div>
    </div>
  )
}

