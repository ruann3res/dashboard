import { createColumnHelper } from '@tanstack/react-table'
import type { DeviceRow } from '@/types/device-table'
import { Button } from '@/components/ui/Button'

export const columnHelper = createColumnHelper<DeviceRow>()

const formatDate = (date: Date): string => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const daysDiff = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (daysDiff === 0) {
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}, Today`
  }

  if (daysDiff === 1) {
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}, Yesterday`
  }

  if (daysDiff < 7) {
    return `${daysDiff} days ago`
  }

  return date.toLocaleDateString('pt-BR')
}

export const createColumns = () => [
  columnHelper.accessor('name', {
    header: 'Device Name',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status
      if (status === 'online') {
        return <span className="badge badge-success badge-sm">{status}</span>
      }
      return <span className="badge badge-error badge-sm">{status}</span>
    },
  }),
  columnHelper.accessor('projectName', {
    header: 'Project',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('lastUpdate', {
    header: 'Last Update',
    cell: (info) => formatDate(info.getValue()),
  }),
  columnHelper.display({
    id: 'actions',
    header: 'Actions',
    cell: ({ row, table }) => {
      const onEditClick = (table.options.meta as { onEditClick?: (deviceId: string) => void })?.onEditClick
      return (
        <Button
          variant="warning"
          size="sm"
          onClick={() => {
            if (onEditClick) {
              onEditClick(row.original.id)
            }
          }}
          aria-label={`Edit ${row.original.name}`}
        >
          EDIT
        </Button>
      )
    },
    enableSorting: false,
  }),
]

