import {useGLTF} from '@react-three/drei'
import {RigidBody} from '@react-three/rapier'
import {Suspense} from 'react'

interface ThreeModelProps {
  scale: number
  position: [number, number, number]
}

export const TreeModel = ({scale, position}: ThreeModelProps) => {
  const {scene} = useGLTF('/christmas_tree.glb')

  return (
    <Suspense fallback={null}>
      {/* "hull" for complex shapes, "cuboid" for boxes, etc. */}
      <RigidBody colliders="hull" type="fixed">
        <primitive object={scene} scale={scale} position={position} />
      </RigidBody>
    </Suspense>
  )
}
