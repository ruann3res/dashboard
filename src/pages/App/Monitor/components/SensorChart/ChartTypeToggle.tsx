import type { ReactNode } from 'react'

export type ChartType = 'line' | 'bar'

interface ChartTypeToggleProps {
  value: ChartType
  onChange: (type: ChartType) => void
}

const options: { type: ChartType; label: string; icon: ReactNode }[] = [
  {
    type: 'line',
    label: 'Linha',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M3 17l5-6 4 3 5-7 4 4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    type: 'bar',
    label: 'Barras',
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M5 20V10M12 20V4M19 20v-7" strokeLinecap="round" />
      </svg>
    ),
  },
]

export const ChartTypeToggle = ({ value, onChange }: ChartTypeToggleProps) => (
  <div className="inline-flex rounded-lg border border-base-300 bg-base-200/60 p-1 gap-1">
    {options.map((option) => {
      const active = value === option.type
      return (
        <button
          key={option.type}
          type="button"
          onClick={() => onChange(option.type)}
          className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            active
              ? 'bg-primary text-primary-content shadow-sm'
              : 'text-base-content/60 hover:text-base-content hover:bg-base-300/50'
          }`}
          aria-pressed={active}
        >
          {option.icon}
          {option.label}
        </button>
      )
    })}
  </div>
)
