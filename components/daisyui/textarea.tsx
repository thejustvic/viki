import {HTMLProps, PropsWithChildren} from 'react'
import {twMerge} from 'tailwind-merge'

interface Props
  extends PropsWithChildren, React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: HTMLProps<HTMLElement>['className']
}

interface PropsTextarea extends Props {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  disable?: boolean
  textareaId: string
}

export const Textarea = ({
  textareaId,
  children,
  size,
  disable,
  className,
  ...props
}: PropsTextarea) => {
  return (
    <textarea
      id={textareaId}
      disabled={disable}
      className={twMerge(
        'textarea focus:outline-none border-base-content/10 focus:border-primary/50',
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
