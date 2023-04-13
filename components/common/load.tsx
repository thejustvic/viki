import tw from 'tailwind-styled-components'
import {Loader} from './loader'

const TwLoad = tw.div<{$center?: boolean}>`
  mt-8
  h-full
  w-full
  flex
  ${p => (p.$center ? 'justify-center' : '')}
`

interface Props {
  className?: string
  center?: boolean
}

export const Load = ({className, center}: Props) => {
  return (
    <TwLoad $center={center}>
      <Loader className={className} />
    </TwLoad>
  )
}
