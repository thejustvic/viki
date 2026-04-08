import React, {useCallback, useRef, useState} from 'react'

export interface Vector2 {
  x: number
  y: number
}

interface Handlers {
  stickPos: Vector2
  handleStart: (e: React.TouchEvent<HTMLDivElement>) => void
  manualTiltAngle: Vector2
}

const SENSITIVITY = 0.5 // 1.0 — standard, 0.5 — half as slow

interface JoystickProps {
  label: string
  onUpdate: (v: Vector2) => void
  radius: number
}

export const useJoystickHandlers = ({
  label,
  onUpdate,
  radius
}: JoystickProps): Handlers => {
  const [manualTiltAngle, setManualTiltAngle] = useState<Vector2>({x: 0, y: 0})
  const [stickPos, setStickPos] = useState<Vector2>({x: 0, y: 0})
  const activeTouchId = useRef<number | null>(null)
  const handleStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      const touch = e.changedTouches[0]
      activeTouchId.current = touch.identifier
      const rect = e.currentTarget.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const handleMove = (moveEvent: TouchEvent) => {
        const touch = Array.from(moveEvent.touches).find(
          t => t.identifier === activeTouchId.current
        )
        if (!touch) {
          return
        }
        let dx = touch.clientX - centerX
        let dy = touch.clientY - centerY
        const distance = Math.sqrt(dx * dx + dy * dy)
        if (distance > radius) {
          dx *= radius / distance
          dy *= radius / distance
        }
        setStickPos({x: dx, y: dy})
        setManualTiltAngle({x: dx * 0.5, y: -dy * 0.5})
        if (label === 'LOOK') {
          // look around Up/Down (Y) and Left/Right (X)
          onUpdate({
            x: (dx / radius) * SENSITIVITY, // change 'dx' to '-dx' here to reverse Left/Right
            y: (dy / radius) * SENSITIVITY // change 'dy' to '-dy' here to reverse Up/Down
          })
        } else {
          // move around Forward/Backward (Y) and Left/Right (X)
          onUpdate({
            x: -dx / radius, //  change '-dx' to 'dx' here to reverse Left/Right
            y: -dy / radius // change '-dy' to 'dy' here to reverse Forward/Backward
          })
        }
      }
      const handleEnd = (endEvent: TouchEvent) => {
        const touch = Array.from(endEvent.changedTouches).find(
          t => t.identifier === activeTouchId.current
        )
        if (touch) {
          activeTouchId.current = null
          setStickPos({x: 0, y: 0})
          onUpdate({x: 0, y: 0})
          setManualTiltAngle({x: 0, y: 0})
          window.removeEventListener('touchmove', handleMove)
          window.removeEventListener('touchend', handleEnd)
        }
      }
      window.addEventListener('touchmove', handleMove)
      window.addEventListener('touchend', handleEnd)
    },
    [onUpdate, radius]
  )
  return {
    handleStart,
    stickPos,
    manualTiltAngle
  }
}
