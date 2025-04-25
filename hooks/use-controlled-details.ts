import {RefObject, useCallback, useEffect, useRef, useState} from 'react'

interface ControlledDetailsReturn {
  ref: RefObject<HTMLDetailsElement | null>
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

export const useControlledDetails = (
  initialOpen = false
): ControlledDetailsReturn => {
  const ref = useRef<HTMLDetailsElement | null>(null)
  const [isOpen, setIsOpen] = useState(initialOpen)

  // Set DOM state when isOpen changes
  useEffect(() => {
    if (ref.current) {
      ref.current.open = isOpen
    }
  }, [isOpen])

  // Sync isOpen if user toggles <summary>
  useEffect(() => {
    const el = ref.current
    if (!el) {
      return
    }

    const handleToggle = (): void => {
      setIsOpen(el.open)
    }

    el.addEventListener('toggle', handleToggle)
    return () => {
      el.removeEventListener('toggle', handleToggle)
    }
  }, [])

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        isOpen &&
        ref.current &&
        !ref.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen(prev => !prev), [])

  return {ref, isOpen, open, close, toggle}
}
