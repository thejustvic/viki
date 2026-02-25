import {useGLTF} from '@react-three/drei'
import {RigidBody} from '@react-three/rapier'
import {Suspense} from 'react'

interface ThreeModelProps {
  scale: number
}

export const TreeModel = ({scale}: ThreeModelProps) => {
  const {scene} = useGLTF('/christmas_tree.glb')

  scene.traverse(node => {
    node.castShadow = true
    node.receiveShadow = true
  })

  return (
    <Suspense fallback={null}>
      {/* "hull" for complex shapes, "cuboid" for boxes, etc. */}
      <RigidBody colliders="hull" type="fixed">
        <primitive object={scene} scale={scale} castShadow receiveShadow />
      </RigidBody>
    </Suspense>
  )
}
