import {HTMLProps, PropsWithChildren} from 'react'
import {twJoin} from 'tailwind-merge'

interface Props extends PropsWithChildren {
  className?: HTMLProps<HTMLElement>['className']
  style?: HTMLProps<HTMLElement>['style']
}

export const Navbar = ({children, className, ...props}: Props) => {
  return (
    <div className={twJoin('navbar', className)} {...props}>
      {children}
    </div>
  )
}

Navbar.Start = ({children, className, ...props}: Props) => {
  return (
    <div className={twJoin('navbar-start', className)} {...props}>
      {children}
    </div>
  )
}

Navbar.Center = ({children, className, ...props}: Props) => {
  return (
    <div className={twJoin('navbar-center', className)} {...props}>
      {children}
    </div>
  )
}

Navbar.End = ({children, className, ...props}: Props) => {
  return (
    <div className={twJoin('navbar-end', className)} {...props}>
      {children}
    </div>
  )
}
