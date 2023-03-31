import {Post} from '@/app/posts/utils/types'
import {IconTrash} from '@tabler/icons-react'
import Link from 'next/link'
import {CSSProperties} from 'react'
import {Button, Card} from 'react-daisyui'
import Hover from 'react-parallax-tilt'
import tw from 'tailwind-styled-components'

const TwCard = tw(Card)`
  bg-base-300 
  shadow-md 
  w-48 
  h-36
`

interface Props {
  post: Post
  remove: () => void
}

export const PostContainer = ({post, remove}: Props) => {
  const preserve3D: CSSProperties = {
    transformStyle: 'preserve-3d'
  }
  const translateZ: CSSProperties = {
    transform: 'translateZ(20px)'
  }

  return (
    <Hover perspective={800} scale={1.1} gyroscope style={preserve3D}>
      <TwCard bordered compact style={preserve3D}>
        <Card.Body style={translateZ}>
          <Card.Title tag="h2" className="flex justify-between">
            <Link href={`/?post=${post.id}`}>{post.text}</Link>
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
    </Hover>
  )
}
