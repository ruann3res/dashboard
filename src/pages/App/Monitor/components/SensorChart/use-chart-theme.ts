import { useMemo } from 'react'
import { useTheme } from '@/contexts/ThemeContext'

const readCssVar = (name: string, fallback: string) => {
  if (typeof document === 'undefined') return fallback
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return value || fallback
}

export const useChartTheme = () => {
  const { theme } = useTheme()

  return useMemo(() => {
    const isDark = theme === 'dark'

    return {
      line: readCssVar('--color-primary', '#00c2b3'),
      success: readCssVar('--color-success', '#22c55e'),
      error: readCssVar('--color-error', '#f43f5e'),
      grid: isDark ? 'rgba(230, 237, 247, 0.1)' : 'rgba(15, 23, 42, 0.08)',
      axis: isDark ? 'rgba(230, 237, 247, 0.55)' : 'rgba(15, 23, 42, 0.5)',
      cursor: isDark ? 'rgba(0, 212, 194, 0.15)' : 'rgba(0, 194, 179, 0.12)',
      plotBg: isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.6)',
      dotStroke: isDark ? '#0e1a1a' : '#ffffff',
      dotGlow: isDark ? 'rgba(0, 212, 194, 0.45)' : 'rgba(0, 194, 179, 0.35)',
    }
  }, [theme])
}
