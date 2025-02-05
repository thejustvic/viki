import {HTMLProps, PropsWithChildren} from 'react'
import {twJoin} from 'tailwind-merge'

interface Props
  extends PropsWithChildren,
    React.AnchorHTMLAttributes<HTMLAnchorElement> {
  className?: HTMLProps<HTMLElement>['className']
}

export const Link = ({children, className, ...props}: Props) => {
  return (
    <a className={twJoin('link', className)} {...props}>
      {children}
    </a>
  )
}
