import {useCardChecklistStore} from '@/components/cards/card-checklist/card-checklist-store'
import {getSearchCard} from '@/components/cards/get-search-card'
import {CheckboxComponent} from '@/components/checklist/checkbox/checkbox'
import {Checkbox} from '@/components/checklist/types'
import {Loader} from '@/components/common/loader'
import {PerfectScrollbar} from '@/components/common/perfect-scrollbar'
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
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import {CSS} from '@dnd-kit/utilities'
import {observer} from 'mobx-react-lite'
import tw from 'tailwind-styled-components'
import {useGlobalStore} from '../global-provider/global-store'
import {useCheckboxDragHandlers} from './checkbox/checkbox-drag-handlers'

export const Checklist = () => {
  return <Checkboxes />
}

const TwState = tw.div`
  flex
  justify-center
  items-center
  h-[calc(100dvh-123px)]
`

const Checkboxes = observer(() => {
  const id = String(getSearchCard())
  const [state, store] = useCardChecklistStore()

  const {handleDragStart, handleDragEnd} = useCheckboxDragHandlers()

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

  if (state.checklists.error) {
    return <TwState>{state.checklists.error.message}</TwState>
  }
  if (state.checklists.loading) {
    return (
      <TwState>
        <Loader />
      </TwState>
    )
  }
  if (!store.getCheckboxes(id)) {
    return (
      <TwState>
        <div className="text-info">type some stuff</div>
      </TwState>
    )
  }

  return (
    <PerfectScrollbar>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-col h-[calc(100dvh-180px)]">
          <SortableContextContainer />
          <DragOverlayContainer />
        </div>
      </DndContext>
    </PerfectScrollbar>
  )
})

const SortableContextContainer = observer(() => {
  const [, store] = useCardChecklistStore()
  const id = String(getSearchCard())
  const items = store.getCheckboxes(id)

  return (
    <SortableContext items={items || []} strategy={verticalListSortingStrategy}>
      {items?.map(checkbox => (
        <SortableContainer
          key={checkbox.id}
          id={checkbox.id}
          checkbox={checkbox}
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
          styles: {active: {opacity: '0.8'}}
        })
      }}
    >
      {state.draggingCheckbox ? (
        <CheckboxComponent
          id={state.draggingCheckbox.id}
          checked={state.draggingCheckbox.is_completed}
          title={state.draggingCheckbox.title}
        />
      ) : null}
    </DragOverlay>
  )
})

const SortableContainer = ({
  id,
  checkbox
}: {
  id: string
  checkbox: Checkbox
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
      <CheckboxComponent
        key={checkbox.id}
        id={checkbox.id}
        checked={checkbox.is_completed}
        title={checkbox.title}
        dragListeners={listeners}
        dragAttributes={attributes}
      />
    </div>
  )
}
