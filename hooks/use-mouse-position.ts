import {useEffect, useState} from 'react'

interface MousePositionState {
  x: number | null
  y: number | null
}

export const useMousePosition = (): MousePositionState => {
  const [mousePosition, setMousePosition] = useState<MousePositionState>({
    x: null,
    y: null
  })
  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent): void => {
      setMousePosition({x: ev.clientX, y: ev.clientY})
    }
    window.addEventListener('mousemove', updateMousePosition)
    return () => {
      window.removeEventListener('mousemove', updateMousePosition)
    }
  }, [])

  return mousePosition
}
