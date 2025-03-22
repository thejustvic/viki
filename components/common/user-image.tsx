import {Avatar, AvatarProps} from '@/components/daisyui/avatar'
import {IconUserCircle} from '@tabler/icons-react'
import {HTMLProps} from 'react'

interface Props {
  src: AvatarProps['src']
  shape?: AvatarProps['shape']
  className?: HTMLProps<HTMLElement>['className']
  containerClassName?: HTMLProps<HTMLElement>['className']
}

export const UserImage = ({
  src,
  shape = 'square',
  className,
  containerClassName
}: Props) => {
  if (!src) {
    return (
      <Avatar
        shape={shape}
        className={className}
        containerClassName={containerClassName}
      >
        <IconUserCircle stroke={1} className="w-full h-full" />
      </Avatar>
    )
  }
  return (
    <Avatar
      src={src}
      shape={shape}
      className={className}
      containerClassName={containerClassName}
    />
  )
}
