import {HTMLProps, PropsWithChildren, RefObject} from 'react'
import {twMerge} from 'tailwind-merge'

interface Props extends PropsWithChildren {
  className?: HTMLProps<HTMLElement>['className']
  style?: HTMLProps<HTMLElement>['style']
  ref?: RefObject<HTMLDivElement | null>
}

export const Navbar = ({ref, children, className, ...props}: Props) => {
  return (
    <div ref={ref} className={twMerge('navbar shrink', className)} {...props}>
      {children}
    </div>
  )
}

Navbar.Start = ({children, className, ...props}: Props) => {
  return (
    <div className={twMerge('navbar-start shrink', className)} {...props}>
      {children}
    </div>
  )
}

Navbar.Center = ({children, className, ...props}: Props) => {
  return (
    <div className={twMerge('navbar-center shrink', className)} {...props}>
      {children}
    </div>
  )
}

Navbar.End = ({children, className, ...props}: Props) => {
  return (
    <div className={twMerge('navbar-end shrink', className)} {...props}>
      {children}
    </div>
  )
}
