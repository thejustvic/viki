import {PropsWithChildren} from 'react'
import {twJoin} from 'tailwind-merge'

interface Props
  extends PropsWithChildren,
    React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: 'error' | 'primary' | 'info'
  size?: 'xs' | 'xl' | 'sm'
  variant?: 'outline' | 'link'
  shape?: 'circle' | 'square'
  loading?: boolean
  disable?: boolean
  ghost?: boolean
  soft?: boolean
}

export const Button = ({
  soft,
  ghost,
  color,
  size,
  variant,
  shape,
  loading,
  disable,
  children,
  className,
  ...props
}: Props) => {
  return (
    <button
      className={twJoin(
        'btn',
        soft && 'btn-soft',
        ghost && 'btn-ghost',
        className,
        color === 'error' && 'btn-error',
        color === 'info' && 'btn-info',
        color === 'primary' && 'btn-primary',
        size === 'xs' && 'btn-xs',
        size === 'sm' && 'btn-sm',
        size === 'xl' && 'btn-xl',
        variant === 'link' && 'btn-link',
        variant === 'outline' && 'btn-outline',
        shape === 'circle' && 'btn-circle',
        shape === 'square' && 'btn-square',
        disable && 'pointer-events-none'
      )}
      {...props}
    >
      {disable ? (
        <>
          {loading && (
            <span className="loading loading-dots loading-sm absolute" />
          )}
          <span className="opacity-25">{children}</span>
        </>
      ) : (
        children
      )}
    </button>
  )
}
