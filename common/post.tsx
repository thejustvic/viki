import {Button, Card} from 'react-daisyui'

interface Props {
  title: string
  remove: () => void
}

export const PostContainer = ({title, remove}: Props) => {
  return (
    <Card bordered compact className="bg-base-300 shadow-md">
      <Card.Body>
        <Card.Title tag="h2" className="flex justify-between">
          {title}
          <Button color="ghost" shape="circle" onClick={remove}>
            X
          </Button>
        </Card.Title>
        <Card.Actions className="justify-end mt-2">
          <Button responsive color="primary">
            Buy Now
          </Button>
        </Card.Actions>
      </Card.Body>
    </Card>
  )
}
