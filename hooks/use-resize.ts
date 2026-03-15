import {RefObject, useLayoutEffect, useRef, useState} from 'react'

interface ResizeResult {
  ref: RefObject<HTMLDivElement | null>
  width: number
  height: number
}

export const useResize = (): ResizeResult => {
  const [size, setSize] = useState({width: 0, height: 0})
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const element = ref.current
    if (!element) {
      return
    }

    // set the initial size immediately after mounting
    const initialRect = element.getBoundingClientRect()
    setSize({
      width: Math.round(initialRect.width),
      height: Math.round(initialRect.height)
    })

    const observer = new ResizeObserver((entries: ResizeObserverEntry[]) => {
      if (!entries.length) {
        return
      }

      const entry = entries[0]

      // Use borderBoxSize for full width or contentRect as a fallback
      const newWidth = Math.round(
        entry.borderBoxSize?.[0]?.inlineSize ?? entry.contentRect.width
      )
      const newHeight = Math.round(
        entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height
      )

      setSize(prev => {
        if (prev.width === newWidth && prev.height === newHeight) {
          return prev
        }
        return {width: newWidth, height: newHeight}
      })
    })

    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return {ref, ...size}
}
