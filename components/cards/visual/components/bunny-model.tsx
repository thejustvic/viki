/*
Command for boilerplate: npx gltfjsx@6.5.3 public/bunny.gltf --transform --types --resolution 1024
Files: bunny.gltf [1.45MB] > bunny.glb [397.81KB] (73%)
*/

import {useAnimations, useGLTF} from '@react-three/drei'
import {useFrame, useGraph} from '@react-three/fiber'
import {useEffect, useMemo, useRef, useState} from 'react'
import {
  AnimationClip,
  Bone,
  Group,
  MeshStandardMaterial,
  SkinnedMesh
} from 'three'
import {GLTF, SkeletonUtils} from 'three-stdlib'

import {ModelCharacteristics} from '../ui/use-character-logic'
import {usePlayerControls} from '../utils/helpers'
import {
  ActionNameBunny,
  getNextActionBunny,
  useMoveForwardCamera
} from './model-helpers'

interface GLTFAction extends AnimationClip {
  name: ActionNameBunny
}

type GLTFResult = GLTF & {
  nodes: {
    Bunny: SkinnedMesh
    Carrot: SkinnedMesh
    Root: Bone
  }
  materials: {
    Atlas: MeshStandardMaterial
  }
  animations: GLTFAction[]
}

interface BunnyModelProps {
  characteristics: ModelCharacteristics
}
export const BunnyModel = ({characteristics}: BunnyModelProps) => {
  const group = useRef<Group>(null)
  const {scene, animations} = useGLTF('/bunny.glb')
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene])
  const {nodes, materials} = useGraph(clone) as unknown as GLTFResult
  const {actions} = useAnimations(animations, group)
  const controls = usePlayerControls()

  const [currentAction, setCurrentAction] = useState<ActionNameBunny>('Idle')

  useEffect(() => {
    const action = actions[currentAction]
    if (action) {
      action.reset().fadeIn(0.5).play()
      return () => {
        action.fadeOut(0.5)
      }
    }
  }, [currentAction, actions])

  useFrame(() => {
    const nextAction = getNextActionBunny(controls, characteristics)

    if (nextAction !== currentAction) {
      setCurrentAction(nextAction)
    }
  })

  useMoveForwardCamera(group, characteristics.isLocked)

  return (
    <group ref={group} dispose={null} scale={0.5}>
      <group name="Scene">
        <primitive object={nodes.Root} />
        <skinnedMesh
          name="Bunny"
          geometry={nodes.Bunny.geometry}
          material={materials.Atlas}
          skeleton={nodes.Bunny.skeleton}
          castShadow
          receiveShadow
        />
        <skinnedMesh
          name="Carrot"
          geometry={nodes.Carrot.geometry}
          material={materials.Atlas}
          skeleton={nodes.Carrot.skeleton}
          castShadow
          receiveShadow
        />
      </group>
    </group>
  )
}
