import { Status } from '@/components/ui/Status'
import { SENSOR_POLL_INTERVAL_MS } from '@/hooks/use-sensor-data'

interface MonitorHeaderProps {
  isFetching: boolean
  lastUpdatedAt: number
}

const formatLastUpdate = (timestamp: number) => {
  if (!timestamp) return 'Aguardando dados...'
  return new Date(timestamp).toLocaleTimeString('pt-BR')
}

export const MonitorHeader = ({ isFetching, lastUpdatedAt }: MonitorHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold text-base-content">Monitoramento</h1>
        <p className="text-base-content/70 mt-1">
          Visualize os dados dos sensores em tempo real
        </p>
      </div>

      <div className="flex items-center gap-3 px-4 py-2 rounded-box bg-base-200/60 border border-base-300">
        <div className="flex items-center">
          <Status
            color={isFetching ? 'info' : 'success'}
            text={isFetching ? 'Atualizando...' : 'Ao vivo'}
          />
        </div>
        <div className="divider divider-horizontal mx-0" />
        <div className="text-sm text-base-content/70">
          <span className="font-medium text-base-content">Última atualização:</span>{' '}
          {formatLastUpdate(lastUpdatedAt)}
        </div>
        <div className="hidden md:block text-xs text-base-content/50">
          (a cada {SENSOR_POLL_INTERVAL_MS / 1000}s)
        </div>
      </div>
    </div>
  )
}
