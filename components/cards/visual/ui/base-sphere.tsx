import {useCheckboxHandlers} from '@/components/checklist/checkbox/checkbox-handlers'
import {Checkbox} from '@/components/checklist/types'
import {Sphere} from '@react-three/drei'
import {useFrame} from '@react-three/fiber'
import {easing} from 'maath'
import {useEffect, useMemo, useRef} from 'react'
import {CanvasTexture, Group, RepeatWrapping} from 'three'
import {createTextTexture} from '../utils/create-text-texture'

interface BaseBoxProps {
  shouldShrink: boolean
  position: [number, number, number]
  radius: number
  sphereColor: string
  textColor: string
  text: string
  textOffsetX: number
  checkbox?: Checkbox
}

export const BaseSphere = ({
  shouldShrink,
  text,
  textOffsetX,
  position,
  radius,
  sphereColor = '#ff0000',
  textColor = '#ffffff',
  checkbox
}: BaseBoxProps) => {
  const groupRef = useRef<Group>(null)

  useFrame((_state, delta) => {
    if (groupRef.current === null) {
      return
    }
    const targetScale = shouldShrink ? 0 : 1
    easing.damp3(
      groupRef.current.scale,
      [targetScale, targetScale, targetScale],
      0.25,
      delta
    )
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
    <group ref={groupRef} position={position} scale={[0, 0, 0]}>
      <Sphere
        args={[radius, 64, 64]}
        position={[0, 0, 0]}
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
