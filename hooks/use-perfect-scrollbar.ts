import {MutableRefObject, useCallback, useEffect, useRef} from 'react'

import PerfectScrollbar from 'perfect-scrollbar'

export const usePerfectScrollbar = <T extends HTMLElement>(
  options?: PerfectScrollbar.Options
): [MutableRefObject<T>, PerfectScrollbar] => {
  const containerRef = useRef<T>()
  const perfectScrollbar = useRef<PerfectScrollbar>()

  const psUpdate = useCallback(() => {
    if (typeof perfectScrollbar.current?.update === 'function') {
      perfectScrollbar.current.update()
    }
  }, [perfectScrollbar])

  useEffect(() => {
    if (containerRef.current) {
      perfectScrollbar.current = new PerfectScrollbar(
        containerRef.current,
        options
      )
      window.addEventListener('resize', psUpdate)
    }

    return () => {
      if (typeof perfectScrollbar.current?.destroy === 'function') {
        perfectScrollbar.current.destroy()
      }

      perfectScrollbar.current = undefined
      window.removeEventListener('resize', psUpdate)
    }
  }, [])

  return [
    containerRef as MutableRefObject<T>,
    perfectScrollbar.current as PerfectScrollbar
  ]
}
