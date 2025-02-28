import {PropsWithChildren} from 'react'
import {twJoin} from 'tailwind-merge'

interface Props
  extends PropsWithChildren,
    React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: 'ghost' | 'primary'
  size?: 'xs' | 'xl' | 'sm'
  variant?: 'outline' | 'link'
  shape?: 'circle' | 'square'
  loading?: boolean
}

export const Button = ({
  color,
  size,
  variant,
  shape,
  loading,
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
        shape === 'square' && 'btn-square',
        loading && 'pointer-events-none'
      )}
      {...props}
    >
      {loading ? (
        <>
          <span className="loading loading-dots loading-sm absolute" />
          <span className="opacity-25">{children}</span>
        </>
      ) : (
        children
      )}
    </button>
  )
}
