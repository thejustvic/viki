import {HTMLProps, PropsWithChildren} from 'react'
import {twMerge} from 'tailwind-merge'

interface Props
  extends PropsWithChildren, React.AnchorHTMLAttributes<HTMLAnchorElement> {
  className?: HTMLProps<HTMLElement>['className']
}

export const Link = ({children, className, ...props}: Props) => {
  return (
    <a className={twMerge('link', className)} {...props}>
      {children}
    </a>
  )
}
