import { useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table'

interface DataTableProps<TData> {
  data: TData[]
  columns: ColumnDef<TData, any>[]
  getRowId?: (row: TData) => string
  enableSelection?: boolean
  selectedRowIds?: Set<string>
  onSelectionChange?: (selectedIds: Set<string>) => void
  emptyMessage?: string
  className?: string
  meta?: Record<string, unknown>
}

export const DataTable = <TData,>({
  data,
  columns,
  getRowId,
  enableSelection = false,
  selectedRowIds,
  onSelectionChange,
  emptyMessage = 'Nenhum dado encontrado',
  className = '',
  meta,
}: DataTableProps<TData>) => {
  const rowSelectionState = useMemo(() => {
    if (!enableSelection || !selectedRowIds) return {}
    return Object.fromEntries(
      Array.from(selectedRowIds).map(id => [id, true])
    )
  }, [enableSelection, selectedRowIds])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableRowSelection: enableSelection,
    ...(getRowId && { getRowId }),
    ...(meta && { meta }),
    ...(enableSelection && onSelectionChange && {
      onRowSelectionChange: (updater) => {
        const newSelection = typeof updater === 'function'
          ? updater(table.getState().rowSelection)
          : updater

        const newIds = new Set<string>()
        Object.keys(newSelection).forEach(id => {
          if (newSelection[id]) {
            newIds.add(id)
          }
        })
        onSelectionChange(newIds)
      },
    }),
    ...(enableSelection && {
      state: {
        rowSelection: rowSelectionState,
      },
    }),
  })

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="table table-zebra w-full">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id} className="bg-base-200">
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  className="text-base-content font-semibold"
                  style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                >
                  {header.isPlaceholder ? null : (
                    <div
                      className={
                        header.column.getCanSort()
                          ? 'cursor-pointer select-none'
                          : ''
                      }
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: ' ↑',
                        desc: ' ↓',
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-8 text-base-content/70">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map(row => (
              <tr
                key={row.id}
                className="hover:bg-base-200/50"
              >
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

