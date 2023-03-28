import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {IconSquareRoundedPlus} from '@tabler/icons-react'
import {Button} from 'react-daisyui'
import tw from 'tailwind-styled-components'

const TwAdd = tw(Button)`
  bg-base-300 
  shadow-md 
  w-[190px] 
  h-[142px] 
  border-0 
  rounded-2xl
`

export const AddNew = () => {
  const {supabase} = useSupabase()
  const insert = async () => {
    await supabase
      .from('posts')
      .insert({text: (Math.random() + 1).toString(36).substring(7)})
  }
  return (
    <TwAdd onClick={insert}>
      <IconSquareRoundedPlus size={48} />
    </TwAdd>
  )
}
