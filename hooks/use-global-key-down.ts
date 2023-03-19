import {useEffect} from 'react'

interface KeyboardHandlers {
  enter?: () => void
  escape?: () => void
  anyKey?: (opts: {
    key: string
    keyCode: number
    shift: boolean
    alt: boolean
    ctrl: boolean
  }) => void
}

const keyboardHandler =
  (handlers: KeyboardHandlers) =>
  (e: {
    key: string
    keyCode: number
    shiftKey: boolean
    altKey: boolean
    ctrlKey: boolean
  }) => {
    if (handlers.anyKey) {
      handlers.anyKey({
        key: e.key,
        keyCode: e.keyCode,
        shift: e.shiftKey,
        alt: e.altKey,
        ctrl: e.ctrlKey
      })
    }
    if (handlers.enter && e.key === 'Enter') {
      handlers.enter()
    } else if (handlers.escape && e.key === 'Escape') {
      handlers.escape()
    }
  }

export const useGlobalKeyDown = (handlers: KeyboardHandlers): void => {
  useEffect(() => {
    const fn = keyboardHandler(handlers)
    document.addEventListener('keydown', fn)
    return () => {
      document.removeEventListener('keydown', fn)
    }
  }, [])
}
