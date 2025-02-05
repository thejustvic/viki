import {PropsWithChildren} from 'react'
import {twJoin} from 'tailwind-merge'

interface Props
  extends PropsWithChildren,
    React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: 'ghost' | 'primary'
  size?: 'xs' | 'xl' | 'sm'
  variant?: 'outline' | 'link'
  shape?: 'circle' | 'square'
}

export const Button = ({
  color,
  size,
  variant,
  shape,
  children,
  className,
  ...props
}: Props) => {
  return (
    <button
      className={twJoin(
        'btn',
        className,
        color === 'ghost' && 'btn-ghost',
        color === 'primary' && 'btn-primary',
        size === 'xs' && 'btn-xs',
        size === 'sm' && 'btn-sm',
        size === 'xl' && 'btn-xl',
        variant === 'link' && 'btn-link',
        variant === 'outline' && 'btn-outline',
        shape === 'circle' && 'btn-circle',
        shape === 'square' && 'btn-square'
      )}
      {...props}
    >
      {children}
    </button>
  )
}
