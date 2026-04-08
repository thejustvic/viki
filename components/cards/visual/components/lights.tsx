import {Environment, Sky} from '@react-three/drei'
import {useFrame, useThree} from '@react-three/fiber'
import {RapierRigidBody} from '@react-three/rapier'
import {RefObject, useMemo, useRef} from 'react'
import {Color, DirectionalLight, Vector3} from 'three'

type SunPosition = [number, number, number]
interface LightingProps {
  playerRef: RefObject<RapierRigidBody | null>
}
export const Lighting = ({playerRef}: LightingProps) => {
  const sunsetPos: SunPosition = [5, 10, 5]

  return (
    <>
      <Sky sunPosition={sunsetPos} turbidity={0.1} />
      <DynamicSun sunPosition={sunsetPos} playerRef={playerRef} />
      <ambientLight intensity={2} />
      <Environment preset="sunset" />
    </>
  )
}

interface Props {
  sunPosition: SunPosition
  playerRef: RefObject<RapierRigidBody | null>
}
const DynamicSun = ({sunPosition, playerRef}: Props) => {
  const lightRef = useRef<DirectionalLight>(null)
  const {camera} = useThree()

  const sunsetColor = useMemo(() => new Color('#ffccaa'), [])
  const underwaterColor = useMemo(() => new Color('#004466'), [])
  const sunOffset = useMemo(() => new Vector3(...sunPosition), [sunPosition])

  useFrame(() => {
    if (!lightRef.current || !playerRef.current) {
      return
    }

    const pPos = playerRef.current.translation()
    // Player Tracking
    // set the light to always shine on the player at a given angle
    lightRef.current.position.set(
      pPos.x + sunOffset.x,
      pPos.y + sunOffset.y,
      pPos.z + sunOffset.z
    )
    // direct to the player
    lightRef.current.target.position.set(pPos.x, pPos.y, pPos.z)
    lightRef.current.target.updateMatrixWorld()

    // smooth change in color and intensity depending on the camera
    const isUnderwater = camera.position.y < 0
    const targetColor = isUnderwater ? underwaterColor : sunsetColor
    lightRef.current.color.lerp(targetColor, 0.05)
    lightRef.current.intensity = isUnderwater ? 2.5 : 3.5
  })

  return (
    <directionalLight
      ref={lightRef}
      castShadow
      shadow-mapSize={[2048, 2048]}
      // shadow area (focus around the player)
      shadow-camera-left={-25}
      shadow-camera-right={25}
      shadow-camera-top={25}
      shadow-camera-bottom={-25}
      shadow-camera-near={0.1}
      shadow-camera-far={150}
      shadow-bias={-0.001} // removes artifacts on the sand
    />
  )
}
