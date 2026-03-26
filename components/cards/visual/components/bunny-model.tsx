/*
Command for boilerplate: npx gltfjsx@6.5.3 public/bunny.gltf --transform --types --resolution 1024
Files: bunny.gltf [1.45MB] > bunny.glb [397.81KB] (73%)
*/

import {useAnimations, useGLTF} from '@react-three/drei'
import {useFrame, useGraph} from '@react-three/fiber'
import React, {RefObject, useEffect, useRef, useState} from 'react'
import {
  AnimationClip,
  Bone,
  Euler,
  Group,
  MeshStandardMaterial,
  Quaternion,
  SkinnedMesh,
  Vector3
} from 'three'
import {GLTF, SkeletonUtils} from 'three-stdlib'
import {MovementState, usePlayerControls} from '../utils/helpers'

type ActionName =
  | 'Death'
  | 'Duck'
  | 'HitReact'
  | 'Idle'
  | 'Jump'
  | 'Jump_Idle'
  | 'Jump_Land'
  | 'No'
  | 'Punch'
  | 'Run'
  | 'Walk'
  | 'Wave'
  | 'Weapon'
  | 'Yes'

interface GLTFAction extends AnimationClip {
  name: ActionName
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

export const BunnyModel = ({isLocked}: {isLocked: boolean}) => {
  const group = useRef<Group>(null)
  const {scene, animations} = useGLTF('/bunny.glb')
  const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene])
  const {nodes, materials} = useGraph(clone) as unknown as GLTFResult
  const {actions} = useAnimations(animations, group)
  const controls = usePlayerControls()

  const [currentAction, setCurrentAction] = useState<ActionName>('Idle')

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
    const nextAction = getNextAction(controls, isLocked)

    if (nextAction !== currentAction) {
      setCurrentAction(nextAction)
    }
  })

  useMoveForwardCamera(group, isLocked)

  return (
    <group ref={group} dispose={null} scale={0.5}>
      <group name="Scene">
        <primitive object={nodes.Root} />
        <skinnedMesh
          name="Bunny"
          geometry={nodes.Bunny.geometry}
          material={materials.Atlas}
          skeleton={nodes.Bunny.skeleton}
        />
        <skinnedMesh
          name="Carrot"
          geometry={nodes.Carrot.geometry}
          material={materials.Atlas}
          skeleton={nodes.Carrot.skeleton}
        />
      </group>
    </group>
  )
}

const getNextAction = (
  controls: MovementState,
  isLocked: boolean
): ActionName => {
  const {forward, backward, left, right, shift, leftClick} = controls

  const isMoving = forward || backward || left || right

  if (leftClick && !isLocked) {
    return 'Weapon'
  }

  if (isMoving && shift && !isLocked) {
    return 'Run'
  }

  if (isMoving && !isLocked) {
    return 'Walk'
  }

  return 'Idle'
}

const _tempEuler = new Euler() // caching for performance
const targetQuaternion = new Quaternion()
const rotationAxis = new Vector3(0, 1, 0)

const useMoveForwardCamera = (
  group: RefObject<Group | null>,
  isLocked: boolean
) => {
  const controls = usePlayerControls()

  useFrame(state => {
    if (isLocked) {
      return
    }
    const {forward, backward, left, right} = controls
    const isMoving = forward || backward || left || right

    if (isMoving && group.current) {
      // get the net angle of rotation of the camera around the Y axis
      // this works no matter where the camera is located.
      _tempEuler.setFromQuaternion(state.camera.quaternion, 'YXZ')
      const cameraAngle = _tempEuler.y

      // offset logic (direction relative to the camera's view)
      let offset = 0
      if (forward) {
        if (left) {
          offset = Math.PI / 4
        } else if (right) {
          offset = -Math.PI / 4
        } else {
          offset = 0
        }
      } else if (backward) {
        if (left) {
          offset = Math.PI - Math.PI / 4
        } else if (right) {
          offset = -Math.PI + Math.PI / 4
        } else {
          offset = Math.PI
        }
      } else if (left) {
        offset = Math.PI / 2
      } else if (right) {
        offset = -Math.PI / 2
      }

      const finalAngle = cameraAngle + offset + Math.PI

      targetQuaternion.setFromAxisAngle(rotationAxis, finalAngle)
      group.current.quaternion.slerp(targetQuaternion, 0.15)
    }
  })
}
