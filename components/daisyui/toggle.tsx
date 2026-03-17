import {HTMLProps} from 'react'
import {twMerge} from 'tailwind-merge'

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: HTMLProps<HTMLElement>['className']
}

export const Toggle = ({className, ...props}: Props) => {
  return (
    <input
      type="checkbox"
      className={twMerge('toggle', className)}
      {...props}
    />
  )
}
