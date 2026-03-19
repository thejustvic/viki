import {RefObject, useEffect, useRef} from 'react'

interface ReturnProps {
  containerRef: RefObject<HTMLDivElement | null>
}
export const useScrollNear = (condition: boolean): ReturnProps => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (condition) {
      containerRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      })
    }
  }, [condition])

  return {containerRef}
}
