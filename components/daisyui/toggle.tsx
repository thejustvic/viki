import {HTMLProps} from 'react'
import {twJoin} from 'tailwind-merge'

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: HTMLProps<HTMLElement>['className']
}

export const Toggle = ({className, ...props}: Props) => {
  return (
    <input type="checkbox" className={twJoin('toggle', className)} {...props} />
  )
}
