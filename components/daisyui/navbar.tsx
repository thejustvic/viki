import {HTMLProps, PropsWithChildren, RefObject} from 'react'
import {twJoin} from 'tailwind-merge'

interface Props extends PropsWithChildren {
  className?: HTMLProps<HTMLElement>['className']
  style?: HTMLProps<HTMLElement>['style']
  ref?: RefObject<HTMLDivElement | null>
}

export const Navbar = ({ref, children, className, ...props}: Props) => {
  return (
    <div
      ref={ref}
      className={twJoin('navbar flex-shrink', className)}
      {...props}
    >
      {children}
    </div>
  )
}

Navbar.Start = ({children, className, ...props}: Props) => {
  return (
    <div className={twJoin('navbar-start flex-shrink', className)} {...props}>
      {children}
    </div>
  )
}

Navbar.Center = ({children, className, ...props}: Props) => {
  return (
    <div className={twJoin('navbar-center flex-shrink', className)} {...props}>
      {children}
    </div>
  )
}

Navbar.End = ({children, className, ...props}: Props) => {
  return (
    <div className={twJoin('navbar-end flex-shrink', className)} {...props}>
      {children}
    </div>
  )
}
