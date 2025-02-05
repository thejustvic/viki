import {HTMLProps, PropsWithChildren} from 'react'

interface Props
  extends PropsWithChildren,
    React.FormHTMLAttributes<HTMLFormElement> {
  className?: HTMLProps<HTMLElement>['className']
}

export const Form = ({children, ...props}: Props) => {
  return <form {...props}>{children}</form>
}
