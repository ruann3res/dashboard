import type { Toast as ToastType } from '@/contexts/ToastContext'
import { useToast } from '@/hooks'

export const Toast = ({ toast }: { toast: ToastType }) => {
  const { removeToast } = useToast()

  const getToastClass = () => {
    switch (toast.type) {
      case 'success':
        return 'alert-success'
      case 'error':
        return 'alert-error'
      case 'warning':
        return 'alert-warning'
      case 'info':
        return 'alert-info'
      default:
        return 'alert-info'
    }
  }

  return (
    <div className={`alert ${getToastClass()}`}>
      <span>{toast.message}</span>
      <button
        className="btn btn-sm btn-ghost btn-circle"
        onClick={() => removeToast(toast.id)}
      >
        ✕
      </button>
    </div>
  )
}

