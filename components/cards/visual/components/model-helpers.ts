import {useFrame} from '@react-three/fiber'
import {RefObject} from 'react'
import {Euler, Group, Quaternion, Vector3} from 'three'
import {ModelCharacteristics} from '../ui/use-character-logic'
import {MovementState, usePlayerControls} from '../utils/helpers'

export type ActionNameBunny =
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

export type ActionNameHuman =
  | 'Death'
  | 'Defeat'
  | 'Idle'
  | 'Jump'
  | 'PickUp'
  | 'Punch'
  | 'RecieveHit'
  | 'Roll'
  | 'Run'
  | 'Run_Carry'
  | 'Shoot_OneHanded'
  | 'SitDown'
  | 'StandUp'
  | 'SwordSlash'
  | 'Victory'
  | 'Walk'
  | 'Walk_Carry'

export const getNextActionBunny = (
  controls: MovementState,
  characteristics: ModelCharacteristics
): ActionNameBunny => {
  const {isLocked, isJumping, isPreparingJump, isFlying} = characteristics
  const {forward, backward, left, right, shift, leftClick} = controls

  const isMoving = forward || backward || left || right

  if (isLocked) {
    return 'Idle'
  }

  if (isPreparingJump || isJumping || isFlying) {
    return 'Jump_Idle'
  }

  if (leftClick) {
    return 'Weapon'
  }

  if (isMoving && shift) {
    return 'Run'
  }

  if (isMoving) {
    return 'Walk'
  }

  return 'Idle'
}

export const getNextActionHuman = (
  controls: MovementState,
  characteristics: ModelCharacteristics
): ActionNameHuman => {
  const {isLocked, isFlying, isPreparingJump} = characteristics
  const {forward, backward, left, right, shift, leftClick} = controls

  const isMoving = forward || backward || left || right

  if (isLocked || isFlying) {
    return 'Idle'
  }

  if (leftClick) {
    return 'PickUp'
  }

  if (isPreparingJump) {
    return 'Jump'
  }

  if (isMoving && shift) {
    return 'Run'
  }

  if (isMoving) {
    return 'Walk'
  }

  return 'Idle'
}

const _tempEuler = new Euler() // caching for performance
const targetQuaternion = new Quaternion()
const rotationAxis = new Vector3(0, 1, 0)

export const useMoveForwardCamera = (
  group: RefObject<Group | null>,
  isLocked: boolean
): void => {
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
