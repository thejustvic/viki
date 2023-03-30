import {IconTrash} from '@tabler/icons-react'
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
  title: string
  remove: () => void
}

export const PostContainer = ({title, remove}: Props) => {
  const transformStyle: CSSProperties = {
    transformStyle: 'preserve-3d'
  }
  return (
    <Hover perspective={800} scale={1.1} gyroscope style={transformStyle}>
      <TwCard bordered compact style={transformStyle}>
        <Card.Body
          style={{
            transform: 'translateZ(20px)'
          }}
        >
          <Card.Title tag="h2" className="flex justify-between">
            {title}
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
