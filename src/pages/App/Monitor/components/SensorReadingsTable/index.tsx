import type { SensorReading } from '@/types/sensor-data'

interface SensorReadingsTableProps {
  sensors: SensorReading[]
}

interface TableRow {
  id: string
  sensorName: string
  unit: string
  value: number
  timestamp: string
}

const formatTimestamp = (timestamp: string) => {
  return new Date(timestamp).toLocaleString('pt-BR')
}

export const SensorReadingsTable = ({ sensors }: SensorReadingsTableProps) => {
  const rows: TableRow[] = sensors
    .flatMap((sensor) =>
      sensor.readings.slice(0, 20).map((reading) => ({
        id: reading.id,
        sensorName: sensor.actuator.name,
        unit: sensor.actuator.unitOfMeasurement,
        value: reading.value,
        timestamp: reading.timestamp,
      }))
    )
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 50)

  if (rows.length === 0) {
    return (
      <div className="text-center py-8 text-base-content/60">
        Nenhuma leitura disponível para exibir
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra">
        <thead>
          <tr>
            <th>Sensor</th>
            <th>Valor</th>
            <th>Unidade</th>
            <th>Data/Hora</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td className="capitalize font-medium">{row.sensorName}</td>
              <td>
                {row.value.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}
              </td>
              <td>{row.unit}</td>
              <td className="text-base-content/70">{formatTimestamp(row.timestamp)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
