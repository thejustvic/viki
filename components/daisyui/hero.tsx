import {HTMLProps, PropsWithChildren} from 'react'
import {twJoin} from 'tailwind-merge'

interface Props extends PropsWithChildren {
  className?: HTMLProps<HTMLElement>['className']
}

export const Hero = ({children, className, ...props}: Props) => {
  return (
    <div className={twJoin('hero', className)} {...props}>
      {children}
    </div>
  )
}

Hero.Content = ({children, className, ...props}: Props) => {
  return (
    <div className={twJoin('hero-content', className)} {...props}>
      {children}
    </div>
  )
}
