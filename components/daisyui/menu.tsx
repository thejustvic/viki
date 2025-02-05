import {HTMLProps, PropsWithChildren} from 'react'
import {twJoin} from 'tailwind-merge'

interface Props
  extends PropsWithChildren,
    React.HTMLAttributes<HTMLUListElement> {
  className?: HTMLProps<HTMLElement>['className']
}

export const Menu = ({children, className, ...props}: Props) => {
  return (
    <ul className={twJoin('menu', className)} {...props}>
      {children}
    </ul>
  )
}
