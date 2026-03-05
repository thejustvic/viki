import {ParallaxCardContainer} from '@/components/common/parallax-card-container'
import {Button} from '@/components/daisyui/button'
import {Card as CardUI} from '@/components/daisyui/card'
import {useUpdateSearchParams} from '@/hooks/use-update-search-params'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {IconSquareRoundedPlus} from '@tabler/icons-react'
import {observer} from 'mobx-react-lite'

import tw from 'tailwind-styled-components'

const TwAdd = tw(Button)`
  shadow-md 
  flex-1
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
    <div className="flex flex-col flex-1 justify-between">
      <CardUI.Title>
        <div className="text-base-content/50 drop-shadow-xl/25">
          add new one
        </div>
      </CardUI.Title>
      <CardUI.Actions>
        <TwAdd soft color="primary" onClick={onClickHandler}>
          <IconSquareRoundedPlus size={24} />
        </TwAdd>
      </CardUI.Actions>
    </div>
  )
})
