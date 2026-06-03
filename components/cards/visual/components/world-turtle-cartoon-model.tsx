/*
Command: npx gltfjsx@6.5.3 public/turtle.glb --transform --types --resolution 1024 --keepgroups --keepmeshes
Files: public/turtle.glb [368.07KB] > turtle.glb [31.85KB] (91%)
*/

import {useGLTF} from '@react-three/drei'
import {useGraph} from '@react-three/fiber'
import React from 'react'
import {Bone, MeshStandardMaterial, SkinnedMesh} from 'three'
import {GLTF, SkeletonUtils} from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    Object_7: SkinnedMesh
    Object_8: SkinnedMesh
    Object_9: SkinnedMesh
    Object_10: SkinnedMesh
    Object_11: SkinnedMesh
    Object_13: SkinnedMesh
    Object_14: SkinnedMesh
    GLTF_created_0_rootJoint: Bone
  }
  materials: {
    Material: MeshStandardMaterial
    ['Material.001']: MeshStandardMaterial
    ['Material.004']: MeshStandardMaterial
    ['Material.003']: MeshStandardMaterial
  }
}

const topColor = `#0057B7`
const bottomColor = `#FFDD00`

export const WorldTurtleCartoonModel = () => {
  const {scene} = useGLTF('/turtle.glb')
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene])
  const {nodes, materials} = useGraph(clone) as unknown as GLTFResult
  return (
    <group
      dispose={null}
      rotation={[0, 0, -Math.PI / 32]}
      position={[-30, -150, 0]}
      scale={90}
    >
      <group>
        <primitive object={nodes.GLTF_created_0_rootJoint} />
        <skinnedMesh
          geometry={nodes.Object_7.geometry}
          material={materials.Material}
          skeleton={nodes.Object_7.skeleton}
          position={[-0.2, 0.41, 0]}
        />
        <skinnedMesh
          geometry={nodes.Object_8.geometry}
          material={materials['Material.001']}
          skeleton={nodes.Object_8.skeleton}
          position={[-0.2, 0.41, 0]}
        >
          <meshBasicMaterial color={bottomColor} />
        </skinnedMesh>
        <skinnedMesh
          geometry={nodes.Object_9.geometry}
          material={materials['Material.004']}
          skeleton={nodes.Object_9.skeleton}
          position={[-0.2, 0.41, 0]}
        />
        <skinnedMesh
          geometry={nodes.Object_10.geometry}
          material={materials['Material.003']}
          skeleton={nodes.Object_10.skeleton}
          position={[-0.2, 0.41, 0]}
        />
        <skinnedMesh
          geometry={nodes.Object_11.geometry} // eyes
          material={materials['Material.004']}
          skeleton={nodes.Object_11.skeleton}
          position={[-0.2, 0.41, 0]}
        />
        <skinnedMesh
          geometry={nodes.Object_13.geometry}
          material={materials.Material}
          skeleton={nodes.Object_13.skeleton}
          position={[-0.2, 0.41, 0]}
        />
        <skinnedMesh
          geometry={nodes.Object_14.geometry}
          material={materials['Material.001']}
          skeleton={nodes.Object_14.skeleton}
          position={[-0.2, 0.41, 0]}
        >
          <meshBasicMaterial color={topColor} />
        </skinnedMesh>
      </group>
    </group>
  )
}
