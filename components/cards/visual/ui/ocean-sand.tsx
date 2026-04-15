import {useFrame, useLoader} from '@react-three/fiber'
import {RigidBody} from '@react-three/rapier'
import {useMemo, useRef} from 'react'
import {
  Color,
  IUniform,
  MeshStandardMaterial,
  PlaneGeometry,
  RepeatWrapping,
  Texture,
  TextureLoader,
  Vector2
} from 'three'
import CustomShaderMaterial from 'three-custom-shader-material'
import {EXRLoader} from 'three-stdlib'
import {oceanSandFragmentShader} from './shaders/ocean-sand-fragment-shader'
import {oceanSandVertexShader} from './shaders/ocean-sand-vertex-shader'

interface OceanSandUniforms {
  uTime: IUniform<number>
  uCausticsTex: IUniform<Texture | null>
  uWaterColor: IUniform<Color>
  uDeepColor: IUniform<Color>
  [key: string]: IUniform
}

export const OceanSand = () => {
  const materialRef = useRef(null)
  const [sandDiff, sandRough, sandDisp] = useLoader(TextureLoader, [
    '/textures/sand_diff.jpg',
    '/textures/sand_rough.jpg',
    '/textures/sand_disp.png'
  ])
  const sandNormal = useLoader(EXRLoader, '/textures/sand_nor.exr')
  const causticsTexture = useLoader(TextureLoader, '/textures/caustic.jpg')

  const geometry = useMemo(() => createSlopedBottom(1000, 1000), [])

  const textures = [sandDiff, sandRough, sandDisp, sandNormal, causticsTexture]

  useMemo(() => {
    textures.forEach(t => {
      t.wrapS = t.wrapT = RepeatWrapping
      t.repeat.set(100, 100)
    })
  }, [textures])

  const uniforms = useMemo<OceanSandUniforms>(
    () => ({
      uTime: {value: 0},
      uCausticsTex: {value: causticsTexture},
      uWaterColor: {value: new Color('#004466')},
      uDeepColor: {value: new Color('#001122')}
    }),
    [causticsTexture]
  )

  useFrame(state => {
    uniforms.uTime.value = state.clock.getElapsedTime()
  })

  return (
    <RigidBody type="fixed" colliders="trimesh">
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <primitive object={geometry} attach="geometry" />
        <CustomShaderMaterial
          ref={materialRef}
          baseMaterial={MeshStandardMaterial}
          uniforms={uniforms}
          vertexShader={oceanSandVertexShader}
          fragmentShader={oceanSandFragmentShader}
          // MeshStandardMaterial props
          map={sandDiff}
          roughnessMap={sandRough}
          normalMap={sandNormal}
          normalScale={new Vector2(1, 1)} // microrelief strength control
          displacementMap={sandDisp}
          displacementScale={0.2} // height of sand mounds (e.g. 20cm)
        />
      </mesh>
    </RigidBody>
  )
}
const TERRAIN_CONFIG = {
  SEGMENTS: 128,
  START_Y: -100,
  END_Y: 0,
  MAX_DEPTH: -10
}

const createSlopedBottom = (width: number, height: number) => {
  const {SEGMENTS, START_Y, END_Y, MAX_DEPTH} = TERRAIN_CONFIG

  const geo = new PlaneGeometry(width, height, SEGMENTS, SEGMENTS)
  const pos = geo.attributes.position.array as Float32Array

  for (let i = 0; i < pos.length; i += 3) {
    const yCoord = pos[i + 1]

    // Розрахунок фактора змішування (t) в діапазоні [0, 1]
    let t = (yCoord - START_Y) / (END_Y - START_Y)
    t = Math.max(0, Math.min(1, t))

    // Плавна інтерполяція (Smoothstep)
    const smoothT = t * t * (3 - 2 * t)

    // Встановлення глибини по осі Z
    pos[i + 2] = smoothT * MAX_DEPTH
  }

  geo.computeVertexNormals()
  return geo
}
