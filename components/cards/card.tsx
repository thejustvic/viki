'use client'

import {CardChecklistProgress} from '@/components/cards/card-checklist/card-checklist-progress'
import {ParallaxCardContainer} from '@/components/common/parallax-card-container'
import {Button} from '@/components/daisyui/button'
import {Card as CardUI} from '@/components/daisyui/card'
import {useBoolean} from '@/hooks/use-boolean'
import {useUpdateSearchParams} from '@/hooks/use-update-search-params'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {DraggableAttributes} from '@dnd-kit/core'
import {SyntheticListenerMap} from '@dnd-kit/core/dist/hooks/utilities'
import {IconDragDrop2, IconTrash} from '@tabler/icons-react'
import {observer} from 'mobx-react-lite'
import {isMobile} from 'react-device-detect'
import {twJoin} from 'tailwind-merge'
import tw from 'tailwind-styled-components'
import {useCardsStore} from './cards-store'
import {Card as CardType} from './types'

export const Card = observer(
  ({
    disableParallax = false,
    card,
    active,
    dragListeners,
    dragAttributes
  }: {
    disableParallax?: boolean
    card: CardType
    active: boolean
    dragListeners?: SyntheticListenerMap | undefined
    dragAttributes?: DraggableAttributes
  }) => {
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

const TwText = tw.div`
  line-clamp-3
  text-[#c0cada]/90
  drop-shadow-[var(--text-shadow)]
`

interface CardProps {
  my?: boolean
  card: CardType
  remove: () => void
  dragListeners: SyntheticListenerMap | undefined
  dragAttributes?: DraggableAttributes
}

const CardBody = observer(
  ({my, card, remove, dragListeners, dragAttributes}: CardProps) => {
    const updateSearchParams = useUpdateSearchParams()
    const hovered = useBoolean(false)

    const onClickHandler = () => {
      updateSearchParams('card', card.id)
    }

    return (
      <div
        className="flex flex-col flex-1 justify-between"
        onMouseEnter={hovered.turnOn}
        onMouseLeave={hovered.turnOff}
      >
        <CardUI.Title className="flex justify-between">
          <TwText>{card.text}</TwText>
          {my && (
            <CardActionButtons
              hovered={hovered.value}
              remove={remove}
              dragListeners={dragListeners}
              dragAttributes={dragAttributes}
            />
          )}
        </CardUI.Title>
        <CardUI.Actions className="justify-center">
          <Button
            soft
            color="primary"
            className="w-full"
            onClick={onClickHandler}
          >
            <CardChecklistProgress id={card.id} />
          </Button>
        </CardUI.Actions>
      </div>
    )
  }
)

interface CardActionButtonsProps {
  hovered?: boolean
  remove: () => void
  dragListeners: SyntheticListenerMap | undefined
  dragAttributes?: DraggableAttributes
}

const CardActionButtons = ({
  dragListeners,
  dragAttributes,
  remove,
  hovered
}: CardActionButtonsProps) => {
  return (
    <>
      {isMobile ? (
        <div className="flex gap-1 self-start">
          <DragCardButton
            dragListeners={dragListeners}
            dragAttributes={dragAttributes}
          />
          <DeleteCardButton remove={remove} />
        </div>
      ) : (
        <div className="flex gap-1 self-start">
          <DragCardButton
            dragListeners={dragListeners}
            dragAttributes={dragAttributes}
            visible={hovered}
          />
          <DeleteCardButton remove={remove} visible={hovered} />
        </div>
      )}
    </>
  )
}

interface DeleteCardButtonProps {
  remove: () => void
  visible?: boolean
}

const DeleteCardButton = ({remove, visible = true}: DeleteCardButtonProps) => {
  return (
    <Button
      soft
      shape="circle"
      size="sm"
      onClick={remove}
      className={twJoin(visible ? 'opacity-100' : 'opacity-0', 'self-start')}
    >
      <IconTrash size={16} />
    </Button>
  )
}

interface DragCardButtonProps {
  dragAttributes?: DraggableAttributes
  dragListeners: SyntheticListenerMap | undefined
  visible?: boolean
}

const DragCardButton = ({
  dragAttributes,
  dragListeners,
  visible = true
}: DragCardButtonProps) => {
  return (
    <div className="tooltip tooltip-info" data-tip="drag to sort">
      <Button
        {...dragAttributes}
        {...dragListeners}
        soft
        shape="circle"
        size="sm"
        className={twJoin(visible ? 'opacity-100' : 'opacity-0', 'self-start')}
      >
        <IconDragDrop2 size={16} />
      </Button>
    </div>
  )
}
