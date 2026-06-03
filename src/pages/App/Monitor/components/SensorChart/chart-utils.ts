import type { SensorDataPoint } from '@/types/sensor-data'
import type { Actuator } from '@/types/actuator'

export interface ChartPoint {
  time: number
  value: number
}

export const toChartPoints = (readings: SensorDataPoint[]): ChartPoint[] =>
  [...readings]
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .map((reading) => ({
      time: new Date(reading.timestamp).getTime(),
      value: reading.value,
    }))

export const getYDomain = (points: ChartPoint[], actuator: Actuator): [number, number] => {
  const values = points.map((point) => point.value)
  const ranges = [getValidRange(actuator.health), getValidRange(actuator.alert)].filter(
    (range): range is Range => range !== null
  )

  const minValue = Math.min(...values, ...ranges.map((range) => range.minValue))
  const maxValue = Math.max(...values, ...ranges.map((range) => range.maxValue))
  const padding = (maxValue - minValue) * 0.12 || Math.abs(maxValue) * 0.05 || 1

  return [minValue - padding, maxValue + padding]
}

export const getTimeTickFormatter = (points: ChartPoint[]) => {
  if (points.length < 2) {
    return (time: number) =>
      new Date(time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  }

  const spanMs = points[points.length - 1].time - points[0].time

  if (spanMs < 60 * 60 * 1000) {
    return (time: number) =>
      new Date(time).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
  }

  if (spanMs < 24 * 60 * 60 * 1000) {
    return (time: number) =>
      new Date(time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  }

  return (time: number) =>
    new Date(time).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
}

export const formatTooltipTime = (timestamp: number) =>
  new Date(timestamp).toLocaleString('pt-BR')

export const getChartStats = (points: ChartPoint[]) => {
  const values = points.map((point) => point.value)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const avg = values.reduce((sum, value) => sum + value, 0) / values.length

  return { min, max, avg }
}

export const sanitizeGradientId = (id: string) => `chart-fill-${id.replace(/[^a-zA-Z0-9]/g, '')}`

interface Range {
  minValue: number
  maxValue: number
}

/**
 * A API pode retornar alert/health como objeto vazio ({}), o que gera
 * { minValue: undefined, maxValue: undefined }. Só consideramos a faixa
 * válida quando ambos os limites são números.
 */
export const getValidRange = (range?: Partial<Range>): Range | null => {
  if (
    range &&
    typeof range.minValue === 'number' &&
    Number.isFinite(range.minValue) &&
    typeof range.maxValue === 'number' &&
    Number.isFinite(range.maxValue)
  ) {
    return { minValue: range.minValue, maxValue: range.maxValue }
  }
  return null
}
