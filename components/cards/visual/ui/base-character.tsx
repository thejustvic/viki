/* eslint-disable max-lines-per-function */
import {BooleanHookState} from '@/hooks/use-boolean'
import {PointerLockControls} from '@react-three/drei'
import {useFrame, useThree} from '@react-three/fiber'
import {RapierRigidBody, RigidBody} from '@react-three/rapier'
import {RefObject, useMemo, useRef} from 'react'
import {isMobile} from 'react-device-detect'
import {Vector3} from 'three'
import {usePlayerControls} from '../utils/helpers'

const SPEED = 5

type Vector2 = {x: number; y: number}

export const useCharacterLogic = (
  rigidBodyRef: RefObject<RapierRigidBody | null>,
  isLocked: boolean,
  moveData: RefObject<Vector2>,
  lookData: RefObject<Vector2>
) => {
  const {camera} = useThree()
  const {forward, backward, left, right, jump} = usePlayerControls()

  const v = useMemo(
    () => ({
      direction: new Vector3(),
      front: new Vector3(),
      side: new Vector3()
    }),
    []
  )
  const isFlying = useRef(false)
  const lastJumpTime = useRef(0)
  const jumpPressed = useRef(false)

  useFrame((state, delta) => {
    const body = rigidBodyRef.current
    if (!body) {
      return
    }
    // regression logic for mouse movements (lookData)
    // if (lookData.current.x !== 0 || lookData.current.y !== 0) {
    //   performance.regress() // performance is from const {performance} = useThree()
    // }
    camera.rotation.order = 'YXZ'

    // LOOKING
    if (!isLocked) {
      camera.rotation.y -= lookData.current.x * 2 * delta
      camera.rotation.x -= lookData.current.y * 2 * delta

      camera.rotation.x = Math.max(
        -Math.PI / 2,
        Math.min(Math.PI / 2, camera.rotation.x)
      )
    }

    camera.position.copy(body.translation())

    if (isLocked) {
      body.setLinvel({x: 0, y: 0, z: 0}, true)
      return
    }

    // if the joystick is at zero, we take the value from the keyboard
    const inputX =
      moveData.current.x !== 0
        ? moveData.current.x
        : Number(left) - Number(right)
    const inputZ =
      moveData.current.y !== 0
        ? -moveData.current.y
        : Number(backward) - Number(forward)

    // reduce DPR while running or jumping
    // if (inputX !== 0 || inputZ !== 0 || jump) {
    //   performance.regress()
    // }

    const inputLength = Math.sqrt(inputX * inputX + inputZ * inputZ)

    v.front.set(0, 0, inputZ)
    v.side.set(inputX, 0, 0)

    v.direction
      .subVectors(v.front, v.side)
      .normalize()
      .multiplyScalar(SPEED * Math.min(inputLength, 1))
      .applyEuler(camera.rotation)

    const currentVelocity = body.linvel()

    body.setLinvel(
      {
        x: v.direction.x,
        y: isFlying.current ? v.direction.y : currentVelocity.y,
        z: v.direction.z
      },
      true
    )

    const time = state.clock.getElapsedTime()
    if (jump && !jumpPressed.current) {
      const timeSinceLastJump = time - lastJumpTime.current
      if (timeSinceLastJump < 0.3) {
        isFlying.current = !isFlying.current
        body.setGravityScale(isFlying.current ? 0 : 1, true)
      }
      lastJumpTime.current = time
      jumpPressed.current = true
    }
    if (!jump) {
      jumpPressed.current = false
    }
    v.front.set(0, 0, Number(backward) - Number(forward))
    v.side.set(Number(left) - Number(right), 0, 0)

    if (isFlying.current) {
      const verticalSpeed = jump ? SPEED : v.direction.y
      body.setLinvel(
        {x: v.direction.x, y: verticalSpeed, z: v.direction.z},
        true
      )
    } else {
      body.setLinvel(
        {x: v.direction.x, y: currentVelocity.y, z: v.direction.z},
        true
      )
      if (jump && Math.abs(currentVelocity.y) < 0.05) {
        body.setLinvel({x: currentVelocity.x, y: 5, z: currentVelocity.z}, true)
      }
    }
  })
  return {isFlying: isFlying.current}
}

interface BaseCharacterProps {
  isLocked: BooleanHookState
  position?: [number, number, number]
  args?: [number] // sphere geometry args expects a single radius number
  moveData: RefObject<Vector2>
  lookData: RefObject<Vector2>
}
export const BaseCharacter = (props: BaseCharacterProps) => {
  const rigidBodyRef = useRef<RapierRigidBody>(null)

  useCharacterLogic(
    rigidBodyRef,
    props.isLocked.value,
    props.moveData,
    props.lookData
  )

  return (
    <>
      {/* 1. Controller for Desktop */}
      {!isMobile && (
        <PointerLockControls
          selector="#enter-btn"
          onLock={props.isLocked.turnOff}
          onUnlock={props.isLocked.turnOn}
        />
      )}

      <RigidBody
        ref={rigidBodyRef}
        lockRotations
        position={props.position ?? [0, 2, 0]}
      >
        <mesh castShadow scale={[1, 2.5, 1]}>
          <sphereGeometry args={[props.args?.[0] ?? 1]} />
          <meshStandardMaterial color="pink" />
        </mesh>
      </RigidBody>
    </>
  )
}
