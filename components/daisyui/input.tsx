import {HTMLProps, PropsWithChildren} from 'react'
import {twMerge} from 'tailwind-merge'

interface Props
  extends PropsWithChildren, React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  color?: 'primary' | 'secondary'
  labelClassName?: HTMLProps<HTMLElement>['className']
}

const InnerInput = ({color, className, ...props}: Props) => {
  return (
    <input
      autoComplete="off"
      className={twMerge(
        'input focus:outline-none',
        className,
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
  labelClassName,
  className,
  ...props
}: Props) => {
  if (!label) {
    return <InnerInput color={color} className={className} {...props} />
  }
  return (
    <label className={twMerge('floating-label', labelClassName)}>
      <span>{label}</span>
      <InnerInput color={color} className={className} {...props} />
    </label>
  )
}
