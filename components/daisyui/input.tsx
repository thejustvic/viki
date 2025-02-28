import {HTMLProps, PropsWithChildren} from 'react'
import {twJoin} from 'tailwind-merge'

interface Props
  extends PropsWithChildren,
    React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  color?: 'primary' | 'secondary'
  inputClassName?: HTMLProps<HTMLElement>['className']
}

const InnerInput = ({color, inputClassName, ...props}: Props) => {
  return (
    <input
      className={twJoin(
        'input input-md focus:outline-none',
        inputClassName,
        color === 'primary' && 'input-primary',
        color === 'secondary' && 'input-secondary'
      )}
      {...props}
    />
  )
}

export const Input = ({
  label,
  color,
  className,
  inputClassName,
  ...props
}: Props) => {
  if (!label) {
    return (
      <InnerInput color={color} inputClassName={inputClassName} {...props} />
    )
  }
  return (
    <label className={twJoin('floating-label', className)}>
      <span>{label}</span>
      <InnerInput color={color} inputClassName={inputClassName} {...props} />
    </label>
  )
}
