/*
Command: npx gltfjsx@6.5.3 public/world_turtle.glb --transform --types --resolution 1024 --keepgroups --keepmeshes
Files: public/world_turtle.glb [4.67MB] > world_turtle-transformed.glb [637.77KB] (86%)
*/

import {useAnimations, useGLTF} from '@react-three/drei'
import {useGraph} from '@react-three/fiber'
import {useEffect, useMemo, useRef} from 'react'
import {
  AnimationClip,
  Bone,
  Group,
  MeshStandardMaterial,
  SkinnedMesh
} from 'three'
import {GLTF, SkeletonUtils} from 'three-stdlib'

type ActionName = 'Animation'

interface GLTFAction extends AnimationClip {
  name: ActionName
}

type GLTFResult = GLTF & {
  nodes: {
    Object_7: SkinnedMesh
    GLTF_created_0_rootJoint: Bone
  }
  materials: {
    Material: MeshStandardMaterial
  }
  animations: GLTFAction[]
}

export const WorldTurtleModel = () => {
  const group = useRef<Group>(null)
  const {scene, animations} = useGLTF('/world_turtle.glb')
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene])
  const {nodes, materials} = useGraph(clone) as unknown as GLTFResult
  const {actions} = useAnimations(animations, group)

  useEffect(() => {
    const action = actions['Animation']
    if (action) {
      action.reset().play()

      return () => {
        action.fadeOut(0.5)
      }
    }
  }, [actions])

  return (
    <group ref={group} dispose={null} position={[-30, -150, 0]} scale={5000}>
      <primitive object={nodes.GLTF_created_0_rootJoint} />
      <skinnedMesh
        name="Object_7"
        geometry={nodes.Object_7.geometry}
        material={materials.Material}
        skeleton={nodes.Object_7.skeleton}
      />
    </group>
  )
}
