import {HTMLProps, PropsWithChildren} from 'react'
import {twJoin} from 'tailwind-merge'

interface Props extends PropsWithChildren {
  className?: HTMLProps<HTMLElement>['className']
  style?: HTMLProps<HTMLElement>['style']
}

interface PropsCard extends Props {
  bordered?: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

export const Card = ({
  bordered,
  size,
  className,
  children,
  ...props
}: PropsCard) => {
  return (
    <div
      className={twJoin(
        'card',
        className,
        bordered && 'card-border',
        size === 'xs' && 'card-xs',
        size === 'sm' && 'card-sm',
        size === 'md' && 'card-md',
        size === 'lg' && 'card-lg',
        size === 'xl' && 'card-xl'
      )}
      {...props}
    >
      {children}
    </div>
  )
}

Card.Body = ({children, className, ...props}: Props) => {
  return (
    <div className={twJoin('card-body', className)} {...props}>
      {children}
    </div>
  )
}

Card.Title = ({className, children, ...props}: Props) => {
  return (
    <div className={twJoin('card-title', className)} {...props}>
      {children}
    </div>
  )
}

Card.Actions = ({children, className, ...props}: Props) => {
  return (
    <div className={twJoin('card-actions', className)} {...props}>
      {children}
    </div>
  )
}
