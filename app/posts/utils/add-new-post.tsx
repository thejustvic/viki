import {IconSquareRoundedPlus} from '@tabler/icons-react'
import {Button} from 'react-daisyui'
import tw from 'tailwind-styled-components'
import {usePostHandlers} from './posts-handlers'

const TwAdd = tw(Button)`
  bg-base-300 
  shadow-md 
  border-0 
  rounded-2xl
  w-[288px]
  h-[142px]
  md:w-[190px]
`

export const AddNewPost = () => {
  const {insertPost} = usePostHandlers()

  return (
    <TwAdd onClick={insertPost}>
      <IconSquareRoundedPlus size={48} />
    </TwAdd>
  )
}
