'use client'

import {useCardChecklistStore} from '@/components/cards/card-checklist/card-checklist-store'
import {useCheckboxHandlers} from '@/components/checklist/checkbox/checkbox-handlers'
import {
  closestCenter,
  defaultDropAnimationSideEffects,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import {
  restrictToFirstScrollableAncestor,
  restrictToWindowEdges
} from '@dnd-kit/modifiers'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable
} from '@dnd-kit/sortable'
import {CSS} from '@dnd-kit/utilities'
import {observer, useLocalObservable} from 'mobx-react-lite'
import {PropsWithChildren} from 'react'
import {createPortal} from 'react-dom'
import {useGlobalStore} from '../global-provider/global-store'
import {AddNewCard} from './add-new-card'
import {Card} from './card'
import {useCardDragHandlers} from './cards-drag-handlers'
import {CardsContext, CardsStore, useCardsStore} from './cards-store'
import {getSearchCard} from './get-search-card'
import {Card as CardType} from './types'

export default function CardsProvider({children}: PropsWithChildren) {
  const store = useLocalObservable(() => new CardsStore())

  return <CardsContext.Provider value={store}>{children}</CardsContext.Provider>
}

const CardsSkeleton = () => {
  return Array(3)
    .fill(null)
    .map((_el, inx) => <div key={inx} className="skeleton h-[142px]" />)
}

export const Cards = observer(() => {
  const [state] = useCardsStore()
  const {handleDragStart, handleDragEnd} = useCardDragHandlers()

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8
      }
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 300,
        tolerance: 8
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  if (state.cards.loading) {
    return <CardsSkeleton />
  }

  if (state.cards.error) {
    return <div className="text-error">{state.cards.error.message}</div>
  }

  return (
    <>
      <DndContext
        modifiers={[restrictToWindowEdges, restrictToFirstScrollableAncestor]}
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContextContainer />
        {createPortal(<DragOverlayContainer />, document.body)}
      </DndContext>
      <AddNewCardButton />
    </>
  )
})

const AddNewCardButton = observer(() => {
  const [state] = useCardsStore()
  return (
    <>
      {state.cards?.data && state.cards.data.length >= 0 ? (
        <AddNewCard />
      ) : null}
    </>
  )
})

const SortableContextContainer = observer(() => {
  const [, store] = useCardsStore()
  const cardId = getSearchCard()
  const items = store.searchedCards()
  return (
    <SortableContext items={items}>
      {items.map(card => (
        <SortableContainer
          key={card.id}
          id={card.id}
          card={card}
          active={cardId === card.id}
        />
      ))}
    </SortableContext>
  )
})

const DragOverlayContainer = observer(() => {
  const [state] = useGlobalStore()
  return (
    <DragOverlay
      dropAnimation={{
        sideEffects: defaultDropAnimationSideEffects({
          styles: {active: {opacity: '0.5'}}
        })
      }}
    >
      {state.draggingCard ? (
        <Card card={state.draggingCard} active={false} disableParallax />
      ) : null}
    </DragOverlay>
  )
})

const SortableContainer = ({
  id,
  card,
  active
}: {
  id: string
  card: CardType
  active: boolean
}) => {
  const {attributes, listeners, setNodeRef, transform, transition, isDragging} =
    useSortable({id})

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1
  }

  return (
    <div ref={setNodeRef} style={style}>
      <Card
        card={card}
        active={active}
        dragListeners={listeners}
        dragAttributes={attributes}
      />
    </div>
  )
}

export const CheckAllCheckboxes = observer(() => {
  const id = String(getSearchCard())
  const [state, store] = useCardChecklistStore()
  const {updateAllCheckboxIsCompleted} = useCheckboxHandlers()
  const isAllCompleted = state.progress.get(id) === 100
  const checkboxIds = store.getAllCheckboxes(id)?.map(c => c.id)

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
