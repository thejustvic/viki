import tw from 'tailwind-styled-components'
import {Loader} from './loader'

const TwLoad = tw.div`
  mt-8
  h-full
  w-full
  flex
  justify-center
`

export const Load = () => {
  return (
    <TwLoad>
      <Loader />
    </TwLoad>
  )
}
