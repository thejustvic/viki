/* eslint-disable max-lines-per-function */
import React, {CSSProperties, useEffect, useState} from 'react'
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
const JoystickOuterStyles: CSSProperties = {
  zIndex: 9,
  touchAction: 'none',
  borderRadius: '50%',
  position: 'absolute',
  background: `
    radial-gradient(circle at 50% 50%, 
      transparent 50%,        /* deep empty middle */
      #141414 52%,            /* sharp inner shadow (cliff) */
      #2a2a2a 55%,            /* internal slope */
      #555555 60%,            /* comb (the brightest point that catches the light) */
      #2e2d2d 85%,            /* external gentle slope */
      #1a1a1a 100%            /* base */
    )
  `
}

const JoystickStyles: CSSProperties = {
  borderRadius: '50%',
  background: 'rgba(0, 0, 0, 0.2)',
  boxShadow: '0px 0px 23px 0px rgba(0,0,0,0.5) inset',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  touchAction: 'none'
}

const ThumbGripStyles: CSSProperties = {
  borderRadius: '50%',
  position: 'absolute',
  pointerEvents: 'none',
  /* smooth gradient: lighter edge, darker transition, slightly lighter center */
  background:
    'radial-gradient(circle, #4a4a4a 0%, #151515 80%, #353535 90%, #2a2a2a 100%)',
  zIndex: 10,
  overflow: 'visible',
  transformStyle: 'preserve-3d'
}

const topColor = `#0057B7`
const bottomColor = `#FFDD00`

const BallJointStyles: CSSProperties = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: `translate(-50%, -50%) translateZ(20px)`,
  borderRadius: '50%',
  // 3D ball effect through gradient
  background: `
                /* light reflection (gives gloss) */
                radial-gradient(circle at 50% 10%, rgba(255, 255, 255, 0.25) 0%, transparent 50%),
                
                /* downward glow */
                radial-gradient(circle at 50% 0%, ${topColor} 0%, transparent 70%),
                
                /* upward glow */
                radial-gradient(circle at 50% 100%, ${bottomColor} 0%, transparent 70%),
                
                /* dark liner for volume */
                radial-gradient(circle at 50% 50%, #222 0%, #050505 100%)
              `,
  zIndex: -1, // located under ThumbGripStyles
  pointerEvents: 'none'
}

const Joystick: React.FC<JoystickProps> = ({label, onUpdate, radius}) => {
  const {handleStart, stickPos, manualTiltAngle} = useJoystickHandlers({
    label,
    onUpdate,
    radius
  })

  return (
    <>
      <div
        onTouchStart={handleStart}
        style={{
          ...JoystickOuterStyles,
          width: `${radius * 2}px`,
          height: `${radius * 2}px`,
          opacity: Math.sqrt(stickPos.x ** 2 + stickPos.y ** 2) > 2 ? 0.9 : 0,
          transition: 'opacity 0.5s ease'
        }}
      />
      <div
        onTouchStart={handleStart}
        style={{
          ...JoystickStyles,
          width: `${radius * 2}px`,
          height: `${radius * 2}px`
        }}
      >
        {/* container for ball with cutting (mask) */}
        <div className="transform-3d absolute w-full h-full rounded-full overflow-hidden pointer-events-none z-1">
          <Tilt
            perspective={600}
            tiltAngleXManual={manualTiltAngle.y}
            tiltAngleYManual={manualTiltAngle.x}
            className="transform-3d h-full w-full"
          >
            {/* a moving sphere bounded by a circle of the base */}
            <div
              style={{
                ...BallJointStyles,
                width: `${radius * 2.6}px`, // a little more so that there are no holes when tilted
                height: `${radius * 2.6}px`,
                opacity:
                  Math.sqrt(stickPos.x ** 2 + stickPos.y ** 2) > 2 ? 0.9 : 0.4,
                transition: 'opacity 0.5s ease'
              }}
            />
          </Tilt>
        </div>
        <Tilt
          perspective={600}
          className="transform-3d absolute z-10 pointer-events-none h-full w-full grid place-items-center"
          tiltAngleXManual={manualTiltAngle.y}
          tiltAngleYManual={manualTiltAngle.x}
        >
          <div
            style={{
              ...ThumbGripStyles,
              width: `${radius * 1.6}px`,
              height: `${radius * 1.6}px`,
              transform: `translate(${stickPos.x}px, ${stickPos.y}px)`,
              transition: stickPos.x === 0 ? 'transform 0.1s ease-out' : 'none',
              boxShadow: `
                          /* outer shadow (separation from the surface) */
                          ${-stickPos.x * 0.2}px ${-stickPos.y * 0.2}px 15px rgba(0,0,0,0.7),
                          /* highlight at the very top of the rounding (outer edge) */
                          inset 0px 8px 12px rgba(255,255,255,0.15),
                          /* deep "bowl" shadow (transition inward) */
                          inset 0px 0px 15px 5px rgba(0,0,0,0.8),
                          /* lower contour highlight for volume */
                          inset 0px -4px 5px rgba(255,255,255,0.3)
                        `
            }}
          >
            <span className="grid place-items-center h-full text-white opacity-30 text-xs pointer-events-none select-none">
              {label}
            </span>
          </div>
        </Tilt>
      </div>
    </>
  )
}

export const DualJoysticks: React.FC<{
  onMove: (v: Vector2) => void
  onLook: (v: Vector2) => void
}> = ({onMove, onLook}) => {
  const [radius, setRadius] = useState(60)

  useEffect(() => {
    const updateSize = () => {
      const calculatedRadius = Math.min(
        Math.max(window.innerWidth * 0.2, 30),
        60
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
