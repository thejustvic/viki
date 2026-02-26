import {useGLTF} from '@react-three/drei'
import {RigidBody} from '@react-three/rapier'
import {Suspense} from 'react'

import type {Mesh, MeshStandardMaterial} from 'three'
import type {GLTF} from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    pine_bark_diff_4k_pine_bark_diff_4k_Mat_0: Mesh
    Pine_Texture_2_Pine_Texture_2_Mat_0: Mesh
  }
  materials: {
    pine_bark_diff_4k_Mat: MeshStandardMaterial
    Pine_Texture_2_Mat: MeshStandardMaterial
  }
}

export const TreeModel = () => {
  const {nodes, materials} = useGLTF(
    '/christmas_tree.glb'
  ) as unknown as GLTFResult

  return (
    <Suspense fallback={null}>
      <RigidBody colliders="hull" type="fixed">
        <mesh
          geometry={nodes.pine_bark_diff_4k_pine_bark_diff_4k_Mat_0.geometry}
          material={materials.pine_bark_diff_4k_Mat}
          scale={0.01}
          castShadow
          receiveShadow
        />
        <mesh
          geometry={nodes.Pine_Texture_2_Pine_Texture_2_Mat_0.geometry}
          material={materials.Pine_Texture_2_Mat}
          scale={0.01}
          castShadow
          receiveShadow
        />
      </RigidBody>
    </Suspense>
  )
}
