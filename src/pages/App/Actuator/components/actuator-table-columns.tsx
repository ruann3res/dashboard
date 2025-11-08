import { createColumnHelper } from '@tanstack/react-table'
import type { ActuatorRow } from '@/types'
import { Button } from '@/components/ui/Button'

export const columnHelper = createColumnHelper<ActuatorRow>()

const formatDate = (date: Date): string => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const daysDiff = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (daysDiff === 0) {
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}, Hoje`
  }

  if (daysDiff === 1) {
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}, Ontem`
  }

  if (daysDiff < 7) {
    return `${daysDiff} dias atrás`
  }

  return date.toLocaleDateString('pt-BR')
}

export const createColumns = () => [
  columnHelper.accessor('name', {
    header: 'Nome do Atuador',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('deviceName', {
    header: 'Dispositivo',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('unitOfMeasurement', {
    header: 'Unidade de Medida',
    cell: (info) => info.getValue(),
  }),
  columnHelper.display({
    id: 'alert',
    header: 'Alerta',
    cell: ({ row }) => {
      const alert = row.original.alert
      if (!alert) return <span className="text-base-content/50">-</span>
      return (
        <span className="text-sm">
          {alert.minValue} - {alert.maxValue}
        </span>
      )
    },
  }),
  columnHelper.accessor('updatedAt', {
    header: 'Última Atualização',
    cell: (info) => formatDate(info.getValue()),
  }),
  columnHelper.display({
    id: 'actions',
    header: 'Ações',
    cell: ({ row, table }) => {
      const onEditClick = (table.options.meta as { onEditClick?: (actuatorId: string) => void })?.onEditClick
      return (
        <Button
          variant="warning"
          size="sm"
          onClick={() => {
            if (onEditClick) {
              onEditClick(row.original.id)
            }
          }}
          aria-label={`Editar ${row.original.name}`}
        >
          EDITAR
        </Button>
      )
    },
    enableSorting: false,
  }),
]

