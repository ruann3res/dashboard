import { useState } from "react"
import type { Project } from "@/types"

type UpdateModalProps = {
  project: Project | null
  onClose: () => void
  onSubmit: (data: { name: string; description: string; visibility: "public" | "private" }) => void
}

export function UpdateModal({ project, onClose, onSubmit }: UpdateModalProps) {
  if (!project) return null

  const [formData, setFormData] = useState({
    name: project.name,
    description: project.description,
    visibility: project.visibility,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <dialog id="edit-project-modal" className="modal modal-open">
      <div className="modal-box max-w-md rounded-2xl shadow-xl bg-primary-content border border-base-200">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-lg text-base-content">
            Editar Projeto
          </h3>
          <button
            type="button"
            className="btn btn-sm btn-ghost hover:bg-base-200 rounded-full"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <label className="label-text font-medium mb-1 block">Nome</label>
            <input
              type="text"
              placeholder="Ex: UAIpy DataHub"
              className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary/60"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="label-text font-medium mb-1 block">Descrição</label>
            <textarea
              placeholder="Breve descrição do projeto..."
              className="textarea textarea-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary/60 resize-none"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
            />
          </div>

          <div>
            <label className="label-text font-medium mb-1 block">Visibilidade</label>
            <select
              className="select select-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary/60"
              value={formData.visibility}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  visibility: e.target.value as "public" | "private",
                })
              }
            >
              <option value="public">Pública</option>
              <option value="private">Privada</option>
            </select>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="btn btn-primary rounded-lg px-5 transition-all hover:shadow-md"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>

      <form method="dialog" className="modal-backdrop" onClick={onClose}>
        <button>fechar</button>
      </form>
    </dialog>
  )
}
