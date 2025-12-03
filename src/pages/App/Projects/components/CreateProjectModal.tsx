import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/Button'

interface CreateProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateProjectFormData) => Promise<void>
}

export interface CreateProjectFormData {
  name: string
  description: string
  visibility: 'public' | 'private'
}

export const CreateProjectModal = ({ isOpen, onClose, onSubmit }: CreateProjectModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateProjectFormData>({
    defaultValues: {
      name: '',
      description: '',
      visibility: 'private',
    },
  })

  const handleFormSubmit = async (data: CreateProjectFormData) => {
    await onSubmit(data)
    reset()
    onClose()
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
            Criar Novo Projeto
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
              <span className="label-text font-semibold text-lg">Nome do Projeto</span>
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
              placeholder="Digite o nome do projeto"
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
              placeholder="Digite a descrição do projeto"
              rows={4}
            />
            {errors.description && (
              <p className="text-xs text-error">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="label">
              <span className="label-text font-semibold text-lg">Visibilidade</span>
            </label>
            <select
              {...register('visibility', {
                required: 'Visibilidade é obrigatória',
              })}
              className={`select select-bordered w-full rounded-lg ${
                errors.visibility ? 'select-error' : ''
              }`}
            >
              <option value="private">Privado</option>
              <option value="public">Público</option>
            </select>
            {errors.visibility && (
              <p className="text-xs text-error">{errors.visibility.message}</p>
            )}
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
              Criar Projeto
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

