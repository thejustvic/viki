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

export const Forest = () => {
  const materialRef = useRef(null)
  const [
    scatteredLeavesAO,
    scatteredLeavesDiff,
    scatteredLeavesDisp,
    sandNormal,
    scatteredLeavesRough
  ] = useLoader(TextureLoader, [
    '/textures/autumn/scatteredLeaves_ao.jpg',
    '/textures/autumn/scatteredLeaves_diff.jpg',
    '/textures/autumn/scatteredLeaves_disp.jpg',
    '/textures/autumn/scatteredLeaves_nor.jpg',
    '/textures/autumn/scatteredLeaves_rough.jpg'
  ])

  const textures = [
    scatteredLeavesDiff,
    scatteredLeavesRough,
    scatteredLeavesDisp,
    sandNormal
  ]

  useMemo(() => {
    scatteredLeavesDiff.colorSpace = 'srgb'
    textures.forEach(t => {
      t.wrapS = t.wrapT = RepeatWrapping
      t.repeat.set(500, 500)
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
          map={scatteredLeavesDiff}
          roughnessMap={scatteredLeavesRough}
          roughness={0} // makes the scatteredLeaves full matte
          normalMap={sandNormal}
          normalScale={new Vector2(1, 1)} // microrelief strength control
          displacementMap={scatteredLeavesDisp}
          displacementScale={0.2} // height of scatteredLeaves mounds (e.g. 20cm)
          aoMap={scatteredLeavesAO}
          aoMapIntensity={1.5} // enhances dark areas
          color="#e8f8fc"
        />
      </mesh>
    </RigidBody>
  )
}
