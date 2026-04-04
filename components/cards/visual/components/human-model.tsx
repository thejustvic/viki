/*
Command: npx gltfjsx@6.5.3 public/one.glb --transform --types --resolution 1024
Files: public/one.glb [8.11MB] > one.glb [2.43MB] (70%)
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
  ActionNameHuman,
  getNextActionHuman,
  useMoveForwardCamera
} from './model-helpers'

interface GLTFAction extends AnimationClip {
  name: ActionNameHuman
}

type GLTFResult = GLTF & {
  nodes: {
    Mannequin_1: SkinnedMesh
    Mannequin_2: SkinnedMesh
    root: Bone
  }
  materials: {
    M_Main: MeshStandardMaterial
    M_Joints: MeshStandardMaterial
  }
  animations: GLTFAction[]
}

interface HumanModelProps {
  characteristics: ModelCharacteristics
}
export const HumanModel = ({characteristics}: HumanModelProps) => {
  const group = useRef<Group>(null)
  const {scene, animations} = useGLTF('/one.glb')
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene])
  const {nodes, materials} = useGraph(clone) as unknown as GLTFResult
  const {actions} = useAnimations(animations, group)
  const controls = usePlayerControls(characteristics.is3DSceneLocked)

  const [currentAction, setCurrentAction] =
    useState<ActionNameHuman>('Idle_Talking_Loop')

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
    const nextAction = getNextActionHuman(controls, characteristics)

    if (nextAction !== currentAction) {
      setCurrentAction(nextAction)
    }
  })

  useMoveForwardCamera(group, characteristics)

  return (
    <group ref={group} dispose={null} scale={1.3} castShadow receiveShadow>
      <group name="Scene" castShadow receiveShadow>
        <group name="Armature" castShadow receiveShadow>
          <primitive object={nodes.root} castShadow receiveShadow />
        </group>
        <group name="Mannequin" castShadow receiveShadow>
          <skinnedMesh
            name="Mannequin_1"
            geometry={nodes.Mannequin_1.geometry}
            material={materials.M_Main}
            skeleton={nodes.Mannequin_1.skeleton}
            castShadow
            receiveShadow
          />
          <skinnedMesh
            name="Mannequin_2"
            geometry={nodes.Mannequin_2.geometry}
            material={materials.M_Joints}
            skeleton={nodes.Mannequin_2.skeleton}
            castShadow
            receiveShadow
          />
        </group>
      </group>
    </group>
  )
}
