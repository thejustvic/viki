import {useEffect, useState} from 'react'

export type MovementState = {
  forward: boolean
  backward: boolean
  left: boolean
  right: boolean
  jump: boolean
  shift: boolean
  leftClick: boolean
}

export const usePlayerControls = (): MovementState => {
  const keys: Record<string, keyof MovementState> = {
    KeyW: 'forward',
    KeyS: 'backward',
    KeyA: 'left',
    KeyD: 'right',
    ShiftLeft: 'shift',
    Space: 'jump'
  }

  const moveFieldByKey = (key: string): keyof MovementState | undefined =>
    keys[key]

  const [movement, setMovement] = useState<MovementState>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
    shift: false,
    leftClick: false
  })

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      const field = moveFieldByKey(e.code)
      if (field) {
        setMovement(m => ({...m, [field]: true}))
      }
    }

    const handleKeyUp = (e: KeyboardEvent): void => {
      const field = moveFieldByKey(e.code)
      if (field) {
        setMovement(m => ({...m, [field]: false}))
      }
    }

    const handleMouseDown = (e: MouseEvent): void => {
      if (e.button === 0) {
        // 0 — this is the left button
        setMovement(m => ({...m, leftClick: true}))
      }
    }

    const handleMouseUp = (e: MouseEvent): void => {
      if (e.button === 0) {
        setMovement(m => ({...m, leftClick: false}))
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  return movement
}
