import {Post} from '@/app/posts/utils/types'
import {IconTrash} from '@tabler/icons-react'
import Link from 'next/link'
import {CSSProperties} from 'react'
import {Button, Card} from 'react-daisyui'
import {isMobile, isSafari} from 'react-device-detect'
import Hover from 'react-parallax-tilt'
import tw from 'tailwind-styled-components'

const TwCard = tw(Card)`
  bg-base-300 
  shadow-md
  h-36
  w-72
  md:w-48
`

interface Props {
  post: Post
  remove: () => void
  disableTranslateZ?: boolean
}

export const PostContainer = (props: Props) => {
  if (isSafari || isMobile) {
    return <CardComp {...props} disableTranslateZ />
  } else {
    const preserve3D: CSSProperties = {
      transformStyle: 'preserve-3d'
    }
    return (
      <Hover perspective={800} scale={1.1} style={preserve3D}>
        <CardComp {...props} />
      </Hover>
    )
  }
}

const CardComp = ({post, remove, disableTranslateZ}: Props) => {
  const preserve3D: CSSProperties = {
    transformStyle: 'preserve-3d'
  }

  const translateZ: CSSProperties = disableTranslateZ
    ? {}
    : {
        transform: 'translateZ(20px)'
      }

  const href = `/?post=${post.id}`

  return (
    <TwCard bordered compact style={preserve3D}>
      <Card.Body style={translateZ}>
        <Card.Title tag="h2" className="flex justify-between">
          <Link href={href}>{post.text}</Link>
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
