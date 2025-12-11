import {Sphere} from '@react-three/drei'
import {useMemo} from 'react'
import {CanvasTexture} from 'three'
import {createTextTexture} from '../utils/create-text-texture'

interface BaseBoxProps {
  position: [number, number, number]
  radius?: number
  sphereColor?: string
  textColor?: string
  text: string
}

export const BaseSphere = ({
  text,
  position,
  radius = 0.2,
  sphereColor = '#ff0000',
  textColor = '#ffffff'
}: BaseBoxProps) => {
  const texture: CanvasTexture = useMemo(() => {
    return createTextTexture(text, textColor, sphereColor)
  }, [text, textColor, sphereColor])

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
