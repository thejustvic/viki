import {useCheckboxHandlers} from '@/components/checklist/checkbox/checkbox-handlers'
import {Checkbox} from '@/components/checklist/types'
import {Sphere} from '@react-three/drei'
import {useFrame} from '@react-three/fiber'
import {useEffect, useMemo, useRef} from 'react'
import * as THREE from 'three'
import {CanvasTexture, RepeatWrapping} from 'three'
import {createTextTexture} from '../utils/create-text-texture'

import {easing} from 'maath'

interface BaseBoxProps {
  position: [number, number, number]
  radius?: number
  sphereColor: string
  textColor: string
  text: string
  textOffsetX: number
  checkbox?: Checkbox
  visible: boolean
  onUnmounted: () => void
}

export const BaseSphere = ({
  visible,
  onUnmounted,
  text,
  textOffsetX,
  position,
  radius = 0.2,
  sphereColor = '#ff0000',
  textColor = '#ffffff',
  checkbox
}: BaseBoxProps) => {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((_state, delta) => {
    if (groupRef.current === null) {
      return
    }
    // 1. Calculate target (1 if entering, 0 if shrinking to unmount)
    const target = visible ? 1 : 0
    // 2. Animate scale smoothly
    // 0.2 is the smoothTime (in seconds). Increase it for a slower shrink.
    easing.damp3(groupRef.current.scale, [target, target, target], 0.2, delta)
    // 3. The Unmount Trigger
    // Only unmount if we are meant to be hidden AND shrink is finished
    if (!visible && groupRef.current.scale.x < 0.1) {
      groupRef.current.scale.set(0, 0, 0) // Clean reset
      onUnmounted() // SIGNAL THE PARENT TO FINALLY DELETE
    }
  })

  const texture: CanvasTexture = useMemo(() => {
    return createTextTexture({
      text,
      color: textColor,
      bgColor: sphereColor
    })
  }, [text, textColor, sphereColor])

  useEffect(() => {
    texture.wrapS = RepeatWrapping
    texture.offset.x = textOffsetX
    texture.needsUpdate = true
  }, [texture, textOffsetX])

  const {updateCheckboxIsCompleted} = useCheckboxHandlers()

  return (
    <group ref={groupRef} scale={[0, 0, 0]}>
      <Sphere
        args={[radius, 64, 64]}
        position={position}
        onClick={event => {
          // prevent click from bleeding through to objects behind
          event.stopPropagation()
          if (checkbox) {
            updateCheckboxIsCompleted(!checkbox.is_completed, checkbox.id)
          }
        }}
      >
        <meshStandardMaterial
          map={texture} // The texture now contains the background color and text color
          metalness={0.5}
          roughness={0.5}
          // color property MUST be absent if using a textured map for the main color
        />
      </Sphere>
    </group>
  )
}
