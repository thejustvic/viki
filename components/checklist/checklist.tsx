import {useCardChecklistStore} from '@/components/cards/card-checklist/card-checklist-store'
import {getSearchCard} from '@/components/cards/get-search-card'
import {CheckboxComponent} from '@/components/checklist/checkbox/checkbox'
import {Checkbox} from '@/components/checklist/types'
import {Loader} from '@/components/common/loader'
import {SimpleScrollbar} from '@/components/common/simple-scrollbar'
import tw from '@/components/common/tw-styled-components'
import {useBoolean} from '@/hooks/use-boolean'
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

const TwCheckboxes = tw.div`
  flex
  flex-col
  h-[calc(100dvh-180px)]
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
    <TwCheckboxes>
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
    </TwCheckboxes>
  )
})

const SortableContextContainer = observer(() => {
  const [, store] = useCardChecklistStore()
  const id = String(getSearchCard())
  const items = store.getCheckboxesNotCompleted(id) ?? []

  return (
    <SortableContext items={items} strategy={verticalListSortingStrategy}>
      <div className="pb-1">
        {items.map(checkbox => (
          <SortableContainer key={checkbox.id} checkbox={checkbox} />
        ))}
      </div>
    </SortableContext>
  )
})

const TwCheckboxesCompleted = tw.div`
  collapse
  collapse-arrow
  bg-base-100
  focus:outline-none
  rounded-b-none
`

const TwCollapseTitle = tw.div`
  collapse-title
  text-base-content/50
  font-semibold
  px-12
`

const CheckboxesCompleted = observer(() => {
  const [, store] = useCardChecklistStore()
  const show = useBoolean(false)
  const id = String(getSearchCard())
  const items = store.getCheckboxesCompleted(id) ?? []

  if (items.length === 0) {
    return
  }

  return (
    <TwCheckboxesCompleted>
      <input
        className="cursor-pointer"
        type="radio"
        name="my-accordion-completed-checkboxes"
        onChange={() => {}}
        onClick={show.toggle}
        checked={show.value}
      />
      <TwCollapseTitle>checked items</TwCollapseTitle>
      <div className="collapse-content p-0">
        <div className="pb-1">
          {items.map(checkbox => (
            <CheckboxComponent key={checkbox.id} checkbox={checkbox} />
          ))}
        </div>
      </div>
    </TwCheckboxesCompleted>
  )
})

const TwDraggingCheckbox = tw.div`
  bg-info/10
  cursor-grabbing
`

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
        <TwDraggingCheckbox>
          <CheckboxComponent checkbox={state.draggingCheckbox} />
        </TwDraggingCheckbox>
      ) : null}
    </DragOverlay>
  )
})

const SortableContainer = ({checkbox}: {checkbox: Checkbox}) => {
  const {attributes, listeners, setNodeRef, transform, transition, isDragging} =
    useSortable({id: checkbox.id})

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1
  }

  return (
    <div ref={setNodeRef} style={style}>
      <CheckboxComponent
        checkbox={checkbox}
        dragListeners={listeners}
        dragAttributes={attributes}
      />
    </div>
  )
}
