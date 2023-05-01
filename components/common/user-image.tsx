import {IconUserCircle} from '@tabler/icons-react'
import {Avatar, AvatarProps} from 'react-daisyui'

interface Props {
  src: AvatarProps['src']
  size?: AvatarProps['size']
  shape?: AvatarProps['shape']
}

export const UserImage = ({src, size = 'xs', shape = 'square'}: Props) => {
  if (!src) {
    return (
      <Avatar size={size} shape={shape}>
        <IconUserCircle stroke={1} />
      </Avatar>
    )
  }
  return <Avatar size={size} src={src} shape={shape} />
}
