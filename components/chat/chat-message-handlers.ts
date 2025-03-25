import {BooleanHookState, useBoolean} from '@/hooks/use-boolean'
import {ObjUtil} from '@/utils/obj-util'
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
}

export const useChatMessageHandlers = (message: Message): Handlers => {
  const clickTimeout = useRef<NodeJS.Timeout | null>(null)
  const lastTap = useRef<number>(0)
  const showReactions = useBoolean(false)
  const showChoice = useBoolean(false)

  const {selectReaction} = useReactionsHandlers()

  const handleClick = (): void => {
    if (!ObjUtil.isEmpty(message.reactions)) {
      return
    }
    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current)
    }
    clickTimeout.current = setTimeout(() => {
      showChoice.turnOn()
    }, 250)
  }

  const handleDoubleClick = (): void => {
    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current)
    }
    void handlePutHeart() // Double Tap Detected!
  }

  const handleTouchStart = (): void => {
    const now = Date.now()
    const timeSinceLastTap = now - lastTap.current
    if (timeSinceLastTap < 250) {
      handleDoubleClick()
    } else {
      handleClick()
    }
    lastTap.current = now
  }

  const handlePutHeart = (): Promise<void> =>
    Promise.resolve(putHeart(message)).catch(console.error)

  const handleMouseEnter = (): void => {
    showReactions.turnOn()
  }

  const handleMouseLeave = (): void => {
    showChoice.turnOff()
    showReactions.turnOff()
  }

  const putHeart: Handlers['putHeart'] = async () => {
    await selectReaction('❤️', message)
  }

  return {
    putHeart,
    handleMouseEnter,
    handleMouseLeave,
    handleTouchStart,
    handlePutHeart,
    showReactions,
    showChoice
  }
}
