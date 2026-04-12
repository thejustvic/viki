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
import {ActionNameDolphin} from './model-helpers'

interface GLTFAction extends AnimationClip {
  name: ActionNameDolphin
}

type GLTFResult = GLTF & {
  nodes: {
    Dolphin_1: SkinnedMesh
    Dolphin_2: SkinnedMesh
    Root: Bone
  }
  materials: {
    Top: MeshStandardMaterial
    Bottom: MeshStandardMaterial
  }
  animations: GLTFAction[]
}

export const DolphinModel = () => {
  const group = useRef<Group>(null)
  const {scene, animations} = useGLTF('/dolphin.glb')
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene])
  const {nodes, materials} = useGraph(clone) as unknown as GLTFResult
  const {actions} = useAnimations(animations, group)

  useEffect(() => {
    const action = actions['Swim']
    if (action) {
      action.reset().fadeIn(0.5).play()
      return () => {
        action.fadeOut(0.5)
      }
    }
  }, [actions])

  return (
    <group ref={group} dispose={null} castShadow receiveShadow>
      <group name="Scene">
        <group name="Armature" position={[0, 0.533, 0]}>
          <primitive object={nodes.Root} />
        </group>
        <group name="Dolphin" position={[0, 0.533, 0]}>
          <skinnedMesh
            name="Dolphin_1"
            geometry={nodes.Dolphin_1.geometry}
            material={materials.Top}
            skeleton={nodes.Dolphin_1.skeleton}
          />
          <skinnedMesh
            name="Dolphin_2"
            geometry={nodes.Dolphin_2.geometry}
            material={materials.Bottom}
            skeleton={nodes.Dolphin_2.skeleton}
          />
        </group>
      </group>
    </group>
  )
}
