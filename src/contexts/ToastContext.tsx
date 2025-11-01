import { createContext, useState, useCallback, useRef } from 'react'
import type { ReactNode } from 'react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  message: string
  type: ToastType
}

interface ToastContextType {
  toasts: Toast[]
  showToast: (message: string, type?: ToastType) => void
  removeToast: (id: string) => void
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const timeoutRefs = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Date.now().toString()
    const newToast: Toast = { id, message, type }
    setToasts((prev) => [...prev, newToast])

    const timeoutId = setTimeout(() => {
      removeToast(id)
      timeoutRefs.current.delete(id)
    }, 5000)
    
    timeoutRefs.current.set(id, timeoutId)
  }, [removeToast])

  const handleRemoveToast = useCallback((id: string) => {
    const timeoutId = timeoutRefs.current.get(id)
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutRefs.current.delete(id)
    }
    removeToast(id)
  }, [removeToast])

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast: handleRemoveToast }}>
      {children}
    </ToastContext.Provider>
  )
}
