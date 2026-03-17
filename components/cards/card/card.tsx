import {ParallaxCardContainer} from '@/components/common/parallax-card-container'
import {useUpdateSearchParams} from '@/hooks/use-update-search-params'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {DraggableAttributes} from '@dnd-kit/core'
import {SyntheticListenerMap} from '@dnd-kit/core/dist/hooks/utilities'
import {observer} from 'mobx-react-lite'
import {useCardsStore} from '../cards-store'
import {Card as CardType} from '../types'
import {CardBody} from './card-body'

interface ICard {
  disableParallax?: boolean
  card: CardType
  active: boolean
  dragListeners?: SyntheticListenerMap | undefined
  dragAttributes?: DraggableAttributes
}
export const Card = observer(
  ({
    disableParallax = false,
    card,
    active,
    dragListeners,
    dragAttributes
  }: ICard) => {
    const {user} = useSupabase()
    const [, store] = useCardsStore()
    const updateSearchParams = useUpdateSearchParams()

    const remove = () => {
      store.setIdCardToDelete(card.id)
      updateSearchParams('delete-card', 'true')
    }

    const my = user?.id === card.author_id

    return (
      <ParallaxCardContainer
        disableParallax={disableParallax}
        bgImage={card.bg_image}
        active={active}
        my={my}
        cardNodeBody={
          <CardBody
            my={my}
            card={card}
            remove={remove}
            dragListeners={dragListeners}
            dragAttributes={dragAttributes}
          />
        }
      />
    )
  }
)
