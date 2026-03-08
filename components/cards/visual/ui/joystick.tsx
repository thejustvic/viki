import React, {useEffect, useState} from 'react'
import {useJoystickHandlers} from './joystick-handlers'

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
  const {handleStart, stickPos} = useJoystickHandlers({label, onUpdate, radius})

  return (
    <div
      onTouchStart={handleStart}
      style={{
        width: `${radius * 2}px`,
        height: `${radius * 2}px`,
        borderRadius: '50%',
        background: 'rgba(0, 0, 0, 0.2)',
        border: '2px solid rgba(0, 0, 0, 0.1)',
        boxShadow: '0px 0px 23px 0px rgba(0,0,0,0.5) inset',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        touchAction: 'none'
      }}
    >
      <div
        style={{
          width: `${radius * 1.2}px`,
          height: `${radius * 1.2}px`,
          borderRadius: '50%',
          boxShadow: '0px 0px 23px 0px rgba(0,0,0,0.5) inset',
          background: 'grey',
          opacity: 0.95,
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
        bottom: '120px',
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
