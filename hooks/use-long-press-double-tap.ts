import {useRef, useState} from 'react'

type Callback = () => void

interface Handlers {
  onMouseDown: () => void
  onMouseUp: () => void
  onMouseEnter: () => void
  onMouseLeave: () => void
  onTouchStart: () => void
  onTouchEnd: () => void
  onTouchMove: () => void
}

export const useLongPressDoubleTap = (
  callbacks: {
    onLongPress: Callback
    onDoubleTap: Callback
    onMouseEnterCallback?: Callback
    onMouseLeaveCallback?: Callback
  },

  delays?: {
    longPressDelay?: number
    doubleTapDelay?: number
  }
): {isLongPressed: boolean; eventHandlers: Handlers} => {
  const {onLongPress, onDoubleTap, onMouseLeaveCallback, onMouseEnterCallback} =
    callbacks
  const longPressDelay = delays?.longPressDelay ?? 500
  const doubleTapDelay = delays?.doubleTapDelay ?? 300
  const [isLongPressed, setIsLongPressed] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const lastTapRef = useRef<number | null>(null)

  const startPress = (): void => {
    timerRef.current = setTimeout(() => {
      setIsLongPressed(true)
      onLongPress()
    }, longPressDelay)
  }

  const cancelPress = (): void => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    setIsLongPressed(false)
  }

  const handleTap = (): void => {
    const now = Date.now()
    if (lastTapRef.current && now - lastTapRef.current < doubleTapDelay) {
      onDoubleTap()
      lastTapRef.current = null
    } else {
      lastTapRef.current = now
    }
  }

  return {
    isLongPressed,
    eventHandlers: {
      onMouseDown: startPress,
      onMouseUp: () => {
        cancelPress()
        handleTap()
      },
      onMouseEnter: () => {
        onMouseEnterCallback?.()
      },
      onMouseLeave: () => {
        cancelPress()
        onMouseLeaveCallback?.()
      },
      onTouchStart: startPress,
      onTouchEnd: () => {
        cancelPress()
        handleTap()
      },
      onTouchMove: cancelPress
    }
  }
}
