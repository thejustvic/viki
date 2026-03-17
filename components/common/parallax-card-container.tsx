import {Card} from '@/components/daisyui/card'
import {cardHeight} from '@/utils/const'
import {CSSProperties, ReactElement} from 'react'
import {isMobile, isTablet} from 'react-device-detect'
import Tilt from 'react-parallax-tilt'
import tw from './tw-styled-components'

interface Props {
  disableParallax?: boolean
  disableTransform?: boolean
  active?: boolean
  my?: boolean
  cardNodeBody: ReactElement
  bgImage?: string | null
}
export const ParallaxCardContainer = (props: Props) => {
  if (isMobile || isTablet || props.disableParallax) {
    return <CardComp {...props} disableTransform />
  }
  return (
    <Tilt
      perspective={600}
      scale={1.1}
      className="transform-3d"
      tiltMaxAngleY={0}
      tiltMaxAngleX={8}
    >
      <CardComp {...props} />
    </Tilt>
  )
}

interface ITwCard {
  $isMy: boolean | undefined
  $isActive: boolean | undefined
}
const TwCard = tw(Card)<ITwCard>`
  ${({$isMy}) => ($isMy ? 'bg-base-300/20' : 'bg-accent-content/20')}
  ${({$isActive}) => $isActive && `border-accent`}
  shadow-md
  transform-3d
  bg-no-repeat
  bg-center
  bg-cover
`

const transform: CSSProperties = {
  transform: 'translateZ(20px)'
}

const CardComp = (props: Props) => {
  const {disableTransform, my, active, cardNodeBody, bgImage = 'none'} = props

  const getBgImageUrl = () => {
    return bgImage === 'none' ? 'none' : `url('/${bgImage}.svg')`
  }

  const cardStyle: CSSProperties = {
    backgroundImage: bgImage ? getBgImageUrl() : 'none',
    height: cardHeight
  }

  return (
    <TwCard style={cardStyle} bordered size="sm" $isActive={active} $isMy={my}>
      <Card.Body style={disableTransform ? {} : transform}>
        {cardNodeBody}
      </Card.Body>
    </TwCard>
  )
}
