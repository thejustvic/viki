import {Card} from '@/components/daisyui/card'
import {CSSProperties, ReactElement} from 'react'
import {isMobile, isSafari} from 'react-device-detect'
import Hover from 'react-parallax-tilt'
import tw from 'tailwind-styled-components'

const TwCard = tw(Card)<{$active?: boolean; $my?: boolean}>`
  shadow-md
  w-[288px]
  h-[142px]
  md:w-[190px]
  transform-3d
  ${p => (p.$active ? 'border-solid border-accent' : '')}
  ${p => (p.$my ? 'bg-base-300' : 'bg-accent-content')}
`

interface Props {
  disableTransform?: boolean
  active?: boolean
  my?: boolean
  cardNodeBody: ReactElement
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
  const {disableTransform, my, active, cardNodeBody} = props

  const transform: CSSProperties = {
    transform: 'translateZ(20px)'
  }

  const translateZ: CSSProperties = !disableTransform ? transform : {}

  return (
    <TwCard $active={active} $my={my} bordered size="sm">
      <Card.Body style={translateZ}>{cardNodeBody}</Card.Body>
    </TwCard>
  )
}
