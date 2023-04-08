import {IconSquareRoundedPlus} from '@tabler/icons-react'
import {Button} from 'react-daisyui'
import tw from 'tailwind-styled-components'
import {usePostHandlers} from './posts-handlers'

const TwAdd = tw(Button)`
  bg-base-300 
  shadow-md 
  h-[142px] 
  border-0 
  rounded-2xl
  w-[288px]
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
