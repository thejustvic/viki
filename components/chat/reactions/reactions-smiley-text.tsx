import {HTMLProps} from 'react'

export const ReactionsSmileyText = ({
  value,
  className
}: {
  value: string
  className?: HTMLProps<HTMLElement>['className']
}) => {
  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{
        __html: value
      }}
    />
  )
}
