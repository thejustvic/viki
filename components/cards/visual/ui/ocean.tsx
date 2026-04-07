import {useFrame, useLoader} from '@react-three/fiber'
import {RigidBody} from '@react-three/rapier'
import {useMemo, useRef} from 'react'
import {
  MeshStandardMaterial,
  PlaneGeometry,
  RepeatWrapping,
  TextureLoader,
  Vector2
} from 'three'
import CustomShaderMaterial from 'three-custom-shader-material'
import {EXRLoader} from 'three-stdlib'
import {oceanFragmentShader} from './shaders/ocean-fragment-shader'
import {oceanVertexShader} from './shaders/ocean-vertex-shader'

const OceanWater = () => {
  const materialRef = useRef(null)

  // textures of normals for the shine of water
  const waterNormals = useLoader(TextureLoader, '/textures/waternormals.jpg')
  waterNormals.wrapS = waterNormals.wrapT = RepeatWrapping
  waterNormals.repeat.set(8, 2)

  // creating Uniforms to pass time to the shader
  const uniforms = useMemo(
    () => ({
      uTime: {value: 0},
      uTexture: {value: waterNormals}
    }),
    [waterNormals]
  )

  useFrame(state => {
    uniforms.uTime.value = state.clock.getElapsedTime()
  })

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.15, -55]}>
      {/* 128x128 segments for smooth 3D waves */}
      <planeGeometry args={[100, 100, 128, 128]} />

      <CustomShaderMaterial
        ref={materialRef}
        baseMaterial={MeshStandardMaterial}
        vertexShader={oceanVertexShader}
        fragmentShader={oceanFragmentShader}
        uniforms={uniforms}
        // standard water props
        color="#004466"
        roughness={0.1}
        metalness={0.8}
        transparent
        opacity={0.9}
        normalMap={waterNormals}
      />
    </mesh>
  )
}

const OceanSand = () => {
  const [sandDiff, sandRough, sandDisp] = useLoader(TextureLoader, [
    '/textures/sand_diff.jpg',
    '/textures/sand_rough.jpg',
    '/textures/sand_disp.png'
  ])
  const sandNormal = useLoader(EXRLoader, '/textures/sand_nor.exr')

  const slantedGeometry = useMemo(() => {
    // 128x128 segments — this is important for terrain
    const geo = new PlaneGeometry(100, 200, 128, 128)
    const pos = geo.attributes.position.array

    for (let i = 0; i < pos.length; i += 3) {
      const yCoord = pos[i + 1]

      // determine the mixing factor (from 0 to 1) between points 20 and 50
      // t will be 0 at 20, and 1 at 50
      let t = (yCoord - 20) / (50 - 20)

      // limit t to the range [0, 1]
      t = Math.max(0, Math.min(1, t))

      // make the transition smooth (S-shaped curve)
      // this will remove sharp corners at the entrance and exit.
      const smoothT = t * t * (3 - 2 * t)

      // calculate the final depth
      // interpolate between 0 (shore) and -5 (depth)
      pos[i + 2] = smoothT * -5
    }

    geo.computeVertexNormals()
    return geo
  }, [])

  const textures = [sandDiff, sandRough, sandDisp, sandNormal]

  textures.forEach(t => {
    t.wrapS = t.wrapT = RepeatWrapping
    t.repeat.set(10, 20) // proportional to planeGeometry with [100, 200]
  })

  return (
    <RigidBody type="fixed" colliders="hull">
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        castShadow
        receiveShadow
      >
        <primitive object={slantedGeometry} attach="geometry" />
        <meshStandardMaterial
          map={sandDiff}
          roughnessMap={sandRough}
          roughness={1} // base value (matte)
          displacementMap={sandDisp}
          displacementScale={0.2} // height of sand mounds (e.g. 20cm)
          normalMap={sandNormal}
          normalScale={new Vector2(1, 1)} // microrelief strength control
        />
      </mesh>
    </RigidBody>
  )
}

export const Ocean = () => {
  return (
    <>
      <OceanWater />
      <OceanSand />
    </>
  )
}
