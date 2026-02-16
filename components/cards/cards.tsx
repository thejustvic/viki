/* eslint-disable max-lines-per-function */
'use client'

import {CardChecklistProgress} from '@/components/cards/card-checklist/card-checklist-progress'
import {useCardChecklistStore} from '@/components/cards/card-checklist/card-checklist-store'
import {useCheckboxHandlers} from '@/components/checklist/checkbox/checkbox-handlers'
import {ParallaxCardContainer} from '@/components/common/parallax-card-container'
import {Button} from '@/components/daisyui/button'
import {Card as CardUI} from '@/components/daisyui/card'
import {useBoolean} from '@/hooks/use-boolean'
import {useLoggingOff} from '@/hooks/use-logging-off'
import {useUpdateSearchParams} from '@/hooks/use-update-search-params'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {IconDragDrop2, IconTrash} from '@tabler/icons-react'
import {generateKeyBetween} from 'fractional-indexing'
import {observer, useLocalObservable} from 'mobx-react-lite'
import {PropsWithChildren, useMemo} from 'react'
import {isMobile} from 'react-device-detect'
import {twJoin} from 'tailwind-merge'
import tw from 'tailwind-styled-components'
import {useTeamStore} from '../team/team-store'
import {AddNewCard} from './add-new-card'
import {useCardChecklistListener} from './card-checklist/use-card-checklist-listener'
import {useCardHandlers} from './cards-handlers'
import {CardsContext, CardsStore, useCardsStore} from './cards-store'
import {getSearchCard} from './get-search-card'
import {Card as CardType} from './types'
import {
  useCardsListener,
  useCheckCardExistInCurrentTeam
} from './use-cards-listener'

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import {SyntheticListenerMap} from '@dnd-kit/core/dist/hooks/utilities'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable
} from '@dnd-kit/sortable'
import {CSS} from '@dnd-kit/utilities'

export default function CardsProvider({children}: PropsWithChildren) {
  const store = useLocalObservable(() => new CardsStore())

  return <CardsContext.Provider value={store}>{children}</CardsContext.Provider>
}

const TwContainer = tw.div`
  grid 
  gap-4 
  p-4  
  max-[425px]:grid-cols-2
  grid-cols-[repeat(auto-fill,_minmax(min(190px,100%),_1fr))]
`

export const CardsList = observer(() => {
  const {supabase, user} = useSupabase()
  const [, store] = useCardsStore()
  const [teamState] = useTeamStore()

  useCardsListener({supabase, user, store, teamState})

  useCheckCardExistInCurrentTeam()
  useLoggingOff()

  return (
    <TwContainer>
      <Cards />
    </TwContainer>
  )
})

