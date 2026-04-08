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

  const geometry = useMemo(() => createSlopedBottom(100, 200), [])

  const textures = [sandDiff, sandRough, sandDisp, sandNormal, causticsTexture]

  useMemo(() => {
    textures.forEach(t => {
      t.wrapS = t.wrapT = RepeatWrapping
      t.repeat.set(10, 20)
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
          metalness={0} // removes any metallic sheen
          ref={materialRef}
          baseMaterial={MeshStandardMaterial}
          uniforms={uniforms}
          vertexShader={oceanSandVertexShader}
          fragmentShader={oceanSandFragmentShader}
          // MeshStandardMaterial props
          map={sandDiff}
          roughnessMap={sandRough}
          roughness={1} // makes the sand completely matte
          normalMap={sandNormal}
          normalScale={new Vector2(1, 1)} // microrelief strength control
          displacementMap={sandDisp}
          displacementScale={0.2} // height of sand mounds (e.g. 20cm)
        />
      </mesh>
    </RigidBody>
  )
}

const createSlopedBottom = (width: number, height: number) => {
  // 128x128 segments — this is important for terrain
  const geo = new PlaneGeometry(width, height, 128, 128)
  const pos = geo.attributes.position.array as Float32Array

  for (let i = 0; i < pos.length; i += 3) {
    const yCoord = pos[i + 1]

    // determine the mixing factor (from 0 to 1) between points 20 and 70
    // t will be 0 at 20, and 1 at 70
    let t = (yCoord - 20) / (70 - 20)

    // limit t to the range [0, 1]
    t = Math.max(0, Math.min(1, t))

    // make the transition smooth (S-shaped curve)
    // this will remove sharp corners at the entrance and exit.
    const smoothT = t * t * (3 - 2 * t)

    // calculate the final depth
    // interpolate between 0 (shore) and -10 (depth)
    pos[i + 2] = smoothT * -10
  }
  geo.computeVertexNormals()
  return geo
}
