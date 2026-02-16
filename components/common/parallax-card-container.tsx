import {Card} from '@/components/daisyui/card'
import {CSSProperties, ReactElement} from 'react'
import Hover from 'react-parallax-tilt'
import {ClassNameValue, twJoin} from 'tailwind-merge'

interface Props {
  disableTransform?: boolean
  active?: boolean
  my?: boolean
  cardNodeBody: ReactElement
  bgImage?: string | null
}

export const ParallaxCardContainer = (props: Props) => {
  return (
    <Hover
      perspective={800}
      scale={1.1}
      className="transform-3d"
      tiltMaxAngleY={0}
    >
      <CardComp {...props} />
    </Hover>
  )
}

const CardComp = (props: Props) => {
  const {disableTransform, my, active, cardNodeBody, bgImage = 'none'} = props

  const transform: CSSProperties = {
    transform: 'translateZ(20px)'
  }

  const translateZ: CSSProperties = !disableTransform ? transform : {}

  const cardClassName: ClassNameValue = twJoin(
    `shadow-md
    h-[142px]
    transform-3d 
    bg-no-repeat
    bg-center
    bg-cover`,
    active && 'border-solid border-accent',
    my ? 'bg-base-300/50' : 'bg-accent-content/50'
  )

  const getBgImageUrl = () => {
    return bgImage === 'none' ? 'none' : `url('/${bgImage}.svg')`
  }

  const cardStyle: CSSProperties = {
    backgroundImage: bgImage ? getBgImageUrl() : 'none'
  }

  return (
    <Card style={cardStyle} bordered size="sm" className={cardClassName}>
      <Card.Body style={translateZ}>{cardNodeBody}</Card.Body>
    </Card>
  )
}
