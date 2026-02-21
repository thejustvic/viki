import {useCardChecklistStore} from '@/components/cards/card-checklist/card-checklist-store'
import {getSearchCard} from '@/components/cards/get-search-card'
import {CheckboxComponent} from '@/components/checklist/checkbox/checkbox'
import {Checkbox} from '@/components/checklist/types'
import {Loader} from '@/components/common/loader'
import {SimpleScrollbar} from '@/components/common/simple-scrollbar'
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
  restrictToParentElement,
  restrictToVerticalAxis
} from '@dnd-kit/modifiers'
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
  if (!store.getAllCheckboxes(id)) {
    return (
      <TwState>
        <div className="text-info">type some stuff</div>
      </TwState>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100dvh-180px)]">
      <SimpleScrollbar>
        <DndContext
          modifiers={[
            restrictToVerticalAxis,
            restrictToParentElement,
            restrictToFirstScrollableAncestor
          ]}
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContextContainer />
          <DragOverlayContainer />
        </DndContext>
        <CheckboxesCompleted />
      </SimpleScrollbar>
    </div>
  )
})

const SortableContextContainer = observer(() => {
  const [, store] = useCardChecklistStore()
  const id = String(getSearchCard())
  const items = store.getCheckboxesNotCompleted(id)

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

const CheckboxesCompleted = observer(() => {
  const [, store] = useCardChecklistStore()
  const id = String(getSearchCard())
  const items = store.getCheckboxesCompleted(id)

  return items?.map(checkbox => (
    <CheckboxComponent
      key={checkbox.id}
      id={checkbox.id}
      checked={checkbox.is_completed}
      title={checkbox.title}
    />
  ))
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
        <div className="bg-info/10">
          <CheckboxComponent
            id={state.draggingCheckbox.id}
            checked={state.draggingCheckbox.is_completed}
            title={state.draggingCheckbox.title}
          />
        </div>
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
