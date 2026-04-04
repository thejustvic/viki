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
  | 'A_TPose'
  | 'Crouch_Fwd_Loop'
  | 'Crouch_Idle_Loop'
  | 'Dance_Loop'
  | 'Death01'
  | 'Driving_Loop'
  | 'Fixing_Kneeling'
  | 'Hit_Chest'
  | 'Hit_Head'
  | 'Idle_Loop'
  | 'Idle_Talking_Loop'
  | 'Idle_Torch_Loop'
  | 'Interact'
  | 'Jog_Fwd_Loop'
  | 'Jump_Land'
  | 'Jump_Loop'
  | 'Jump_Start'
  | 'PickUp_Table'
  | 'Pistol_Aim_Down'
  | 'Pistol_Aim_Neutral'
  | 'Pistol_Aim_Up'
  | 'Pistol_Idle_Loop'
  | 'Pistol_Reload'
  | 'Pistol_Shoot'
  | 'Punch_Cross'
  | 'Punch_Jab'
  | 'Push_Loop'
  | 'Roll'
  | 'Roll_RM'
  | 'Sitting_Enter'
  | 'Sitting_Exit'
  | 'Sitting_Idle_Loop'
  | 'Sitting_Talking_Loop'
  | 'Spell_Simple_Enter'
  | 'Spell_Simple_Exit'
  | 'Spell_Simple_Idle_Loop'
  | 'Spell_Simple_Shoot'
  | 'Sprint_Loop'
  | 'Swim_Fwd_Loop'
  | 'Swim_Idle_Loop'
  | 'Sword_Attack'
  | 'Sword_Attack_RM'
  | 'Sword_Idle'
  | 'Walk_Formal_Loop'
  | 'Walk_Loop'

export const getNextActionBunny = (
  controls: MovementState,
  characteristics: ModelCharacteristics
): ActionNameBunny => {
  const {is3DSceneLocked, isJumping, isPreparingJump, isFlying} =
    characteristics
  const {forward, backward, left, right, shift, leftClick} = controls

  const isMoving = forward || backward || left || right

  if (is3DSceneLocked && isFlying) {
    return 'Jump_Idle'
  }

  if (is3DSceneLocked) {
    return 'Idle'
  }

  if (leftClick) {
    return 'Weapon'
  }

  if (isPreparingJump || isJumping || isFlying) {
    return 'Jump_Idle'
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
  const {is3DSceneLocked, isFlying, isPreparingJump, isFalling} =
    characteristics
  const {forward, backward, left, right, shift, sitDown, leftClick} = controls

  const isMoving = forward || backward || left || right

  if (is3DSceneLocked && isFlying) {
    return 'Jump_Loop'
  }

  if (is3DSceneLocked) {
    return 'Idle_Talking_Loop'
  }

  if (leftClick) {
    return 'Spell_Simple_Shoot'
  }

  if (isFlying) {
    return 'Jump_Loop'
  }

  if (isPreparingJump) {
    return 'Jump_Start'
  }

  if (isFalling) {
    return 'Jump_Land'
  }

  if (isMoving && sitDown) {
    return 'Crouch_Fwd_Loop'
  }

  if (sitDown) {
    return 'Crouch_Idle_Loop'
  }

  if (isMoving && shift) {
    return 'Jog_Fwd_Loop'
  }

  if (isMoving) {
    return 'Walk_Loop'
  }

  return 'Idle_Loop'
}

const _tempEuler = new Euler() // caching for performance
const targetQuaternion = new Quaternion()
const rotationAxis = new Vector3(0, 1, 0)

export const useMoveForwardCamera = (
  group: RefObject<Group | null>,
  characteristics: ModelCharacteristics
): void => {
  const {is3DSceneLocked, isThirdPersonView} = characteristics
  const controls = usePlayerControls(is3DSceneLocked)

  useFrame(state => {
    if (is3DSceneLocked || !group.current) {
      return
    }

    const {forward, backward, left, right} = controls
    const isMoving = forward || backward || left || right

    // get the current camera angle (Y)
    _tempEuler.setFromQuaternion(state.camera.quaternion, 'YXZ')
    const cameraAngle = _tempEuler.y

    if (!isThirdPersonView) {
      // IF FIRST PERSON VIEW: Constantly turn the model behind the camera
      // add Math.PI to make the model look "from the camera" (forward)
      const finalAngle = cameraAngle + Math.PI
      targetQuaternion.setFromAxisAngle(rotationAxis, finalAngle)

      // copy instantly so that the model does not lag behind when turning the head
      group.current.quaternion.copy(targetQuaternion)
    } else if (isMoving) {
      // IF THIRD PERSON VIEW: only return while moving
      let offset = 0
      if (forward) {
        if (left) {
          offset = Math.PI / 4
        } else if (right) {
          offset = -Math.PI / 4
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

      // smooth turn (slerp) while moving
      group.current.quaternion.slerp(targetQuaternion, 0.15)
    }
  })
}
