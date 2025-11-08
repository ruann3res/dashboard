import type { Project } from '@/types'
import { useProjects } from '@/hooks/use-projects'

interface FilterProjectProps {
  selectedProjectId: string | null
  onProjectChange: (projectId: string | null) => void
}

export const FilterProject = ({ selectedProjectId, onProjectChange }: FilterProjectProps) => {
  const { data: projectsResponse, isLoading } = useProjects()
  const projects = projectsResponse?.data.projects || []

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value
    onProjectChange(value || null)
  }

  return (
    <div className="form-control w-full max-w-xs">
      <label className="label">
        <span className="label-text text-sm font-medium text-base-content/70">
          Filter project
        </span>
      </label>
      <select
        className="select select-bordered w-full"
        value={selectedProjectId || ''}
        onChange={handleChange}
        disabled={isLoading}
        aria-label="Filter project"
      >
        <option value="">All projects</option>
        {projects.map((project: Project) => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </select>
    </div>
  )
}

