import type { ReactNode } from 'react'
import type { Actuator } from '@/types/actuator'
import { getValidRange } from './chart-utils'
import type { ChartType } from './ChartTypeToggle'
import type { useChartTheme } from './use-chart-theme'

type ChartTheme = ReturnType<typeof useChartTheme>

interface ChartLegendProps {
  actuator: Actuator
  theme: ChartTheme
  chartType: ChartType
}

const LegendItem = ({
  icon,
  label,
  detail,
}: {
  icon: ReactNode
  label: string
  detail?: string
}) => (
  <div className="inline-flex items-center gap-2.5 min-w-0">
    <span className="shrink-0 flex items-center justify-center w-8">{icon}</span>
    <span className="flex flex-col min-w-0">
      <span className="text-sm font-medium text-base-content leading-tight">{label}</span>
      {detail && (
        <span className="text-xs text-base-content/55 tabular-nums leading-tight">{detail}</span>
      )}
    </span>
  </div>
)

export const ChartLegend = ({ actuator, theme, chartType }: ChartLegendProps) => {
  const healthRange = getValidRange(actuator.health)
  const alertRange = getValidRange(actuator.alert)

  return (
    <div className="mx-3 mb-2 flex flex-wrap items-stretch gap-x-5 gap-y-2 rounded-lg border border-base-300/60 bg-base-200/50 px-3 py-2.5 sm:px-4 sm:py-3">
      <LegendItem
        icon={
          chartType === 'bar' ? (
            <span className="block w-4 h-4 rounded-sm" style={{ backgroundColor: theme.line }} />
          ) : (
            <span className="relative flex items-center justify-center w-7 h-4">
              <span
                className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 rounded-full"
                style={{ backgroundColor: theme.line }}
              />
            </span>
          )
        }
        label="Leitura do sensor"
        detail={actuator.unitOfMeasurement}
      />

      {healthRange && (
        <LegendItem
          icon={
            <span
              className="block w-7 h-4 rounded border border-success/30"
              style={{ backgroundColor: theme.success, opacity: 0.35 }}
            />
          }
          label="Faixa saudável"
          detail={`${healthRange.minValue.toLocaleString('pt-BR')} – ${healthRange.maxValue.toLocaleString('pt-BR')} ${actuator.unitOfMeasurement}`}
        />
      )}

      {alertRange && (
        <LegendItem
          icon={
            <span className="flex flex-col justify-center gap-1 w-7 h-4">
              <span
                className="block w-full border-t-[2.5px] border-dashed rounded-full"
                style={{ borderColor: theme.error }}
              />
              <span
                className="block w-full border-t-[2.5px] border-dashed rounded-full opacity-80"
                style={{ borderColor: theme.error }}
              />
            </span>
          }
          label={chartType === 'bar' ? 'Fora do limite' : 'Limites de alerta'}
          detail={`${alertRange.minValue.toLocaleString('pt-BR')} – ${alertRange.maxValue.toLocaleString('pt-BR')} ${actuator.unitOfMeasurement}`}
        />
      )}
    </div>
  )
}
