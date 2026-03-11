import React, {useEffect, useState} from 'react'
import Tilt from 'react-parallax-tilt'
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
  const {handleStart, stickPos, manualTiltAngle} = useJoystickHandlers({
    label,
    onUpdate,
    radius
  })

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
      <Tilt
        perspective={600}
        className="transform-3d h-full w-full grid place-items-center"
        tiltAngleXManual={manualTiltAngle.y}
        tiltAngleYManual={manualTiltAngle.x}
      >
        <div
          style={{
            width: `${radius * 1.6}px`,
            height: `${radius * 1.6}px`,
            borderRadius: '50%',
            position: 'absolute',
            transform: `translate(${stickPos.x}px, ${stickPos.y}px)`,
            pointerEvents: 'none',
            transition: stickPos.x === 0 ? 'transform 0.1s ease-out' : 'none',

            /* smooth gradient: lighter edge, darker transition, slightly lighter center */
            background:
              'radial-gradient(circle, #2a2a2a 0%, #151515 80%, #353535 90%, #1a1a1a 100%)',
            boxShadow: `
                        /* outer shadow (separation from the surface)*/
                        0px 12px 20px rgba(0,0,0,0.6),
                        /* highlight at the very top of the rounding (outer edge) */
                        inset 0px 8px 12px rgba(255,255,255,0.15),
                        /* deep "bowl" shadow (transition inward) */
                        inset 0px 0px 25px 5px rgba(0,0,0,0.8),
                        /* lower contour highlight for volume */
                        inset 0px -4px 10px rgba(255,255,255,0.3)
                      `
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
      </Tilt>
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
