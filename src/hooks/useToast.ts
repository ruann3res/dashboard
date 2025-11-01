import { useContext } from 'react'
import { ToastContext } from '../contexts/ToastContext'

export const useToast = () => {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast deve ser usado dentro de ToastProvider')
  }
  return context
}

