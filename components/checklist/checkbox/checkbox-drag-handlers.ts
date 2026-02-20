import {useCardChecklistStore} from '@/components/cards/card-checklist/card-checklist-store'
import {getSearchCard} from '@/components/cards/get-search-card'
import {Checkbox} from '@/components/checklist/types'
import {useGlobalStore} from '@/components/global-provider/global-store'
import {DragEndEvent, DragStartEvent} from '@dnd-kit/core'
import {arrayMove} from '@dnd-kit/sortable'
import {generateKeyBetween} from 'fractional-indexing'
import {useCheckboxHandlers} from './checkbox-handlers'

interface Handlers {
  handleDragStart: (event: DragStartEvent) => void

  handleDragEnd: (event: DragEndEvent) => Promise<void>
}

export const useCheckboxDragHandlers = (): Handlers => {
  const id = String(getSearchCard())
  const [, globalStore] = useGlobalStore()
  const [state, store] = useCardChecklistStore()
  const {updateCheckboxPosition} = useCheckboxHandlers()

  const handleDragStart = (event: DragStartEvent): void => {
    const {active} = event
    const idCheckbox = String(active.id)
    const checklist = store.getCheckboxesCompleted(id) || []
    const checkbox = checklist.find(c => c.id === idCheckbox)
    globalStore.updateDraggingCheckbox(checkbox)
  }

  const handleDragEnd = async (event: DragEndEvent): Promise<void> => {
    try {
      const checklist = store.getCheckboxesCompleted(id)
      const position = getPosition(checklist, event)
      if (!position || !checklist) {
        return
      }
      const {prevPos, nextPos, oldIndex, newIndex} = position

      const newPosition = generateKeyBetween(prevPos, nextPos)
      const reordered = arrayMove(checklist, oldIndex, newIndex)
      const finalData = reordered.map((checkbox, idx) =>
        idx === newIndex ? {...checkbox, position: newPosition} : checkbox
      )
      const checklistMap = state.checklists.data
      // create a new Map instance for reactivity
      const updatedMap = new Map(checklistMap)
      const notCompleted = store.getCheckboxesNotCompleted(id) || []
      updatedMap.set(id, [...finalData, ...notCompleted])

      store.setChecklists({
        ...state.checklists,
        data: updatedMap
      })
      await updateCheckboxPosition(newPosition, String(event.active.id))
    } catch (err) {
      console.error('error key generation:', err)
    }
  }

  return {
    handleDragStart,
    handleDragEnd
  }
}

const getPosition = (
  checkboxes: Checkbox[] | undefined,
  event: DragEndEvent
) => {
  const {active, over} = event
  if (!checkboxes || !active || !over) {
    return null
  }
  console.table(
    checkboxes.map(c => {
      return {
        pos: c.position,
        text: c.title
      }
    })
  )

  if (active.id === over.id) {
    return null
  }
  const oldIndex = checkboxes.findIndex(c => c.id === active.id)
  const newIndex = checkboxes.findIndex(c => c.id === over.id)

  let prevPos, nextPos

  if (newIndex < oldIndex) {
    // UPWARDS: move BEFORE the 'over' element
    prevPos = checkboxes[newIndex - 1]?.position || null
    nextPos = checkboxes[newIndex]?.position || null
  } else {
    // Move DOWN: go AFTER the 'over' element
    prevPos = checkboxes[newIndex]?.position || null
    nextPos = checkboxes[newIndex + 1]?.position || null
  }

  if (prevPos === nextPos && prevPos !== null) {
    console.error('Error: prevPos and nextPos are identical', prevPos)

    return null
  }

  return {prevPos, nextPos, oldIndex, newIndex}
}
