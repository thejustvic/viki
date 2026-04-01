/* eslint-disable max-lines-per-function */
import {useGlobalStore} from '@/components/global-provider/global-store'
import {PointerLockControls} from '@react-three/drei'
import type {RapierRigidBody} from '@react-three/rapier'
import {CapsuleCollider, RigidBody} from '@react-three/rapier'
import {observer} from 'mobx-react-lite'
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
  moveData: RefObject<Vector2>
  lookData: RefObject<Vector2>
}

const walkSpeed = 4
const runSpeed = 8

export const BaseCharacter = observer(
  ({moveData, lookData}: BaseCharacterProps) => {
    const [globalState, globalStore] = useGlobalStore()

    const playerSize = globalState.playerSize
    const isThirdPersonView = globalState.isThirdPersonView

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
        isLocked: globalState.is3DSceneLocked,
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
            onLock={() => globalStore.setIs3DSceneLocked(false)}
            onUnlock={() => globalStore.setIs3DSceneLocked(true)}
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
)

const getJumpForce = (playerSize: PlayerSizeType[number]) => {
  const human = 2
  const bunny = 5
  switch (playerSize) {
    case 'human': {
      return human
    }
    case 'bunny': {
      return bunny
    }
    default: {
      return human
    }
  }
}

const getHeadPoint = (playerSize: PlayerSizeType[number]) => {
  const human = 2.1
  const bunny = 1.1
  switch (playerSize) {
    case 'human': {
      return human
    }
    case 'bunny': {
      return bunny
    }
    default: {
      return human
    }
  }
}

interface ICapsuleCollider {
  argsCapsuleCollider: [number, number]
  positionCapsuleCollider: [number, number, number]
}
const getCapsuleColliderProps = (
  playerSize: PlayerSizeType[number]
): ICapsuleCollider => {
  // adjust these two values until the mesh "hugs" the model in <Physics debug /> mode
  const human: ICapsuleCollider = {
    argsCapsuleCollider: [0.8, 0.5],
    positionCapsuleCollider: [0, 1.2, 0]
  }
  const bunny: ICapsuleCollider = {
    argsCapsuleCollider: [0.4, 0.3],
    positionCapsuleCollider: [0, 0.7, 0]
  }
  switch (playerSize) {
    case 'human': {
      return human
    }
    case 'bunny': {
      return bunny
    }
    default: {
      return human
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
