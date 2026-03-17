import tw from '@/components/common/tw-styled-components'
import {HTMLProps, PropsWithChildren} from 'react'
import {twMerge} from 'tailwind-merge'

interface Props extends PropsWithChildren {
  containerClassName?: HTMLProps<HTMLElement>['className']
  className?: HTMLProps<HTMLElement>['className']
  style?: HTMLProps<HTMLElement>['style']
}

export interface AvatarProps extends Props {
  src?: string
  shape?: 'square' | 'circle'
}

const TwImageContainer = tw.div<{$shape?: AvatarProps['shape']}>`
  btn
  p-0
  border-0
  ${p => p.$shape === 'square' && 'rounded-xl'}
  ${p => p.$shape === 'circle' && 'rounded-full'}
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
      <div className={twMerge('avatar', className)} {...props}>
        <TwImageContainer className={containerClassName} $shape={shape}>
          {children}
        </TwImageContainer>
      </div>
    )
  }
  return (
    <div className={twMerge('avatar', className)} {...props}>
      <TwImageContainer className={containerClassName} $shape={shape}>
        <img src={src} />
      </TwImageContainer>
    </div>
  )
}
