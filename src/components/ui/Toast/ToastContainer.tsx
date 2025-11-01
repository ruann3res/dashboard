import { useToast } from '@/hooks'
import { Toast as ToastComponent } from '@/components/ui/Toast/Toast'

export const ToastContainer = () => {
  const { toasts } = useToast()

  return (
    <div className="toast toast-top toast-end z-50">
      {toasts.map((toast) => (
        <ToastComponent key={toast.id} toast={toast} />
      ))}
    </div>
  )
}

