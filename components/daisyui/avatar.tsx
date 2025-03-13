import {HTMLProps, PropsWithChildren} from 'react'
import {twJoin} from 'tailwind-merge'
import tw from 'tailwind-styled-components'

interface Props extends PropsWithChildren {
  containerClassName?: HTMLProps<HTMLElement>['className']
  className?: HTMLProps<HTMLElement>['className']
  style?: HTMLProps<HTMLElement>['style']
}

export interface AvatarProps extends Props {
  src?: string

  shape?: 'square' | 'circle'
}

const TwImageContainer = tw.div<{
  shape?: AvatarProps['shape']
}>`
  ${p =>
    twJoin(
      'btn p-0',
      p.$shape === 'square' && 'rounded-xl',
      p.$shape === 'circle' && 'rounded-full'
    )}
`

export const Avatar = ({
  src,
  shape,
  className,
  containerClassName,
  children,
  ...props
}: AvatarProps) => {
  if (!src) {
    return (
      <div className={twJoin('avatar', className)} {...props}>
        <TwImageContainer className={containerClassName} $shape={shape}>
          {children}
        </TwImageContainer>
      </div>
    )
  }
  return (
    <div className={twJoin('avatar', className)} {...props}>
      <TwImageContainer className={containerClassName} $shape={shape}>
        <img src={src} />
      </TwImageContainer>
    </div>
  )
}
