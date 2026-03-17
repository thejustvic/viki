import {HTMLProps, PropsWithChildren} from 'react'
import {twMerge} from 'tailwind-merge'

interface Props extends PropsWithChildren {
  className?: HTMLProps<HTMLElement>['className']
}

export const Hero = ({children, className, ...props}: Props) => {
  return (
    <div className={twMerge('hero', className)} {...props}>
      {children}
    </div>
  )
}

Hero.Content = ({children, className, ...props}: Props) => {
  return (
    <div className={twMerge('hero-content', className)} {...props}>
      {children}
    </div>
  )
}
