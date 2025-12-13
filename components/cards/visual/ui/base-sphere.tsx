import {Sphere} from '@react-three/drei'
import {useEffect, useMemo} from 'react'
import {CanvasTexture, RepeatWrapping} from 'three'
import {createTextTexture} from '../utils/create-text-texture'

interface BaseBoxProps {
  position: [number, number, number]
  radius?: number
  sphereColor?: string
  textColor?: string
  text: string
  textOffsetX: number
}

export const BaseSphere = ({
  text,
  textOffsetX,
  position,
  radius = 0.2,
  sphereColor = '#ff0000',
  textColor = '#ffffff'
}: BaseBoxProps) => {
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

  return (
    <Sphere args={[radius, 64, 64]} position={position}>
      <meshStandardMaterial
        map={texture} // The texture now contains the background color and text color
        metalness={0.5}
        roughness={0.5}
        // color property MUST be absent if using a textured map for the main color
      />
    </Sphere>
  )
}
