import {Card} from '@/components/daisyui/card'
import {CSSProperties, ReactElement} from 'react'
import {isMobile, isSafari} from 'react-device-detect'
import Hover from 'react-parallax-tilt'
import {twJoin} from 'tailwind-merge'

interface Props {
  disableTransform?: boolean
  active?: boolean
  my?: boolean
  cardNodeBody: ReactElement
  bgImage?: string | null
}

export const ParallaxCardContainer = (props: Props) => {
  if (isSafari || isMobile) {
    return <CardComp {...props} disableTransform />
  }
  return (
    <Hover perspective={800} scale={1.1} className="transform-3d">
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

  return (
    <Card
      style={
        bgImage !== 'none'
          ? {
              backgroundImage: `url('/${bgImage}.svg')`
            }
          : undefined
      }
      className={twJoin(
        'shadow-md w-[288px] h-[142px] md:w-[190px] transform-3d bg-no-repeat bg-center bg-cover',
        active && 'border-solid border-accent',
        my ? 'bg-base-300' : 'bg-accent-content'
      )}
      bordered
      size="sm"
    >
      <Card.Body style={translateZ}>{cardNodeBody}</Card.Body>
    </Card>
  )
}
