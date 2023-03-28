import {IconTrash} from '@tabler/icons-react'
import {Button, Card} from 'react-daisyui'
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
  return (
    <TwCard bordered compact>
      <Card.Body>
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
  )
}
