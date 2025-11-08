import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/Button'
import { useDevices } from '@/hooks/use-devices'
import { useCreateActuator } from '@/hooks/use-actuators'
import { useToast } from '@/hooks'
import type { AlertRange, HealthRange } from '@/types'

interface CreateActuatorModalProps {
  isOpen: boolean
  onClose: () => void
}

export interface CreateActuatorFormData {
  deviceId: string
  name: string
  unitOfMeasurement: string
  alertMinValue?: number
  alertMaxValue?: number
  healthMinValue?: number
  healthMaxValue?: number
}

export const CreateActuatorModal = ({ isOpen, onClose }: CreateActuatorModalProps) => {
  const { data: devices = [] } = useDevices(null)
  const createActuatorMutation = useCreateActuator()
  const { showToast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<CreateActuatorFormData>({
    defaultValues: {
      deviceId: '',
      name: '',
      unitOfMeasurement: '',
      alertMinValue: undefined,
      alertMaxValue: undefined,
      healthMinValue: undefined,
      healthMaxValue: undefined,
    },
  })

  const alertMinValue = watch('alertMinValue')
  const alertMaxValue = watch('alertMaxValue')
  const healthMinValue = watch('healthMinValue')
  const healthMaxValue = watch('healthMaxValue')

  useEffect(() => {
    if (!isOpen) {
      reset()
    }
  }, [isOpen, reset])

  useEffect(() => {
    if (isOpen && devices.length === 0) {
      showToast('É necessário ter pelo menos um dispositivo para criar um atuador. Crie um dispositivo primeiro.', 'warning')
    }
  }, [isOpen, devices.length, showToast])

  const handleFormSubmit = async (data: CreateActuatorFormData) => {
    const alert: AlertRange | undefined =
      data.alertMinValue !== undefined && data.alertMaxValue !== undefined
        ? {
            minValue: data.alertMinValue,
            maxValue: data.alertMaxValue,
          }
        : undefined

    const health: HealthRange | undefined =
      data.healthMinValue !== undefined && data.healthMaxValue !== undefined
        ? {
            minValue: data.healthMinValue,
            maxValue: data.healthMaxValue,
          }
        : undefined

    try {
      await createActuatorMutation.mutateAsync({
        deviceId: data.deviceId,
        name: data.name,
        unitOfMeasurement: data.unitOfMeasurement,
        ...(alert && { alert }),
        ...(health && { health }),
      })
      reset()
      onClose()
    } catch (error) {
      // Error já é tratado no hook
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  if (!isOpen) return null

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-2xl rounded-2xl shadow-xl bg-base-100 border border-base-200 p-0">
        <div className="flex justify-between items-center p-6 border-b border-base-200">
          <h3 className="text-3xl font-semibold text-base-content">
            Criar Novo Atuador
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
              <span className="label-text font-semibold text-lg">Dispositivo *</span>
            </label>
            <select
              {...register('deviceId', {
                required: 'Dispositivo é obrigatório',
              })}
              className={`select select-bordered w-full rounded-lg ${
                errors.deviceId ? 'select-error' : ''
              }`}
              disabled={devices.length === 0}
            >
              <option value="">Selecione um dispositivo</option>
              {devices.map(device => (
                <option key={device.id} value={device.id}>
                  {device.name}
                </option>
              ))}
            </select>
            {errors.deviceId && (
              <p className="text-xs text-error">{errors.deviceId.message}</p>
            )}
            {devices.length === 0 && (
              <p className="text-xs text-warning">
                Nenhum dispositivo disponível. Crie um dispositivo primeiro.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="label">
              <span className="label-text font-semibold text-lg">Nome do Atuador *</span>
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
              placeholder="Digite o nome do atuador"
            />
            {errors.name && (
              <p className="text-xs text-error">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="label">
              <span className="label-text font-semibold text-lg">Unidade de Medida *</span>
            </label>
            <input
              type="text"
              {...register('unitOfMeasurement', {
                required: 'Unidade de medida é obrigatória',
                minLength: {
                  value: 1,
                  message: 'Unidade de medida é obrigatória',
                },
              })}
              className={`input input-bordered w-full rounded-lg ${
                errors.unitOfMeasurement ? 'input-error' : ''
              }`}
              placeholder="Ex: °C, mm, kPa, %"
            />
            {errors.unitOfMeasurement && (
              <p className="text-xs text-error">{errors.unitOfMeasurement.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="label">
                <span className="label-text font-semibold text-lg">Valor Mínimo (Alerta)</span>
              </label>
              <input
                type="number"
                step="any"
                {...register('alertMinValue', {
                  valueAsNumber: true,
                  validate: (value) => {
                    if (value !== undefined && alertMaxValue !== undefined && value >= alertMaxValue) {
                      return 'Valor mínimo deve ser menor que o valor máximo'
                    }
                    return true
                  },
                })}
                className={`input input-bordered w-full rounded-lg ${
                  errors.alertMinValue ? 'input-error' : ''
                }`}
                placeholder="Opcional"
              />
              {errors.alertMinValue && (
                <p className="text-xs text-error">{errors.alertMinValue.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="label">
                <span className="label-text font-semibold text-lg">Valor Máximo (Alerta)</span>
              </label>
              <input
                type="number"
                step="any"
                {...register('alertMaxValue', {
                  valueAsNumber: true,
                  validate: (value) => {
                    if (value !== undefined && alertMinValue !== undefined && value <= alertMinValue) {
                      return 'Valor máximo deve ser maior que o valor mínimo'
                    }
                    return true
                  },
                })}
                className={`input input-bordered w-full rounded-lg ${
                  errors.alertMaxValue ? 'input-error' : ''
                }`}
                placeholder="Opcional"
              />
              {errors.alertMaxValue && (
                <p className="text-xs text-error">{errors.alertMaxValue.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="label">
                <span className="label-text font-semibold text-lg">Valor Mínimo (Health)</span>
              </label>
              <input
                type="number"
                step="any"
                {...register('healthMinValue', {
                  valueAsNumber: true,
                  validate: (value) => {
                    if (value !== undefined && healthMaxValue !== undefined && value >= healthMaxValue) {
                      return 'Valor mínimo deve ser menor que o valor máximo'
                    }
                    return true
                  },
                })}
                className={`input input-bordered w-full rounded-lg ${
                  errors.healthMinValue ? 'input-error' : ''
                }`}
                placeholder="Opcional"
              />
              {errors.healthMinValue && (
                <p className="text-xs text-error">{errors.healthMinValue.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="label">
                <span className="label-text font-semibold text-lg">Valor Máximo (Health)</span>
              </label>
              <input
                type="number"
                step="any"
                {...register('healthMaxValue', {
                  valueAsNumber: true,
                  validate: (value) => {
                    if (value !== undefined && healthMinValue !== undefined && value <= healthMinValue) {
                      return 'Valor máximo deve ser maior que o valor mínimo'
                    }
                    return true
                  },
                })}
                className={`input input-bordered w-full rounded-lg ${
                  errors.healthMaxValue ? 'input-error' : ''
                }`}
                placeholder="Opcional"
              />
              {errors.healthMaxValue && (
                <p className="text-xs text-error">{errors.healthMaxValue.message}</p>
              )}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              className="flex-1"
              disabled={createActuatorMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              disabled={createActuatorMutation.isPending || devices.length === 0}
            >
              {createActuatorMutation.isPending ? 'Criando...' : 'Criar Atuador'}
            </Button>
          </div>
        </form>
      </div>

      <form method="dialog" className="modal-backdrop" onClick={handleClose}>
        <button>Fechar</button>
      </form>
    </dialog>
  )
}

