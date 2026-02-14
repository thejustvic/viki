import {useEffect, useRef} from 'react'

interface KeyboardHandlers {
  enter?: () => void
  escape?: () => void
  anyKey?: (opts: {
    key: string
    shift: boolean
    alt: boolean
    ctrl: boolean
  }) => void
}

const modalStack: string[] = []

export const useGlobalKeyDown = ({
  handlers,
  id,
  active
}: {
  handlers: KeyboardHandlers
  id: string
  active: boolean
}): void => {
  const handlersRef = useRef(handlers)

  useEffect(() => {
    handlersRef.current = handlers
  }, [handlers])

  useEffect(() => {
    if (!active) {
      return
    }
    modalStack.push(id)

    const handleKeyDown = (e: KeyboardEvent) => {
      const isTopModal = modalStack[modalStack.length - 1] === id
      const {anyKey, enter, escape} = handlersRef.current

      if (e.key === 'Escape') {
        if (isTopModal && escape) {
          e.preventDefault()
          escape()
        }
      } else if (e.key === 'Enter') {
        if (isTopModal && enter) {
          enter()
        }
      }

      if (isTopModal && anyKey) {
        anyKey({
          key: e.key,
          shift: e.shiftKey,
          alt: e.altKey,
          ctrl: e.ctrlKey
        })
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      const index = modalStack.indexOf(id)
      if (index > -1) {
        modalStack.splice(index, 1)
      }

      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [id, active])
}
