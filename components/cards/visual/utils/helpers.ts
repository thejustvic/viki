import {useEffect, useState} from 'react'

type MovementState = {
  forward: boolean
  backward: boolean
  left: boolean
  right: boolean
  jump: boolean
}

export const usePlayerControls = (): MovementState => {
  const keys: Record<string, keyof MovementState> = {
    KeyW: 'forward',
    KeyS: 'backward',
    KeyA: 'left',
    KeyD: 'right',
    Space: 'jump'
  }

  const moveFieldByKey = (key: string): keyof MovementState | undefined =>
    keys[key]

  const [movement, setMovement] = useState<MovementState>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false
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

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  return movement
}
