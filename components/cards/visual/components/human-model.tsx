/* eslint-disable max-lines-per-function */

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
    Cube004: SkinnedMesh
    Cube004_1: SkinnedMesh
    Cube004_2: SkinnedMesh
    Cube004_3: SkinnedMesh
    Cube004_4: SkinnedMesh
    Cube004_5: SkinnedMesh
    Bone: Bone
  }
  materials: {
    PaletteMaterial001: MeshStandardMaterial
  }
  animations: GLTFAction[]
}

interface HumanModelProps {
  characteristics: ModelCharacteristics
}
export const HumanModel = ({characteristics}: HumanModelProps) => {
  const group = useRef<Group>(null)
  const {scene, animations} = useGLTF('/man.glb')
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene])
  const {nodes, materials} = useGraph(clone) as unknown as GLTFResult
  const {actions} = useAnimations(animations, group)
  const controls = usePlayerControls()

  const [currentAction, setCurrentAction] = useState<ActionNameHuman>('Idle')

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

  useMoveForwardCamera(group, characteristics.isLocked)

  return (
    <group ref={group} dispose={null} scale={0.8}>
      <group name="Scene">
        <group name="CharacterArmature">
          <primitive object={nodes.Bone} />
        </group>
        <group name="Body">
          <skinnedMesh
            name="Cube004"
            geometry={nodes.Cube004.geometry}
            material={materials.PaletteMaterial001}
            skeleton={nodes.Cube004.skeleton}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial color="#D2B48C" />
          </skinnedMesh>
          <skinnedMesh
            name="Cube004_1"
            geometry={nodes.Cube004_1.geometry}
            material={materials.PaletteMaterial001}
            skeleton={nodes.Cube004_1.skeleton}
            castShadow
            receiveShadow
          />
          <skinnedMesh
            name="Cube004_2"
            geometry={nodes.Cube004_2.geometry}
            material={materials.PaletteMaterial001}
            skeleton={nodes.Cube004_2.skeleton}
            castShadow
            receiveShadow
          />
          <skinnedMesh
            name="Cube004_3"
            geometry={nodes.Cube004_3.geometry}
            material={materials.PaletteMaterial001}
            skeleton={nodes.Cube004_3.skeleton}
            castShadow
            receiveShadow
          />
          <skinnedMesh
            name="Cube004_4"
            geometry={nodes.Cube004_4.geometry}
            material={materials.PaletteMaterial001}
            skeleton={nodes.Cube004_4.skeleton}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial color="#333333" />
          </skinnedMesh>
          <skinnedMesh
            name="Cube004_5"
            geometry={nodes.Cube004_5.geometry}
            material={materials.PaletteMaterial001}
            skeleton={nodes.Cube004_5.skeleton}
            castShadow
            receiveShadow
          />
        </group>
      </group>
    </group>
  )
}
