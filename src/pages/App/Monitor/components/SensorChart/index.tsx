import { useMemo } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { Actuator } from '@/types/actuator'
import type { SensorDataPoint } from '@/types/sensor-data'
import {
  formatTooltipTime,
  getChartStats,
  getTimeTickFormatter,
  getValidRange,
  getYDomain,
  sanitizeGradientId,
  toChartPoints,
  type ChartPoint,
} from './chart-utils'
import { ChartLegend } from './ChartLegend'
import type { ChartType } from './ChartTypeToggle'
import { useChartTheme } from './use-chart-theme'

interface SensorChartProps {
  actuator: Actuator
  readings: SensorDataPoint[]
  latest: SensorDataPoint | null
  chartType: ChartType
  isFetching?: boolean
}

interface ChartTooltipProps {
  active?: boolean
  payload?: { payload: ChartPoint }[]
  unit: string
}

const ChartTooltip = ({ active, payload, unit }: ChartTooltipProps) => {
  if (!active || !payload?.length) return null

  const point = payload[0].payload

  return (
    <div className="rounded-lg border border-base-300 bg-base-100 px-3 py-2 shadow-lg text-sm">
      <p className="text-base-content/60 text-xs">{formatTooltipTime(point.time)}</p>
      <p className="font-bold text-primary text-base mt-0.5">
        {point.value.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}{' '}
        <span className="font-normal text-base-content/70">{unit}</span>
      </p>
    </div>
  )
}

const StatPill = ({ label, value, unit }: { label: string; value: number; unit: string }) => (
  <div className="rounded-lg bg-base-200/80 px-3 py-2 min-w-0">
    <p className="text-[10px] uppercase tracking-wide text-base-content/50">{label}</p>
    <p className="text-sm font-semibold tabular-nums truncate">
      {value.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}
      <span className="text-base-content/50 font-normal ml-0.5">{unit}</span>
    </p>
  </div>
)

const isOutOfRange = (value: number, actuator: Actuator) => {
  const alert = getValidRange(actuator.alert)
  if (alert) {
    if (value < alert.minValue || value > alert.maxValue) return true
  }
  return false
}

