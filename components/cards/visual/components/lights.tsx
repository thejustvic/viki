import {useGlobalStore} from '@/components/global-provider/global-store'
import {Sphere} from '@react-three/drei'
import {useFrame, useThree} from '@react-three/fiber'
import {RapierRigidBody} from '@react-three/rapier'
import {observer} from 'mobx-react-lite'
import {RefObject, useMemo, useRef} from 'react'
import {BackSide, Color, DirectionalLight, MathUtils, Vector3} from 'three'
import {CardVisualType} from '../../types'

interface GradientSkyProps {
  sunPosition: SunPosition
}
const GradientSky = ({sunPosition}: GradientSkyProps) => {
  const sunOffset = useMemo(() => new Vector3(...sunPosition), [sunPosition])

  return (
    <Sphere args={[1000, 128, 128]}>
      <shaderMaterial
        side={BackSide}
        fog={false} // sky shouldn't cloud over on its own.
        depthWrite={false} // THIS IS CRITICAL: the sky should not write to the depth buffer
        uniforms={{
          uSunPosition: {value: sunOffset.clone().normalize()}, // transmit the direction to the sun
          uBottomColor: {value: new Color('#daefff')},
          uTopColor: {value: new Color('#A6D8FE')}
        }}
        vertexShader={`
          varying vec3 vWorldPosition;
          varying vec3 vViewDirection;
          void main() {
            vec4 worldPosition = modelMatrix * vec4(position, 1.0);
            vWorldPosition = worldPosition.xyz;
            vViewDirection = normalize(worldPosition.xyz);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          varying vec3 vViewDirection;
          uniform vec3 uSunPosition;
          uniform vec3 uBottomColor;
          uniform vec3 uTopColor;

          void main() {
            float h = vViewDirection.y;

            // creating a sky gradient
            vec3 skyColor = mix(uBottomColor, uTopColor, max(h, 0.0));

            // draw the sun
            // calculate the distance from the current point in the sky to the position of the sun
            float sunDistance = distance(vViewDirection, uSunPosition);

            // creating a soft disk of the sun
            float sunDisc = smoothstep(0.05, 0.04, sunDistance);

            // creating a glow around the sun
            float sunGlow = smoothstep(0.4, 0.0, sunDistance) * 0.3;

            // add the sun (white color) to the sky color
            vec3 finalColor = skyColor + (sunDisc + sunGlow);

            gl_FragColor = vec4(finalColor, 1.0);
          }
        `}
      />
    </Sphere>
  )
}

type SunPosition = [number, number, number]
interface LightingProps {
  playerRef: RefObject<RapierRigidBody | null>
}
export const Lighting = ({playerRef}: LightingProps) => {
  const sunPosition: SunPosition = [15, 10, 15] // 16:00 for big shadows
  return (
    <>
      <GradientSky sunPosition={sunPosition} />
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

  const ambientIntensity = useMemo(
    () => getAmbientIntensity(selectedVisualMode),
    [selectedVisualMode]
  )

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

    const targetIntensity = isUnderwater ? 0 : 3.5

    // smooth change: (current value, target value, speed)
    lightRef.current.intensity = MathUtils.lerp(
      lightRef.current.intensity,
      targetIntensity,
      0.05 // the lower the number, the slower the light fades
    )
  })

  return (
    <>
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
      {/* cold backlighting of shadows from the sky */}
      <ambientLight intensity={ambientIntensity} color="#d0e0ff" />
    </>
  )
})

const getAmbientIntensity = (
  visual: CardVisualType[number] | undefined
): number => {
  const lightIntensitySummer = 4.0
  const lightIntensitySpring = 3.5
  const lightIntensityWinter = 3.0

  switch (visual) {
    case 'winter': {
      return lightIntensityWinter
    }
    case 'spring': {
      return lightIntensitySpring
    }
    case 'summer': {
      return lightIntensitySummer
    }
    default: {
      return lightIntensityWinter
    }
  }
}
