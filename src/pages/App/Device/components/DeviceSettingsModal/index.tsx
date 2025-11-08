import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import type { Device } from '@/types'
import type { DeviceType, DeviceStatus } from '@/types'
import { Button } from '@/components/ui/Button'
import { useProjects } from '@/hooks/use-projects'
import {
  BUTTON_LABELS,
  MODAL_TITLE,
  DELETE_CONFIRM_MESSAGE,
  STATUS_OPTIONS,
  DEVICE_TYPE_OPTIONS,
} from './constants'

interface DeviceSettingsModalProps {
  device: Device | null
  onClose: () => void
  onUpdate: (deviceId: string, data: DeviceSettingsFormData) => Promise<void>
  onDelete: (deviceId: string) => Promise<void>
}

export type DeviceSettingsFormData = {
  projectId: string
  name: string
  description: string
  deviceType: DeviceType
  status: DeviceStatus
}

export const DeviceSettingsModal = ({ device, onClose, onUpdate, onDelete }: DeviceSettingsModalProps) => {
  const { data: projectsResponse } = useProjects()
  const projects = projectsResponse?.data.projects || []

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DeviceSettingsFormData>({
    defaultValues: {
      projectId: device?.projectId || '',
      name: device?.name || '',
      description: device?.description || '',
      deviceType: device?.deviceType || 'actuator',
      status: device?.status || 'online',
    },
  })

  useEffect(() => {
    if (device) {
      reset({
        projectId: device.projectId || '',
        name: device.name || '',
        description: device.description || '',
        deviceType: device.deviceType || 'actuator',
        status: device.status || 'online',
      })
    }
  }, [device, reset])

  if (!device) return null

  const handleFormSubmit = async (data: DeviceSettingsFormData) => {
    await onUpdate(device.id, data)
  }

  const handleDelete = async () => {
    if (confirm(DELETE_CONFIRM_MESSAGE)) {
      await onDelete(device.id)
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-2xl rounded-2xl shadow-xl bg-base-100 border border-base-200 p-0">
        <div className="flex justify-between items-center p-6 border-b border-base-200">
          <h3 className="text-3xl font-semibold text-base-content">
            {MODAL_TITLE}
          </h3>
          <button
            type="button"
            className="btn btn-sm btn-ghost hover:bg-base-200 rounded-full"
            onClick={handleClose}
            aria-label="Fechar modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="label">
              <span className="label-text font-semibold text-lg">Projeto</span>
            </label>
            <select
              {...register('projectId', {
                required: 'Projeto é obrigatório',
              })}
              className={`select select-bordered w-full rounded-lg ${
                errors.projectId ? 'select-error' : ''
              }`}
            >
              <option value="">Selecione um projeto</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
            {errors.projectId && (
              <p className="text-xs text-error">{errors.projectId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="label">
              <span className="label-text font-semibold text-lg">Nome do Dispositivo</span>
            </label>
            <input
              type="text"
              {...register('name', {
                required: 'Nome é obrigatório',
                minLength: {
                  value: 2,
                  message: 'Nome deve ter pelo menos 2 caracteres',
                },
              })}
              className={`input input-bordered w-full rounded-lg ${
                errors.name ? 'input-error' : ''
              }`}
              placeholder="Digite o nome do dispositivo"
            />
            {errors.name && (
              <p className="text-xs text-error">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="label">
              <span className="label-text font-semibold text-lg">Descrição</span>
            </label>
            <textarea
              {...register('description', {
                required: 'Descrição é obrigatória',
                minLength: {
                  value: 10,
                  message: 'Descrição deve ter pelo menos 10 caracteres',
                },
              })}
              className={`textarea textarea-bordered w-full rounded-lg ${
                errors.description ? 'textarea-error' : ''
              }`}
              placeholder="Digite a descrição do dispositivo"
              rows={3}
            />
            {errors.description && (
              <p className="text-xs text-error">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="label">
                <span className="label-text font-semibold text-lg">Tipo</span>
              </label>
              <select
                {...register('deviceType', {
                  required: 'Tipo é obrigatório',
                })}
                className={`select select-bordered w-full rounded-lg ${
                  errors.deviceType ? 'select-error' : ''
                }`}
              >
                {DEVICE_TYPE_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.deviceType && (
                <p className="text-xs text-error">{errors.deviceType.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="label">
                <span className="label-text font-semibold text-lg">Status</span>
              </label>
              <select
                {...register('status', {
                  required: 'Status é obrigatório',
                })}
                className={`select select-bordered w-full rounded-lg ${
                  errors.status ? 'select-error' : ''
                }`}
              >
                {STATUS_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.status && (
                <p className="text-xs text-error">{errors.status.message}</p>
              )}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
            >
              {BUTTON_LABELS.SAVE}
            </Button>
          </div>
        </form>

        <div className="px-6 pb-6">
          <div className="pt-4 border-t border-base-300">
            <Button
              variant="error"
              onClick={handleDelete}
              className="w-full"
            >
              {BUTTON_LABELS.DELETE_DEVICE}
            </Button>
          </div>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop" onClick={handleClose}>
        <button>Fechar</button>
      </form>
    </dialog>
  )
}
