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

export const Snowland = () => {
  const materialRef = useRef(null)
  const [snowAO, snowDiff, snowDisp, sandNormal, snowRough] = useLoader(
    TextureLoader,
    [
      '/textures/snow_ao.jpg',
      '/textures/snow_diff.jpg',
      '/textures/snow_disp.jpg',
      '/textures/snow_nor.jpg',
      '/textures/snow_rough.jpg'
    ]
  )

  const textures = [snowDiff, snowRough, snowDisp, sandNormal]

  useMemo(() => {
    snowDiff.colorSpace = 'srgb'
    textures.forEach(t => {
      t.wrapS = t.wrapT = RepeatWrapping
      t.repeat.set(50, 50)
    })
  }, [textures])

  return (
    <RigidBody type="fixed" colliders="trimesh">
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        {/* [radius, circle segments, ring segments for relief] */}
        <circleGeometry args={[500, 128, 64]} />
        <CustomShaderMaterial
          metalness={0} // removes any metallic sheen
          ref={materialRef}
          baseMaterial={MeshStandardMaterial}
          // MeshStandardMaterial props
          map={snowDiff}
          roughnessMap={snowRough}
          roughness={1} // makes the snow full matte
          normalMap={sandNormal}
          normalScale={new Vector2(1, 1)} // microrelief strength control
          displacementMap={snowDisp}
          displacementScale={0.1} // height of snow mounds (e.g. 20cm)
          aoMap={snowAO}
          aoMapIntensity={1.5} // enhances dark areas
          color="#e8f8fc"
        />
      </mesh>
    </RigidBody>
  )
}
