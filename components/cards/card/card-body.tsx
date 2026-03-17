import {CardChecklistProgress} from '@/components/cards/card-checklist/card-checklist-progress'
import tw from '@/components/common/tw-styled-components'
import {Button} from '@/components/daisyui/button'
import {Card as CardUI} from '@/components/daisyui/card'
import {useBoolean} from '@/hooks/use-boolean'
import {useUpdateSearchParams} from '@/hooks/use-update-search-params'
import {DraggableAttributes} from '@dnd-kit/core'
import {SyntheticListenerMap} from '@dnd-kit/core/dist/hooks/utilities'
import {observer} from 'mobx-react-lite'
import {useGlobalStore} from '../../global-provider/global-store'
import {Card as CardType} from '../types'
import {CardActionButtons} from './card-action-buttons'

interface ITwWrapper {
  $isDragging: boolean
}
const TwWrapper = tw.div<ITwWrapper>`
  flex
  flex-1
  flex-col
  justify-between
  ${({$isDragging}) => $isDragging && 'cursor-grabbing'}
`

const TwCardTitle = tw(CardUI.Title)`
  flex
  justify-between
`

const TwCardActions = tw(CardUI.Actions)`
  justify-center
`

export const TwCardText = tw.div`
  text-base-content/50
  line-clamp-3
  drop-shadow-xl/25
`

interface CardProps {
  my?: boolean
  card: CardType
  remove: () => void
  dragListeners: SyntheticListenerMap | undefined
  dragAttributes?: DraggableAttributes
}
export const CardBody = observer(
  ({my, card, remove, dragListeners, dragAttributes}: CardProps) => {
    const [state] = useGlobalStore()
    const updateSearchParams = useUpdateSearchParams()
    const hovered = useBoolean(false)

    const onClickHandler = () => {
      updateSearchParams('card', card.id)
    }

    return (
      <TwWrapper
        $isDragging={Boolean(state.draggingCard)}
        onMouseOver={() => {
          if (!hovered.value) {
            hovered.turnOn()
          }
        }}
        onMouseLeave={hovered.turnOff}
      >
        <TwCardTitle>
          <TwCardText>{card.text}</TwCardText>
          {my && (
            <CardActionButtons
              isDragging={Boolean(state.draggingCard)}
              hovered={hovered.value}
              remove={remove}
              dragListeners={dragListeners}
              dragAttributes={dragAttributes}
            />
          )}
        </TwCardTitle>
        <TwCardActions>
          <Button
            soft
            color="primary"
            className="w-full"
            onClick={onClickHandler}
          >
            <CardChecklistProgress id={card.id} />
          </Button>
        </TwCardActions>
      </TwWrapper>
    )
  }
)
