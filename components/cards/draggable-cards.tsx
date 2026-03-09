'use client'

import {
  closestCenter,
  DndContext,
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
import {sortableKeyboardCoordinates} from '@dnd-kit/sortable'
import {observer} from 'mobx-react-lite'
import {createPortal} from 'react-dom'
import {useTeamStore} from '../team/team-store'
import {
  AddNewCardButton,
  CardsSkeleton,
  DragOverlayContainer,
  SortableContextContainer
} from './cards'
import {useCardDragHandlers} from './cards-drag-handlers'
import {useCardsStore} from './cards-store'

export const Cards = observer(() => {
  const [teamState] = useTeamStore()
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

  if (state.cards.error) {
    return <div className="text-error">{state.cards.error.message}</div>
  }

  if (state.cards.loading || teamState.currentTeam.loading) {
    return <CardsSkeleton />
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
