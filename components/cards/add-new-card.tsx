import {ParallaxCardContainer} from '@/components/common/parallax-card-container'
import {Button} from '@/components/daisyui/button'
import {Card as CardUI} from '@/components/daisyui/card'
import {useUpdateSearchParams} from '@/hooks/use-update-search-params'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {IconSquareRoundedPlus} from '@tabler/icons-react'
import {observer} from 'mobx-react-lite'
import tw from '../common/tw-styled-components'
import {TwCardText} from './card/card-body'

export const AddNewCard = () => {
  return (
    <ParallaxCardContainer bgImage="matrix" cardNodeBody={<CardBody />} my />
  )
}

const TwWrapper = tw.div`
  flex
  flex-col
  flex-1
  justify-between
`

const CardBody = observer(() => {
  const {user} = useSupabase()
  const updateSearchParams = useUpdateSearchParams()
  const onClickHandler = () => {
    if (user) {
      updateSearchParams('create-card', 'true')
    }
  }

  return (
    <TwWrapper>
      <CardUI.Title>
        <TwCardText>push the button below to add a new card</TwCardText>
      </CardUI.Title>
      <CardUI.Actions>
        <Button
          soft
          color="primary"
          className="flex-1"
          onClick={onClickHandler}
        >
          <IconSquareRoundedPlus size={24} />
        </Button>
      </CardUI.Actions>
    </TwWrapper>
  )
})
