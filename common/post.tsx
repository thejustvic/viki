import {Button, Card} from 'react-daisyui'

interface Props {
  title: string
}

export const PostContainer = ({title}: Props) => {
  return (
    <Card bordered compact className="bg-base-300 shadow-md">
      <Card.Body>
        <Card.Title tag="h2">{title}</Card.Title>
        <Card.Actions className="justify-end mt-2">
          <Button responsive color="primary">
            Buy Now
          </Button>
        </Card.Actions>
      </Card.Body>
    </Card>
  )
}
