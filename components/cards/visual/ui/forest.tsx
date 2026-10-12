import {useLoader} from '@react-three/fiber'
import {RigidBody} from '@react-three/rapier'
import {useMemo, useRef} from 'react'
import {
  MeshStandardMaterial,
  RepeatWrapping,
  TextureLoader,
  Vector2
} from 'three'
import CustomShaderMaterial from 'three-custom-shader-material'
import {TreeLindenModel} from '../components/tree-linden-model'

export const Forest = () => {
  const materialRef = useRef(null)
  const [groundAO, groundDiff, groundDisp, sandNormal, groundRough] = useLoader(
    TextureLoader,
    [
      '/textures/ground/ground_ao.jpg',
      '/textures/ground/ground_color.jpg',
      '/textures/ground/ground_disp.jpg',
      '/textures/ground/ground_normalGL.jpg',
      '/textures/ground/ground_rough.jpg'
    ]
  )

  const textures = [groundDiff, groundRough, groundDisp, sandNormal]

  useMemo(() => {
    groundDiff.colorSpace = 'srgb'
    textures.forEach(t => {
      t.wrapS = t.wrapT = RepeatWrapping
      t.repeat.set(256, 256)
    })
  }, [textures])

  return (
    <RigidBody type="fixed" colliders="trimesh">
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        {/* [radius, circle segments, ring segments for relief] */}
        <circleGeometry args={[500, 128, 128]} />
        <CustomShaderMaterial
          metalness={0} // removes any metallic sheen
          ref={materialRef}
          baseMaterial={MeshStandardMaterial}
          // MeshStandardMaterial props
          map={groundDiff}
          roughnessMap={groundRough}
          roughness={0} // makes the ground full matte
          normalMap={sandNormal}
          normalScale={new Vector2(1, 1)} // microrelief strength control
          displacementMap={groundDisp}
          displacementScale={0.2} // height of ground mounds (e.g. 20cm)
          aoMap={groundAO}
          aoMapIntensity={2.5} // enhances dark areas
          color="#e8f8fc"
        />
      </mesh>

      <group position={[0, 0, 100]}>
        <TreeLindenModel />
      </group>
    </RigidBody>
  )
}
