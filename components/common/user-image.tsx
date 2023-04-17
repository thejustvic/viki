import {IconUserCircle} from '@tabler/icons-react'
import {Avatar, AvatarProps} from 'react-daisyui'

interface Props {
  src: AvatarProps['src']
  size?: AvatarProps['size']
}

export const UserImage = ({src, size = 'xs'}: Props) => {
  if (!src) {
    return (
      <Avatar size={size} shape="square">
        <IconUserCircle stroke={1} />
      </Avatar>
    )
  }
  return <Avatar size={size} src={src} shape="square" />
}