export const SensorChart = ({
  actuator,
  readings,
  latest,
  chartType,
  isFetching,
}: SensorChartProps) => {
  const theme = useChartTheme()
  const points = useMemo(() => toChartPoints(readings), [readings])
  const gradientId = sanitizeGradientId(actuator.id)
  const tickFormatter = useMemo(() => getTimeTickFormatter(points), [points])
  const stats = useMemo(() => (points.length ? getChartStats(points) : null), [points])

  if (points.length === 0) {
    return (
      <div className="rounded-box border border-base-200 bg-base-100 p-5">
        <h3 className="font-semibold capitalize">{actuator.name}</h3>
        <div className="flex h-56 items-center justify-center text-base-content/50 text-sm">
          Sem dados para exibir no gráfico
        </div>
      </div>
    )
  }

  const yDomain = getYDomain(points, actuator)
  const timeDomain: [number, number] = [points[0].time, points[points.length - 1].time]
  // Bolinhas só aparecem quando há poucos pontos, e de forma discreta.
  const showLineDots = points.length <= 30
  const healthRange = getValidRange(actuator.health)
  const alertRange = getValidRange(actuator.alert)

  const commonAxes = (
    <>
      <CartesianGrid stroke={theme.grid} strokeDasharray="3 6" vertical={false} />
      <YAxis
        domain={yDomain}
        tick={{ fill: theme.axis, fontSize: 10 }}
        tickLine={false}
        axisLine={false}
        width={52}
        tickFormatter={(value: number) =>
          value.toLocaleString('pt-BR', { maximumFractionDigits: 1 })
        }
      />
      {healthRange && (
        <ReferenceArea
          y1={healthRange.minValue}
          y2={healthRange.maxValue}
          fill={theme.success}
          fillOpacity={0.12}
          strokeOpacity={0}
        />
      )}
      {alertRange && (
        <>
          <ReferenceLine
            y={alertRange.minValue}
            stroke={theme.error}
            strokeDasharray="5 5"
            strokeOpacity={0.7}
          />
          <ReferenceLine
            y={alertRange.maxValue}
            stroke={theme.error}
            strokeDasharray="5 5"
            strokeOpacity={0.7}
          />
        </>
      )}
      <Tooltip
        content={<ChartTooltip unit={actuator.unitOfMeasurement} />}
        cursor={
          chartType === 'bar'
            ? { fill: theme.line, fillOpacity: 0.08 }
            : { stroke: theme.line, strokeWidth: 1, strokeDasharray: '4 4', strokeOpacity: 0.6 }
        }
      />
    </>
  )

  return (
    <div className="rounded-box border border-base-200 bg-base-100 overflow-hidden">
      <div className="px-5 pt-5 pb-3 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold capitalize text-lg">{actuator.name}</h3>
            {isFetching && <span className="loading loading-spinner loading-xs text-primary" />}
          </div>
          <p className="text-xs text-base-content/50 mt-0.5">
            {points.length} leituras no período
          </p>
        </div>
        {latest && (
          <div className="text-right shrink-0">
            <p className="text-[10px] uppercase tracking-wide text-base-content/50">Atual</p>
            <p className="text-2xl font-bold text-secondary tabular-nums leading-tight">
              {latest.value.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}
              <span className="text-sm font-medium text-base-content/60 ml-1">
                {actuator.unitOfMeasurement}
              </span>
            </p>
          </div>
        )}
      </div>

      {stats && (
        <div className="px-5 pb-3 grid grid-cols-3 gap-2">
          <StatPill label="Mín" value={stats.min} unit={actuator.unitOfMeasurement} />
          <StatPill label="Média" value={stats.avg} unit={actuator.unitOfMeasurement} />
          <StatPill label="Máx" value={stats.max} unit={actuator.unitOfMeasurement} />
        </div>
      )}

      <ChartLegend actuator={actuator} theme={theme} chartType={chartType} />

      <div className="mx-3 mb-3 rounded-lg p-2 sm:p-3" style={{ backgroundColor: theme.plotBg }}>
        <div className="h-56 sm:h-64 w-full min-h-[224px]">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'bar' ? (
              <BarChart data={points} margin={{ top: 12, right: 8, left: 4, bottom: 4 }}>
                {commonAxes}
                <XAxis
                  dataKey="time"
                  type="category"
                  tickFormatter={tickFormatter}
                  tick={{ fill: theme.axis, fontSize: 10 }}
                  tickLine={false}
                  axisLine={{ stroke: theme.grid }}
                  minTickGap={32}
                  dy={8}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={36} isAnimationActive={false}>
                  {points.map((point, index) => (
                    <Cell
                      key={`bar-${index}`}
                      fill={isOutOfRange(point.value, actuator) ? theme.error : theme.line}
                      fillOpacity={index === points.length - 1 ? 1 : 0.85}
                    />
                  ))}
                </Bar>
              </BarChart>
            ) : (
              <AreaChart data={points} margin={{ top: 12, right: 8, left: 4, bottom: 4 }}>
                <defs>
                  <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={theme.line} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={theme.line} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                {commonAxes}
                <XAxis
                  dataKey="time"
                  type="number"
                  scale="time"
                  domain={timeDomain}
                  tickFormatter={tickFormatter}
                  tick={{ fill: theme.axis, fontSize: 10 }}
                  tickLine={false}
                  axisLine={{ stroke: theme.grid }}
                  minTickGap={40}
                  dy={8}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={theme.line}
                  strokeWidth={2.5}
                  fill={`url(#${gradientId})`}
                  dot={showLineDots ? { r: 2.5, fill: theme.line, strokeWidth: 0 } : false}
                  activeDot={{
                    r: 5,
                    fill: theme.line,
                    stroke: theme.dotStroke,
                    strokeWidth: 2,
                  }}
                  isAnimationActive={false}
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
