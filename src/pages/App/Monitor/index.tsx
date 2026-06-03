import { useState } from 'react'
import { MonitorHeader } from './components/MonitorHeader'
import { MonitorFilters } from './components/MonitorFilters'
import { EnthusiastMonitorFilters } from './components/EnthusiastMonitorFilters'
import { SensorCard } from './components/SensorCard'
import { SensorChart } from './components/SensorChart'
import { ChartTypeToggle, type ChartType } from './components/SensorChart/ChartTypeToggle'
import { SensorReadingsTable } from './components/SensorReadingsTable'
import { useDeviceSensorData } from '@/hooks/use-sensor-data'
import { usePublicSensorData } from '@/hooks/use-public-sensor-data'
import { useCurrentUser } from '@/hooks/use-current-user'
import type { MonitorFilters as MonitorFiltersType } from '@/types'

const scientistInitialFilters: MonitorFiltersType = {
  deviceId: null,
}

const enthusiastInitialFilters: MonitorFiltersType = {
  projectId: null,
  deviceId: null,
}

const ScientistMonitor = () => {
  const [filters, setFilters] = useState<MonitorFiltersType>(scientistInitialFilters)
  const { sensors, actuators, isLoading, isFetching, lastUpdatedAt } =
    useDeviceSensorData(filters.deviceId ?? null)

  const showLoading = isLoading && filters.deviceId

  return (
    <>
      <MonitorHeader isFetching={isFetching} lastUpdatedAt={lastUpdatedAt} />
      <MonitorFilters filters={filters} onFiltersChange={setFilters} />
      {!filters.deviceId ? (
        <EmptyState message="Selecione um dispositivo para monitorar os sensores." />
      ) : showLoading ? (
        <LoadingState />
      ) : actuators.length === 0 ? (
        <EmptyState message="Aguardando sensores deste dispositivo. Envie dados via POST /actor-data ou aguarde alguns segundos." />
      ) : (
        <SensorGrid sensors={sensors} isFetching={isFetching} />
      )}
    </>
  )
}

const EnthusiastMonitor = () => {
  const [filters, setFilters] = useState<MonitorFiltersType>(enthusiastInitialFilters)
  const { sensors, devices, isLoading, isFetching, lastUpdatedAt } = usePublicSensorData(
    filters.projectId ?? null,
    filters.deviceId ?? null
  )

  return (
    <>
      <MonitorHeader isFetching={isFetching} lastUpdatedAt={lastUpdatedAt} />
      <EnthusiastMonitorFilters
        filters={filters}
        onFiltersChange={setFilters}
        devices={devices}
        isLoadingDevices={isLoading}
      />
      {!filters.projectId ? (
        <EmptyState message="Selecione um projeto público para visualizar os sensores." />
      ) : isLoading ? (
        <LoadingState />
      ) : sensors.length === 0 ? (
        <EmptyState message="Este projeto não possui leituras de sensores disponíveis." />
      ) : (
        <SensorGrid sensors={sensors} isFetching={isFetching} />
      )}
    </>
  )
}

const EmptyState = ({ message }: { message: string }) => (
  <div className="card bg-base-100 shadow-xl p-6 rounded-box">
    <div className="flex justify-center items-center py-12">
      <p className="text-base-content/70 text-lg">{message}</p>
    </div>
  </div>
)

const LoadingState = () => (
  <div className="card bg-base-100 shadow-xl p-6 rounded-box">
    <div className="flex justify-center items-center py-12">
      <span className="loading loading-spinner loading-lg" />
    </div>
  </div>
)

const SensorGrid = ({
  sensors,
  isFetching,
}: {
  sensors: ReturnType<typeof useDeviceSensorData>['sensors']
  isFetching: boolean
}) => {
  const [chartType, setChartType] = useState<ChartType>('line')

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sensors.map((sensor) => (
          <SensorCard
            key={sensor.actuator.id}
            actuator={sensor.actuator}
            latest={sensor.latest}
            isFetching={isFetching}
          />
        ))}
      </div>

      <div className="card bg-base-100 shadow-xl p-6 rounded-box space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">Gráficos em tempo real</h2>
            <p className="text-sm text-base-content/60 mt-1">
              Evolução das leituras — atualização automática a cada 5 segundos
            </p>
          </div>
          <ChartTypeToggle value={chartType} onChange={setChartType} />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {sensors.map((sensor) => (
            <SensorChart
              key={`chart-${sensor.actuator.id}`}
              actuator={sensor.actuator}
              readings={sensor.readings}
              latest={sensor.latest}
              chartType={chartType}
              isFetching={isFetching}
            />
          ))}
        </div>
      </div>

      <div className="card bg-base-100 shadow-xl p-6 rounded-box">
        <h2 className="text-xl font-semibold mb-4">Leituras recentes</h2>
        <SensorReadingsTable sensors={sensors} />
      </div>
    </>
  )
}

export const MonitorPage = () => {
  const { isEnthusiast } = useCurrentUser()

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {isEnthusiast ? <EnthusiastMonitor /> : <ScientistMonitor />}
      </div>
    </div>
  )
}
