import type { Actuator } from '@/types/actuator'
import type { SensorDataPoint, SensorStatus } from '@/types/sensor-data'

interface SensorCardProps {
  actuator: Actuator
  latest: SensorDataPoint | null
  isFetching: boolean
}

const getSensorStatus = (value: number, actuator: Actuator): SensorStatus => {
  if (actuator.alert) {
    if (value < actuator.alert.minValue || value > actuator.alert.maxValue) {
      return 'error'
    }
  }
  if (actuator.health) {
    if (value < actuator.health.minValue || value > actuator.health.maxValue) {
      return 'warning'
    }
  }
  return 'success'
}

const statusBadgeClass: Record<SensorStatus, string> = {
  success: 'badge-success',
  warning: 'badge-warning',
  error: 'badge-error',
  neutral: 'badge-ghost',
}

const statusLabel: Record<SensorStatus, string> = {
  success: 'Normal',
  warning: 'Atenção',
  error: 'Alerta',
  neutral: 'Sem dados',
}

const formatTimestamp = (timestamp: string) => {
  return new Date(timestamp).toLocaleString('pt-BR')
}

export const SensorCard = ({ actuator, latest, isFetching }: SensorCardProps) => {
  const status = latest ? getSensorStatus(latest.value, actuator) : 'neutral'

  return (
    <div className="card bg-base-100 shadow-xl border border-base-200">
      <div className="card-body">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h2 className="card-title text-lg capitalize">{actuator.name}</h2>
            <p className="text-sm text-base-content/60">{actuator.unitOfMeasurement}</p>
          </div>
          <div className="flex items-center gap-2">
            {isFetching && (
              <span className="loading loading-spinner loading-xs text-primary" />
            )}
            <span className={`badge ${statusBadgeClass[status]}`}>
              {statusLabel[status]}
            </span>
          </div>
        </div>

        {latest ? (
          <>
            <div className="mt-2">
              <span className="text-4xl font-bold text-secondary">
                {latest.value.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}
              </span>
              <span className="text-lg text-base-content/60 ml-2">
                {actuator.unitOfMeasurement}
              </span>
            </div>
            <p className="text-xs text-base-content/50 mt-1">
              {formatTimestamp(latest.timestamp)}
            </p>
          </>
        ) : (
          <div className="py-6 text-center text-base-content/50">
            Nenhuma leitura recebida ainda
          </div>
        )}
      </div>
    </div>
  )
}
