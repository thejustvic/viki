import {ParallaxCardContainer} from '@/components/common/parallax-card-container'
import {Button} from '@/components/daisyui/button'
import {useUpdateSearchParams} from '@/hooks/use-update-search-params'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {IconSquareRoundedPlus} from '@tabler/icons-react'
import {observer} from 'mobx-react-lite'

import tw from 'tailwind-styled-components'

const TwAdd = tw(Button)`
  shadow-md 
  border-0
  rounded-2xl
  w-[288px]
  h-[142px]
  md:w-[190px]
`

export const AddNewCard = () => {
  return <ParallaxCardContainer cardNodeBody={<CardBody />} my />
}

const CardBody = observer(() => {
  const {user} = useSupabase()
  const updateSearchParams = useUpdateSearchParams()
  const onClickHandler = () => {
    if (user) {
      updateSearchParams('create-card', 'true')
    }
  }

  return (
    <TwAdd soft color="primary" onClick={onClickHandler}>
      <IconSquareRoundedPlus size={48} />
    </TwAdd>
  )
})
