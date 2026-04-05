import {useFrame, useLoader} from '@react-three/fiber'
import {useMemo} from 'react'
import {PlaneGeometry, RepeatWrapping, TextureLoader, Vector2} from 'three'
import {EXRLoader, Water} from 'three-stdlib'

const OceanWater = () => {
  const waterNormals = useLoader(TextureLoader, '/textures/waternormals.jpg')

  waterNormals.wrapS = waterNormals.wrapT = RepeatWrapping
  waterNormals.repeat.set(8, 2)

  const water = useMemo(() => {
    const geometry = new PlaneGeometry(100, 100)
    return new Water(geometry, {
      waterNormals,
      distortionScale: 5.0
    })
  }, [waterNormals])

  useFrame((_state, delta) => {
    water.material.uniforms['time'].value += delta * 0.5
  })

  return (
    <primitive
      object={water}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, 0, -50]}
    />
  )
}

const OceanSand = () => {
  const [sandDiff, sandRough, sandDisp] = useLoader(TextureLoader, [
    '/textures/sand_diff.jpg',
    '/textures/sand_rough.jpg',
    '/textures/sand_disp.png'
  ])
  const sandNormal = useLoader(EXRLoader, '/textures/sand_nor.exr')

  const textures = [sandDiff, sandRough, sandDisp, sandNormal]

  textures.forEach(t => {
    t.wrapS = t.wrapT = RepeatWrapping
    t.repeat.set(10, 10) // proportional to planeGeometry with [100, 100]
  })

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 40]}>
      {/* 128x128 segments — this is important for terrain */}
      <planeGeometry args={[100, 100, 128, 128]} />
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
