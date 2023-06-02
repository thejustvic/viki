import {Post} from '@/app/posts/utils/types'
import {IconTrash} from '@tabler/icons-react'
import Link from 'next/link'
import {CSSProperties} from 'react'
import {Button, Card} from 'react-daisyui'
import {isMobile, isSafari} from 'react-device-detect'
import Hover from 'react-parallax-tilt'
import tw from 'tailwind-styled-components'

const TwCard = tw(Card)<{$active: boolean}>`
  bg-base-300 
  shadow-md
  w-[288px]
  h-[142px]
  md:w-[190px]
  preserve-3d
  ${p => (p.$active ? 'border-solid border-red-300' : '')}
`

interface Props {
  post: Post
  remove: () => void
  disableTransform?: boolean
  active: boolean
}

export const PostContainer = (props: Props) => {
  if (isSafari || isMobile) {
    return <CardComp {...props} disableTransform />
  }
  return (
    <Hover perspective={800} scale={1.1} className="preserve-3d">
      <CardComp {...props} />
    </Hover>
  )
}

const CardComp = ({post, remove, disableTransform, active}: Props) => {
  const transform: CSSProperties = {
    transform: 'translateZ(20px)'
  }
  const translateZ: CSSProperties = !disableTransform ? transform : {}
  const href = `/?post=${post.id}`

  return (
    <TwCard $active={active} bordered compact>
      <Card.Body style={translateZ}>
        <Card.Title tag="h2" className="flex justify-between">
          <Link href={href}>
            <Button color="ghost">
              <span className="w-16 truncate">{post.text}</span>
            </Button>
          </Link>
          <Button color="ghost" shape="circle" onClick={remove}>
            <IconTrash />
          </Button>
        </Card.Title>
        <Card.Actions className="justify-center">
          <Button color="primary" fullWidth>
            Buy Now
          </Button>
        </Card.Actions>
      </Card.Body>
    </TwCard>
  )
}
