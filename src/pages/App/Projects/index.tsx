import { useState, useEffect } from 'react'
import { ProjectPannel } from './components/ProjectPannel'
import { UpdateModal } from './components/UpdateModal'
import { CreateProjectModal } from './components/CreateProjectModal'
import { useProjects, useUpdateProject, useCreateProject, useDeleteProject } from '@/hooks/use-projects'
import { useDevices } from '@/hooks/use-devices'
import { useToast } from '@/hooks'
import { extractErrorMessage } from '@/lib/error-utils'
import type { Project } from '@/types'
import { LockKeyholeOpen, AnimateIcon, LockKeyhole } from '@/components/ui/Icons/icons'
import { Button } from '@/components/ui/Button'
import type { CreateProjectFormData } from './components/CreateProjectModal'


export const ProjectsPage = () => {
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const { showToast } = useToast()
  const { data: projectsResponse, isLoading, error: projectsError } = useProjects()
  const { data: allDevices = [], error: devicesError } = useDevices()
  const updateProjectMutation = useUpdateProject()
  const createProjectMutation = useCreateProject()
  const deleteProjectMutation = useDeleteProject()

  const projects = projectsResponse?.data.projects || []

  useEffect(() => {
    if (projectsError) {
      const message = extractErrorMessage(projectsError)
      showToast(message, 'error')
    }
  }, [projectsError, showToast])

  useEffect(() => {
    if (devicesError) {
      const message = extractErrorMessage(devicesError)
      showToast(message, 'error')
    }
  }, [devicesError, showToast])

  const handleUpdateProject = async (projectId: string, data: { name: string; description: string; visibility: 'public' | 'private' }) => {
    try {
      await updateProjectMutation.mutateAsync({ id: projectId, data })
      setEditingProject(null)
    } catch (error) {
      // Error já é tratado no hook
    }
  }

  const handleDeleteProject = async (projectId: string) => {
    try {
      await deleteProjectMutation.mutateAsync(projectId)
      setEditingProject(null)
    } catch (error) {
      // Error já é tratado no hook
    }
  }

  const handleEditClick = (project: Project) => {
    setEditingProject(project)
  }

  const closeModal = () => {
    setEditingProject(null)
  }

  const handleCreateProject = async (data: CreateProjectFormData) => {
    try {      
      await createProjectMutation.mutateAsync({
        name: data.name,
        description: data.description,
        visibility: data.visibility,
      })
      setIsCreateModalOpen(false)
    } catch (error) {
      // Error já é tratado no hook
    }
  }

  const handleToggleVisibility = async (project: Project) => {
    try {
      await updateProjectMutation.mutateAsync({
        id: project.id,
        data: {
          visibility: project.visibility === 'public' ? 'private' : 'public',
        },
      })
    } catch (error) {
      // Error já é tratado no hook
    }
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex justify-center items-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="p-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-base-content">Projetos</h1>
            <Button
              variant="primary"
              onClick={() => setIsCreateModalOpen(true)}
            >
              Criar Projeto
            </Button>
          </div>
          <div className="flex flex-col gap-4">
            {projects.length === 0 ? (
              <div className="text-center py-12 text-base-content/70">
                Nenhum projeto encontrado
              </div>
            ) : (
              projects.map(project => {
                const projectDevices = allDevices.filter((device) => device.projectId === project.id)
                const activeCount = projectDevices.filter(d => d.status === 'online').length
                const inactiveCount = projectDevices.filter(d => d.status === 'offline' || d.status === 'error').length
                return (
                  <ProjectPannel
                    key={project.id}
                    title={project.name}
                    properties={[
                      {
                        key: 'Visibilidade',
                        value: project.visibility === 'public' ? 'Pública' : 'Privada',
                        color: 'info',
                        component: <AnimateIcon animateOnHover>
                          {project.visibility === 'private' ? <LockKeyhole /> : <LockKeyholeOpen />}
                        </AnimateIcon>,
                        icon: true,

                        onClick: () => handleToggleVisibility(project),
                      },
                      { key: 'Dispositivos ativos', value: String(activeCount), color: activeCount > 0 ? 'success' : 'error' },
                      { key: 'Dispositivos inativos', value: String(inactiveCount), color: inactiveCount >= 0 ? 'error' : 'success' },
                    ]}
                    onEditClick={() => handleEditClick(project)}
                  />
                )
              })
            )}
          </div>
        </div>
      </div>

      <UpdateModal 
        project={editingProject} 
        onClose={closeModal} 
        onSubmit={(data) => handleUpdateProject(editingProject!.id, data)}
        onDelete={handleDeleteProject}
        isDeleting={deleteProjectMutation.isPending}
      />

      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateProject}
      />
    </>
  )
}
