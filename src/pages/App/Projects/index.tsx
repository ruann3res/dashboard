import { useState } from 'react'
import { ProjectPannel } from './components/ProjectPannel'
import { UpdateModal } from './components/UpdateModal'
import { useToast } from '@/hooks'
import { devices } from './mockData'
import type { Project } from '@/types'
import { LockKeyholeOpen, AnimateIcon, LockKeyhole } from '@/components/ui/Icons/icons'


export function Projects() {
  const [localProjects, setLocalProjects] = useState<Project[]>([
    {
      id: 'project-1',
      userId: '1',
      name: 'Projeto 1',
      description: 'Descrição do projeto 1',
      visibility: 'public',
      tags: ['tag1', 'tag2'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ])

  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const { showToast } = useToast()

  const handleUpdateProject = (projectId: string, data: { name: string; description: string; visibility: 'public' | 'private' }) => {
    setLocalProjects(prev => prev.map(project => 
      project.id === projectId 
        ? { ...project, ...data, updatedAt: new Date().toISOString() }
        : project
    ))
    setEditingProject(null)
    showToast(`${data.name} atualizado com sucesso!`, 'success')
  }

  const handleEditClick = (project: Project) => {
    setEditingProject(project)
  }

  const closeModal = () => {
    setEditingProject(null)
  }

  return (
    <>
      <div className="p-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <h1 className="text-3xl font-bold text-base-content mb-6">Projetos</h1>
          <div className="flex flex-col gap-4">
            {localProjects.map(project => {
              const projectDevices = devices.filter((device) => device.projectId === project.id)
              const activeCount = projectDevices.filter(d => d.status === 'online').length
              const inactiveCount = projectDevices.filter(d => d.status === 'offline').length
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
                    },
                    { key: 'Dispositivos ativos', value: String(activeCount), color: activeCount > 0 ? 'success' : 'error' },
                    { key: 'Dispositivos inativos', value: String(inactiveCount), color: inactiveCount >= 0 ? 'error' : 'success' },
                  ]}
                  onEditClick={() => handleEditClick(project)}
                />
              )
            })}
          </div>
        </div>
      </div>

      <UpdateModal 
        project={editingProject} 
        onClose={closeModal} 
        onSubmit={(data) => handleUpdateProject(editingProject!.id, data)} 
      />
    </>
  )
}
