import {HTMLProps, PropsWithChildren} from 'react'
import {twJoin} from 'tailwind-merge'

interface Props
  extends PropsWithChildren,
    React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: HTMLProps<HTMLElement>['className']
}

interface PropsTextarea extends Props {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

export const Textarea = ({
  children,
  size,
  className,
  ...props
}: PropsTextarea) => {
  return (
    <textarea
      className={twJoin(
        'textarea focus:outline-none focus:border-primary',
        className,
        size === 'xs' && 'textarea-xs',
        size === 'sm' && 'textarea-sm',
        size === 'md' && 'textarea-md',
        size === 'lg' && 'textarea-lg',
        size === 'xl' && 'textarea-xl'
      )}
      {...props}
    >
      {children}
    </textarea>
  )
}
