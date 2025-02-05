import {IconUserCircle} from '@tabler/icons-react'
import {Avatar, AvatarProps} from '../daisyui/avatar'

interface Props {
  src: AvatarProps['src']
  shape?: AvatarProps['shape']
}

export const UserImage = ({src, shape = 'square'}: Props) => {
  if (!src) {
    return (
      <Avatar shape={shape}>
        <IconUserCircle stroke={1} className="w-full h-full" />
      </Avatar>
    )
  }
  return <Avatar src={src} shape={shape} />
}
