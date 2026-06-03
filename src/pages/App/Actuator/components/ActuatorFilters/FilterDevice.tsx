import type { Device } from '@/types'
import { useDevices } from '@/hooks/use-devices'
import type React from 'react'

interface FilterDeviceProps {
  selectedDeviceId: string | null
  onDeviceChange: (deviceId: string | null) => void
}

export const FilterDevice = ({ selectedDeviceId, onDeviceChange }: FilterDeviceProps) => {
  const { data: devices = [], isLoading } = useDevices(null)

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value
    onDeviceChange(value || null)
  }

  return (
    <div className="form-control w-full max-w-xs">
      <label className="label">
        <span className="label-text text-sm font-medium text-base-content/70">
          Filtrar por Dispositivo *
        </span>
      </label>
      <select
        className="select select-bordered w-full"
        value={selectedDeviceId || ''}
        onChange={handleChange}
        disabled={isLoading}
        aria-label="Filtrar por dispositivo"
        required
      >
        <option value="">Selecione um dispositivo</option>
        {devices.map((device: Device) => (
          <option key={device.id} value={device.id}>
            {device.name} ({device.serialNumber})
          </option>
        ))}
      </select>
    </div>
  )
}

