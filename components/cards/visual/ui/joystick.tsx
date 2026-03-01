/* eslint-disable max-lines-per-function */
import React, {useCallback, useState} from 'react'

export interface Vector2 {
  x: number
  y: number
}

interface JoystickProps {
  label: string
  onUpdate: (v: Vector2) => void
}

const RADIUS = 60

const Joystick: React.FC<JoystickProps> = ({label, onUpdate}) => {
  const [stickPos, setStickPos] = useState<Vector2>({x: 0, y: 0})

  const handleStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const handleMove = (moveEvent: TouchEvent) => {
        const touch = moveEvent.touches[0]
        let dx = touch.clientX - centerX
        let dy = touch.clientY - centerY

        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance > RADIUS) {
          dx *= RADIUS / distance
          dy *= RADIUS / distance
        }

        setStickPos({x: dx, y: dy})

        if (label === 'LOOK') {
          // look around Up/Down (Y) and Left/Right (X)
          onUpdate({
            x: dx / RADIUS, // change 'dx' to '-dx' here to reverse Left/Right
            y: dy / RADIUS // change 'dy' to '-dy' here to reverse Up/Down
          })
        } else {
          // move around Forward/Backward (Y) and Left/Right (X)
          onUpdate({
            x: -dx / RADIUS, //  change '-dx' to 'dx' here to reverse Left/Right
            y: -dy / RADIUS // change '-dy' to 'dy' here to reverse Forward/Backward
          })
        }
      }

      const handleEnd = () => {
        setStickPos({x: 0, y: 0})
        onUpdate({x: 0, y: 0})
        window.removeEventListener('touchmove', handleMove)
        window.removeEventListener('touchend', handleEnd)
      }

      window.addEventListener('touchmove', handleMove)
      window.addEventListener('touchend', handleEnd)
    },
    [onUpdate]
  )

  return (
    <div
      onTouchStart={handleStart}
      style={{
        width: `${RADIUS * 2}px`,
        height: `${RADIUS * 2}px`,
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.1)',
        border: '2px solid rgba(255, 255, 255, 0.2)',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        touchAction: 'none',
        userSelect: 'none'
      }}
    >
      <div
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: 'white',
          position: 'absolute',
          transform: `translate(${stickPos.x}px, ${stickPos.y}px)`,
          pointerEvents: 'none',
          transition: stickPos.x === 0 ? 'transform 0.1s ease-out' : 'none',
          userSelect: 'none'
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
}> = ({onMove, onLook}) => (
  <div
    style={{
      position: 'absolute',
      bottom: '50px',
      width: '100%',
      display: 'flex',
      justifyContent: 'space-around',
      zIndex: 1000,
      pointerEvents: 'none',
      userSelect: 'none'
    }}
  >
    <div style={{pointerEvents: 'auto', userSelect: 'none'}}>
      <Joystick label="MOVE" onUpdate={onMove} />
    </div>
    <div style={{pointerEvents: 'auto', userSelect: 'none'}}>
      <Joystick label="LOOK" onUpdate={onLook} />
    </div>
  </div>
)
