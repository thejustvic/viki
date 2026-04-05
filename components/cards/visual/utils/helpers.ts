/* eslint-disable max-lines-per-function */
import {useEffect, useRef, useState} from 'react'

const clickTimer = 850

export type MovementState = {
  forward: boolean
  backward: boolean
  left: boolean
  right: boolean
  jump: boolean
  shift: boolean
  sitDown: boolean
  leftClick: boolean
}
interface PlayerControlsProps {
  is3DSceneLocked: boolean
  withClickTimer?: boolean
}
export const usePlayerControls = ({
  is3DSceneLocked,
  withClickTimer = false
}: PlayerControlsProps): MovementState => {
  const keys: Record<string, keyof MovementState> = {
    KeyW: 'forward',
    KeyS: 'backward',
    KeyA: 'left',
    KeyD: 'right',
    ShiftLeft: 'shift',
    KeyC: 'sitDown',
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
    sitDown: false,
    leftClick: false
  })

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (is3DSceneLocked) {
        return
      }
      const field = moveFieldByKey(e.code)
      if (!field) {
        return
      }

      if (e.code === 'Space') {
        e.preventDefault()
      }

      if (e.code === 'KeyC') {
        setMovement(m => {
          const isSitting = !m.sitDown // тew state for sitting
          return {
            ...m,
            sitDown: isSitting,
            // if sit down, turn off shift. if stand up, leave it as is
            shift: isSitting ? false : m.shift
          }
        })
      } else if (e.code === 'ShiftLeft') {
        setMovement(m => ({
          ...m,
          // allow shift to be enabled only if the character is not sitting
          shift: !m.sitDown
        }))
      } else {
        setMovement(m => ({...m, [field]: true}))
      }
    }

    const handleKeyUp = (e: KeyboardEvent): void => {
      if (is3DSceneLocked) {
        return
      }
      const field = moveFieldByKey(e.code)
      // ignore KeyC so that the sitDown state is not reset
      if (field && e.code !== 'KeyC') {
        setMovement(m => ({...m, [field]: false}))
      }
    }

    const handleMouseDown = (e: MouseEvent): void => {
      if (is3DSceneLocked) {
        return
      }
      // if the user clicks again before the clickTimer milliseconds are up, cancel the old timer
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      if (e.button === 0) {
        // 0 — this is the left button
        setMovement(m => ({...m, leftClick: true}))
      }
    }

    const handleMouseUp = (e: MouseEvent): void => {
      if (is3DSceneLocked) {
        return
      }
      if (e.button === 0) {
        if (withClickTimer) {
          // instead of instant false, start a timer for clickTimer milliseconds
          timeoutRef.current = setTimeout(() => {
            setMovement(m => ({...m, leftClick: false}))
          }, clickTimer)
        } else {
          setMovement(m => ({...m, leftClick: false}))
        }
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
  }, [is3DSceneLocked])

  return movement
}

export const pluralize = (
  count: number,
  noun: string,
  suffix = 's'
): string => {
  return `${count} ${noun}${count !== 1 ? suffix : ''}`
}