const Cards = observer(() => {
  const {supabase, user} = useSupabase()
  const [state, store] = useCardsStore()
  const cardId = getSearchCard()
  const {updateCardPosition} = useCardHandlers()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const [, cardChecklistStore] = useCardChecklistStore()

  const cards = state.cards.data
  const cardsCount = cards?.length

  const cardIds = useMemo(() => {
    const cards = state.cards.data
    if (!cards || cards.length === 0) {
      return null
    }

    return cards.map(card => card.id)
  }, [cards, cardsCount])

  useCardChecklistListener({
    cardIds,
    supabase,
    store: cardChecklistStore,
    user
  })

  if (state.cards.loading) {
    return Array(3)
      .fill(null)
      .map((_el, inx) => <div key={inx} className="skeleton h-[142px]" />)
  }

  if (state.cards.error) {
    return <div className="text-error">{state.cards.error.message}</div>
  }

  const items = store.searchedCards()

  const handleDragEnd = async (event: DragEndEvent) => {
    const {active, over} = event

    if (!cards || !active || !over) {
      return
    }

    if (active.id === over.id) {
      return
    }

    const oldIndex = cards.findIndex(c => c.id === active.id)
    const newIndex = cards.findIndex(c => c.id === over.id)

    let prevPos, nextPos

    if (newIndex < oldIndex) {
      // UPWARDS: move BEFORE the 'over' element
      prevPos = cards[newIndex - 1]?.position || null
      nextPos = cards[newIndex]?.position || null
    } else {
      // Move DOWN: go AFTER the 'over' element
      prevPos = cards[newIndex]?.position || null
      nextPos = cards[newIndex + 1]?.position || null
    }

    try {
      const newPosition = generateKeyBetween(prevPos, nextPos)

      const reordered = arrayMove(cards, oldIndex, newIndex)
      const finalData = reordered.map((card, idx) =>
        idx === newIndex ? {...card, position: newPosition} : card
      )

      store.setCards({
        loading: false,
        data: finalData,
        error: null
      })

      await updateCardPosition(newPosition, String(active.id))
    } catch (err) {
      console.error('error key generation:', err)
    }
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items}>
          {store.searchedCards().map(card => (
            <SortableComp
              key={card.id}
              id={card.id}
              card={card}
              active={cardId === card.id}
            />
          ))}
        </SortableContext>
      </DndContext>
      {state.cards?.data && state.cards.data.length >= 0 ? (
        <AddNewCard />
      ) : null}
    </>
  )
})

function SortableComp({
  id,
  card,
  active
}: {
  id: string
  card: CardType
  active: boolean
}) {
  const {attributes, listeners, setNodeRef, transform, transition} =
    useSortable({id})

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Card card={card} active={active} dragListeners={listeners} />
    </div>
  )
}

const Card = observer(
  ({
    card,
    active,
    dragListeners
  }: {
    card: CardType
    active: boolean
    dragListeners: SyntheticListenerMap | undefined
  }) => {
    const {user} = useSupabase()
    const [, store] = useCardsStore()
    const updateSearchParams = useUpdateSearchParams()

    const remove = () => {
      store.setIdCardToDelete(card.id)
      updateSearchParams('delete-card', 'true')
    }

    return (
      <ParallaxCardContainer
        bgImage={card.bg_image}
        active={active}
        my={user?.id === card.author_id}
        cardNodeBody={
          <CardBody card={card} remove={remove} dragListeners={dragListeners} />
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
  card: CardType
  remove: () => void
  dragListeners: SyntheticListenerMap | undefined
}

const CardBody = observer(({card, remove, dragListeners}: CardProps) => {
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
        {isMobile ? (
          <div className="flex gap-1 self-start">
            <DragCardButton dragListeners={dragListeners} />
            <DeleteCardButton remove={remove} />
          </div>
        ) : (
          <div className="flex gap-1 self-start">
            <DragCardButton
              dragListeners={dragListeners}
              visible={hovered.value}
            />
            <DeleteCardButton remove={remove} visible={hovered.value} />
          </div>
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
})

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
  dragListeners: SyntheticListenerMap | undefined
  visible?: boolean
}

const DragCardButton = ({
  dragListeners,
  visible = true
}: DragCardButtonProps) => {
  return (
    <div className="tooltip tooltip-info" data-tip="drag to sort">
      <Button
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

export const CheckAllCheckboxes = observer(() => {
  const id = String(getSearchCard())
  const [state] = useCardChecklistStore()
  const {updateAllCheckboxIsCompleted} = useCheckboxHandlers()
  const isAllCompleted = state.progress.get(id) === 100
  const checkboxIds = state.checklists.data?.get(id)?.map(c => c.id)

  return (
    <div className="tooltip tooltip-info" data-tip="all">
      <input
        type="checkbox"
        checked={isAllCompleted}
        className="checkbox text-success"
        onChange={() => {
          if (checkboxIds) {
            updateAllCheckboxIsCompleted(!isAllCompleted, checkboxIds)
          } else {
            console.error('checkboxIds is undefined')
          }
        }}
      />
    </div>
  )
})
