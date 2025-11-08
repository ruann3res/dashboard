import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/hooks'
import { extractErrorMessage } from '@/lib/error-utils'

interface SerialNumberModalProps {
  isOpen: boolean
  serialNumber: string
  onClose: () => void
}

export const SerialNumberModal = ({ isOpen, serialNumber, onClose }: SerialNumberModalProps) => {
  const [isCopied, setIsCopied] = useState(false)
  const { showToast } = useToast()
  const handleCopy = async () => {
    if (isCopied) return
    
    try {
      await navigator.clipboard.writeText(serialNumber)
      setIsCopied(true)
    } catch (error) {
      showToast(extractErrorMessage(error), 'error')
    }
  }

  const handleClose = () => {
    setIsCopied(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-md rounded-2xl shadow-xl bg-base-100 border border-base-200 p-0">
        <div className="flex justify-between items-center p-6 border-b border-base-200">
          <h3 className="text-2xl font-semibold text-base-content">
            Serial Number do Dispositivo
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

        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-base-content/70">
              Guarde este código com segurança. Ele será exibido apenas esta vez.
            </p>
            <div className="bg-base-200 p-4 rounded-lg border border-base-300">
              <p className="text-lg font-mono font-semibold text-center break-all">
                {serialNumber}
              </p>
            </div>
          </div>

          {isCopied && (
            <div className="alert alert-warning">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>Código copiado! Esta ação só pode ser realizada uma vez.</span>
            </div>
          )}

          <div className="flex gap-4 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              className="flex-1"
            >
              Fechar
            </Button>
            <Button
              type="button"
              variant={isCopied ? 'secondary' : 'primary'}
              onClick={handleCopy}
              className="flex-1"
              disabled={isCopied}
            >
              {isCopied ? 'Já Copiado' : 'Copiar Código'}
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



