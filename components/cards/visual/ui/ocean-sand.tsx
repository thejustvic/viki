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

  const geometry = useMemo(createSlopedBottom, [])

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
  SEGMENTS: 256, // number of squares in the grid
  TOTAL_RADIUS: 500,
  MAX_DEPTH: -10,
  SURFACE_Z: 0,
  START_Y: 100,
  END_Y: 200
}

const createSlopedBottom = () => {
  const {SEGMENTS, TOTAL_RADIUS, MAX_DEPTH, SURFACE_Z, START_Y, END_Y} =
    TERRAIN_CONFIG

  const size = TOTAL_RADIUS * 2
  const geo = new PlaneGeometry(size, size, SEGMENTS, SEGMENTS)

  const attr = geo.getAttribute('position')
  const pos = attr.array as Float32Array

  for (let i = 0; i < pos.length; i += 3) {
    const x = pos[i]
    const y = pos[i + 1]
    const distance = Math.sqrt(x * x + y * y)

    if (distance <= START_Y) {
      pos[i + 2] = SURFACE_Z
    } else if (distance <= END_Y) {
      const t = (distance - START_Y) / (END_Y - START_Y)
      const smoothT = t * t * (3 - 2 * t)
      pos[i + 2] = SURFACE_Z + smoothT * (MAX_DEPTH - SURFACE_Z)
    } else if (distance <= TOTAL_RADIUS) {
      pos[i + 2] = MAX_DEPTH
    } else {
      pos[i + 2] = MAX_DEPTH
    }
  }

  attr.needsUpdate = true
  geo.computeVertexNormals()
  geo.computeBoundingSphere()
  return geo
}
