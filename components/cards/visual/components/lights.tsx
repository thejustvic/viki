import {useGlobalStore} from '@/components/global-provider/global-store'
import {Sky} from '@react-three/drei'
import {useFrame, useThree} from '@react-three/fiber'
import {RapierRigidBody} from '@react-three/rapier'
import {observer} from 'mobx-react-lite'
import {RefObject, useMemo, useRef} from 'react'
import {Color, DirectionalLight, Vector3} from 'three'
import {CardVisualType} from '../../types'

type SunPosition = [number, number, number]
interface LightingProps {
  playerRef: RefObject<RapierRigidBody | null>
}
export const Lighting = ({playerRef}: LightingProps) => {
  const sunPosition: SunPosition = [15, 10, 15] // 16:00 for big shadows

  return (
    <>
      <Sky
        sunPosition={sunPosition}
        turbidity={0.5} // a little more "chirp" in the air
        rayleigh={0.2} // a richer blue sky
        mieCoefficient={0.005}
        mieDirectionalG={0.7}
      />
      <DynamicSun sunPosition={sunPosition} playerRef={playerRef} />
    </>
  )
}

interface Props {
  sunPosition: SunPosition
  playerRef: RefObject<RapierRigidBody | null>
}
const DynamicSun = observer(({sunPosition, playerRef}: Props) => {
  const [{selectedVisualMode}] = useGlobalStore()
  const lightRef = useRef<DirectionalLight>(null)
  const {camera} = useThree()

  const aboveWaterLevelColor = useMemo(() => new Color('#fff4e0'), [])
  const belowWaterLevelColor = useMemo(() => new Color('#004466'), [])
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
    const targetColor = isUnderwater
      ? belowWaterLevelColor
      : aboveWaterLevelColor
    lightRef.current.color.lerp(targetColor, 0.05)
    lightRef.current.intensity = isUnderwater ? 0 : 3.5
  })

  return (
    <>
      <directionalLight
        ref={lightRef}
        castShadow
        intensity={3.5}
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
      {/* cold backlighting of shadows from the sky */}
      <ambientLight
        intensity={getAmbient(selectedVisualMode)}
        color="#d0e0ff"
      />
    </>
  )
})

const getAmbient = (visual: CardVisualType[number] | undefined): number => {
  const ambientLightIntensitySummer = 4.0
  const ambientLightIntensitySpring = 3.5
  const ambientLightIntensityWinter = 3.0

  switch (visual) {
    case 'winter': {
      return ambientLightIntensityWinter
    }
    case 'spring': {
      return ambientLightIntensitySpring
    }
    case 'summer': {
      return ambientLightIntensitySummer
    }
    default: {
      return ambientLightIntensityWinter
    }
  }
}
