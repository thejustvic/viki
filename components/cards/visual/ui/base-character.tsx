/* eslint-disable max-lines-per-function */
import {BooleanHookState} from '@/hooks/use-boolean'
import {PointerLockControls} from '@react-three/drei'
import type {RapierRigidBody} from '@react-three/rapier'
import {CapsuleCollider, RigidBody} from '@react-three/rapier'
import {RefObject, useLayoutEffect, useRef, useState} from 'react'
import {isMobile} from 'react-device-detect'
import type {Mesh} from 'three'
import {PlayerSizeType} from '../../types'
import {BunnyModel} from '../components/bunny-model'
import {HumanModel} from '../components/human-model'
import {usePlayerControls} from '../utils/helpers'
import {Vector2} from './joystick'
import {ModelCharacteristics, useCharacterLogic} from './use-character-logic'

// 25 in the lerp formula is the stiffness coefficient of the camera-character connection
// for a softer camera (like in GTA), try reducing the number to 10-15. if want sharp shooter control, increase to 40-50
const firstPersonViewSmoothnessFactor = 25
// 15 for TPS softness
const thirdPersonViewSmoothnessFactor = 15

interface BaseCharacterProps {
  isLocked: BooleanHookState
  moveData: RefObject<Vector2>
  lookData: RefObject<Vector2>
  isThirdPersonView: boolean
  playerSize: PlayerSizeType[number]
}

const walkSpeed = 4
const runSpeed = 8

export const BaseCharacter = ({
  isLocked,
  moveData,
  lookData,
  isThirdPersonView,
  playerSize
}: BaseCharacterProps) => {
  const meshRef = useRef<Mesh>(null)
  const rigidBodyRef = useRef<RapierRigidBody>(null)
  const {shift} = usePlayerControls()
  const [speed, setSpeed] = useState(walkSpeed)

  const smoothnessFactor = isThirdPersonView
    ? thirdPersonViewSmoothnessFactor
    : firstPersonViewSmoothnessFactor

  useLayoutEffect(() => {
    if (meshRef.current) {
      meshRef.current.visible = isThirdPersonView
    }
    if (shift) {
      setSpeed(runSpeed)
    } else {
      setSpeed(walkSpeed)
    }
  }, [isThirdPersonView, shift])

  const characteristics = useCharacterLogic({
    rigidBodyRef,
    movement: {
      moveData,
      lookData
    },
    characteristics: {
      isLocked: isLocked.value,
      smoothnessFactor,
      isThirdPersonView,
      speed,
      headPoint: getHeadPoint(playerSize),
      jumpForce: getJumpForce(playerSize)
    }
  })

  const {argsCapsuleCollider, positionCapsuleCollider} =
    getCapsuleColliderProps(playerSize)

  return (
    <>
      {!isMobile && (
        <PointerLockControls
          selector="#enter-btn"
          onLock={isLocked.turnOff}
          onUnlock={isLocked.turnOn}
        />
      )}
      <RigidBody
        ref={rigidBodyRef}
        position={[0, 0, 0]}
        colliders={false}
        lockRotations
      >
        {/* visual */}
        <mesh ref={meshRef} position={[0, 0, 0]} castShadow>
          {getModel({
            playerSize,
            characteristics
          })}
        </mesh>
        {/* physics collider */}
        <CapsuleCollider
          args={argsCapsuleCollider}
          position={positionCapsuleCollider}
        />
      </RigidBody>
    </>
  )
}

const getJumpForce = (playerSize: PlayerSizeType[number]) => {
  switch (playerSize) {
    case 'human': {
      return 2
    }
    case 'bunny': {
      return 5
    }
    default: {
      return 2
    }
  }
}

const getHeadPoint = (playerSize: PlayerSizeType[number]) => {
  switch (playerSize) {
    case 'human': {
      return 2.1
    }
    case 'bunny': {
      return 1.1
    }
    default: {
      return 2.1
    }
  }
}

const getCapsuleColliderProps = (
  playerSize: PlayerSizeType[number]
): {
  argsCapsuleCollider: [number, number]
  positionCapsuleCollider: [number, number, number]
} => {
  // adjust these two values until the mesh "hugs" the model in <Physics debug /> mode
  // default is for human
  let argsCapsuleCollider: [number, number] = [0.8, 0.5]
  let positionCapsuleCollider: [number, number, number] = [0, 1.2, 0]
  switch (playerSize) {
    case 'human': {
      return {argsCapsuleCollider, positionCapsuleCollider}
    }
    case 'bunny': {
      argsCapsuleCollider = [0.4, 0.3]
      positionCapsuleCollider = [0, 0.7, 0]
      return {argsCapsuleCollider, positionCapsuleCollider}
    }
    default: {
      return {argsCapsuleCollider, positionCapsuleCollider}
    }
  }
}

interface ModelProps {
  playerSize: PlayerSizeType[number]
  characteristics: ModelCharacteristics
}
const getModel = (props: ModelProps) => {
  const {playerSize, characteristics} = props

  switch (playerSize) {
    case 'human': {
      return <HumanModel characteristics={characteristics} />
    }
    case 'bunny': {
      return <BunnyModel characteristics={characteristics} />
    }
    default: {
      return <HumanModel characteristics={characteristics} />
    }
  }
}
