import type { ButtonHTMLAttributes } from 'react'
import type { ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'outline' | 'success' | 'error' | 'warning' | 'info'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  children: ReactNode
  wide?: boolean
  circle?: boolean
  square?: boolean
  block?: boolean
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  children,
  wide = false,
  circle = false,
  square = false,
  block = false,
  className = '',
  ...props
}: ButtonProps) => {
  const baseClasses = 'btn'
  const variantClass = variant !== 'primary' ? `btn-${variant}` : ''
  const sizeClass = size !== 'md' ? `btn-${size}` : ''
  const wideClass = wide ? 'btn-wide' : ''
  const circleClass = circle ? 'btn-circle' : ''
  const squareClass = square ? 'btn-square' : ''
  const blockClass = block ? 'btn-block' : ''

  const classes = [
    baseClasses,
    variantClass,
    sizeClass,
    wideClass,
    circleClass,
    squareClass,
    blockClass,
    className
  ].filter(Boolean).join(' ')

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}
