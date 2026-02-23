import {generateKeyBetween} from 'fractional-indexing'
import {useCardHandlers} from './cards-handlers'
import {useCardsStore} from './cards-store'
import {Card as CardType} from './types'

import {DragEndEvent, DragStartEvent} from '@dnd-kit/core'
import {arrayMove} from '@dnd-kit/sortable'
import {useGlobalStore} from '../global-provider/global-store'

interface Handlers {
  handleDragStart: (event: DragStartEvent) => void
  handleDragEnd: (event: DragEndEvent) => Promise<void>
}

export const useCardDragHandlers = (): Handlers => {
  const [, globalStore] = useGlobalStore()
  const [state, store] = useCardsStore()
  const {updateCardPosition} = useCardHandlers()

  const handleDragStart = (event: DragStartEvent): void => {
    const {active} = event
    const idCard = String(active.id)
    const card = store.searchedCards().find(c => c.id === idCard)
    globalStore.updateDraggingCard(card)
  }

  const handleDragEnd = async (event: DragEndEvent): Promise<void> => {
    globalStore.updateDraggingCard(undefined)
    try {
      const cards = state.cards.data
      const position = getPosition(cards, event)
      if (!position || !cards) {
        return
      }
      const {prevPos, nextPos, oldIndex, newIndex} = position

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
      await updateCardPosition(newPosition, String(event.active.id))
    } catch (err) {
      console.error('error key generation:', err)
    }
  }

  return {
    handleDragStart,
    handleDragEnd
  }
}

const getPosition = (cards: CardType[] | null, event: DragEndEvent) => {
  const {active, over} = event
  if (!cards || !active || !over) {
    return null
  }
  if (active.id === over.id) {
    return null
  }
  const oldIndex = cards.findIndex(c => c.id === active.id)
  const newIndex = cards.findIndex(c => c.id === over.id)

  let prevPos, nextPos

  if (newIndex < oldIndex) {
    // UPWARDS: move BEFORE the 'over' element
    prevPos = cards[newIndex - 1]?.position ?? null
    nextPos = cards[newIndex]?.position ?? null
  } else {
    // Move DOWN: go AFTER the 'over' element
    prevPos = cards[newIndex]?.position ?? null
    nextPos = cards[newIndex + 1]?.position ?? null
  }

  if (prevPos === nextPos && prevPos !== null) {
    console.error('Error: prevPos and nextPos are identical', prevPos)

    return null
  }

  return {prevPos, nextPos, oldIndex, newIndex}
}
