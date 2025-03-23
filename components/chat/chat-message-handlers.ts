import {BooleanHookState, useBoolean} from '@/hooks/use-boolean'
import {useRef} from 'react'
import {useReactionsHandlers} from './reactions/use-reactions-handlers'
import {Message} from './types'

interface Handlers {
  putHeart: (message: Message) => Promise<void>
  showReactions: BooleanHookState
  showChoice: BooleanHookState
  handlePutHeart: () => Promise<void>
  handleMouseEnter: () => void
  handleMouseLeave: () => void
  handleTouchStart: () => void
  handleTouchEnd: () => void
}

export const useChatMessageHandlers = (message: Message): Handlers => {
  const showReactions = useBoolean(false)
  const showChoice = useBoolean(false)
  const lastTapRef = useRef<number>(0) // Use ref to avoid state updates
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const {selectReaction} = useReactionsHandlers()

  const putHeart: Handlers['putHeart'] = async () => {
    await selectReaction('❤️', message)
  }

  const handleLongTap = (): void => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    timerRef.current = setTimeout(() => {
      showChoice.turnOn()
    }, 500)
  }

  const handleDoubleTap = (): void => {
    const now = Date.now()
    if (now - lastTapRef.current < 300) {
      void handlePutHeart() // Double Tap Detected!
    }
    lastTapRef.current = now
  }

  const handlePutHeart = (): Promise<void> =>
    Promise.resolve(putHeart(message)).catch(console.error)

  const handleMouseEnter = (): void => {
    showReactions.turnOn()
  }

  const handleMouseLeave = (): void => {
    showChoice.turnOff()
    showReactions.turnOff()
    cancelLongPress()
  }

  const handleTouchStart = (): void => {
    handleLongTap()
    handleDoubleTap()
  }

  const handleTouchEnd = (): void => {
    cancelLongPress()
  }

  const cancelLongPress = (): void => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
  }

  return {
    putHeart,
    handleMouseEnter,
    handleMouseLeave,
    handleTouchStart,
    handleTouchEnd,
    handlePutHeart,
    showReactions,
    showChoice
  }
}
