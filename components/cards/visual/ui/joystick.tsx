/* eslint-disable max-lines-per-function */
import React, {useCallback, useEffect, useRef, useState} from 'react'

export interface Vector2 {
  x: number
  y: number
}

interface JoystickProps {
  label: string
  onUpdate: (v: Vector2) => void
  radius: number
}

const Joystick: React.FC<JoystickProps> = ({label, onUpdate, radius}) => {
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

        if (label === 'LOOK') {
          // look around Up/Down (Y) and Left/Right (X)
          onUpdate({
            x: dx / radius, // change 'dx' to '-dx' here to reverse Left/Right
            y: dy / radius // change 'dy' to '-dy' here to reverse Up/Down
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
          window.removeEventListener('touchmove', handleMove)
          window.removeEventListener('touchend', handleEnd)
        }
      }

      window.addEventListener('touchmove', handleMove)
      window.addEventListener('touchend', handleEnd)
    },
    [onUpdate, radius]
  )

  return (
    <div
      onTouchStart={handleStart}
      style={{
        width: `${radius * 2}px`,
        height: `${radius * 2}px`,
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.1)',
        border: '2px solid rgba(255, 255, 255, 0.2)',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        touchAction: 'none'
      }}
    >
      <div
        style={{
          width: `${radius * 0.6}px`,
          height: `${radius * 0.6}px`,
          borderRadius: '50%',
          background: 'white',
          position: 'absolute',
          transform: `translate(${stickPos.x}px, ${stickPos.y}px)`,
          pointerEvents: 'none',
          transition: stickPos.x === 0 ? 'transform 0.1s ease-out' : 'none'
        }}
      />
      <span
        style={{
          color: 'white',
          opacity: 0.3,
          fontSize: '10px',
          pointerEvents: 'none',
          userSelect: 'none'
        }}
      >
        {label}
      </span>
    </div>
  )
}

export const DualJoysticks: React.FC<{
  onMove: (v: Vector2) => void
  onLook: (v: Vector2) => void
}> = ({onMove, onLook}) => {
  const [radius, setRadius] = useState(120)

  useEffect(() => {
    const updateSize = () => {
      const calculatedRadius = Math.min(
        Math.max(window.innerWidth * 0.2, 60),
        120
      )
      setRadius(calculatedRadius)
    }

    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '40px',
        width: '100%',
        display: 'flex',
        justifyContent: 'space-around',
        zIndex: 1000,
        pointerEvents: 'none',
        userSelect: 'none'
      }}
    >
      <div style={{pointerEvents: 'auto'}}>
        <Joystick label="MOVE" onUpdate={onMove} radius={radius} />
      </div>
      <div style={{pointerEvents: 'auto'}}>
        <Joystick label="LOOK" onUpdate={onLook} radius={radius} />
      </div>
    </div>
  )
}
