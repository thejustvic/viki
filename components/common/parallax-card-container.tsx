import {CSSProperties, ReactElement} from 'react'
import {Card} from 'react-daisyui'
import {isMobile, isSafari} from 'react-device-detect'
import Hover from 'react-parallax-tilt'
import tw from 'tailwind-styled-components'

const TwCard = tw(Card)<{$active?: boolean}>`
  bg-base-300 
  shadow-md
  w-[288px]
  h-[142px]
  md:w-[190px]
  preserve-3d
  ${p => (p.$active ? 'border-solid border-red-300' : '')}
`

interface Props {
  disableTransform?: boolean
  active?: boolean
  cardNodeBody: ReactElement
}

export const ParallaxCardContainer = (props: Props) => {
  if (isSafari || isMobile) {
    return <CardComp {...props} disableTransform />
  }
  return (
    <Hover perspective={800} scale={1.1} className="preserve-3d">
      <CardComp {...props} />
    </Hover>
  )
}

const CardComp = (props: Props) => {
  const {disableTransform, active, cardNodeBody} = props

  const transform: CSSProperties = {
    transform: 'translateZ(20px)'
  }

  const translateZ: CSSProperties = !disableTransform ? transform : {}

  return (
    <TwCard $active={active} bordered compact>
      <Card.Body style={translateZ}>{cardNodeBody}</Card.Body>
    </TwCard>
  )
}
