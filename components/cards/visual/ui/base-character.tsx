/* eslint-disable max-lines-per-function */
import {BooleanHookState} from '@/hooks/use-boolean'
import {PointerLockControls} from '@react-three/drei'
import {useFrame, useThree} from '@react-three/fiber'
import {RapierRigidBody, RigidBody} from '@react-three/rapier'
import {RefObject, useMemo, useRef} from 'react'
import {isMobile} from 'react-device-detect'
import {Euler, Vector3} from 'three'
import {usePlayerControls} from '../utils/helpers'
import {Vector2} from './joystick'

const SPEED = 5
const JUMP_FORCE = 5

// temporary variables outside the renderer to avoid Garbage Collection
const _tempVec = new Vector3()
const _tempEuler = new Euler()

export const useCharacterLogic = (
  rigidBodyRef: RefObject<RapierRigidBody | null>,
  isLocked: boolean,
  moveData: RefObject<{x: number; y: number}>,
  lookData: RefObject<{x: number; y: number}>
) => {
  const controls = usePlayerControls() // { forward, backward, left, right, jump }
  const {camera} = useThree()

  const isFlying = useRef(false)
  const lastJumpTime = useRef(0)
  const jumpPressed = useRef(false)

  // cache vectors so they don't have to be created 60 times per second
  const v = useMemo(
    () => ({
      direction: new Vector3(),
      front: new Vector3(),
      side: new Vector3(),
      targetVel: new Vector3()
    }),
    []
  )

  useFrame((state, delta) => {
    const body = rigidBodyRef.current
    if (!body) {
      return
    }

    // turn processing (looking)
    if (!isLocked) {
      _tempEuler.setFromQuaternion(camera.quaternion, 'YXZ')
      _tempEuler.y -= lookData.current.x * 1.5 * delta
      _tempEuler.x -= lookData.current.y * 1.5 * delta
      _tempEuler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, _tempEuler.x))
      camera.quaternion.setFromEuler(_tempEuler)

      // clean up data to avoid stuttering when accumulating events
      lookData.current.x = 0
      lookData.current.y = 0
    }

    // 2. camera synchronization (Lerp with FPS correction)
    const bodyPos = body.translation()
    _tempVec.set(bodyPos.x, bodyPos.y, bodyPos.z)

    // if the position difference is huge (e.g. teleport), copy instantly
    if (camera.position.distanceToSquared(_tempVec) > 100) {
      camera.position.copy(_tempVec)
    } else {
      // exponential smoothing (smoothness factor = 25)
      // 25 in the lerp formula is the stiffness coefficient of the camera-character connection
      // for a softer camera (like in GTA), try reducing the number to 10-15. if want sharp shooter control, increase to 40-50
      camera.position.lerp(_tempVec, 1 - Math.exp(-25 * delta))
    }

    if (isLocked) {
      body.setLinvel({x: 0, y: 0, z: 0}, true)
      return
    }
    if (isLocked) {
      body.setLinvel({x: 0, y: 0, z: 0}, true)
      return
    }

    // logic of movement (walking)
    const {forward, backward, left, right, jump} = controls
    const inputX =
      moveData.current.x !== 0
        ? moveData.current.x
        : Number(left) - Number(right)
    const inputZ =
      moveData.current.y !== 0
        ? -moveData.current.y
        : Number(backward) - Number(forward)

    v.front.set(0, 0, inputZ)
    v.side.set(inputX, 0, 0)
    v.direction.y = 0

    // get the direction relative to the camera
    v.direction
      .subVectors(v.front, v.side)
      .normalize()
      .applyQuaternion(camera.quaternion)

    // reset Y so that looking up/down does not affect horizontal speed
    v.direction.y = 0

    // re-normalize, because after removing Y the length of the vector has changed
    v.direction.normalize()

    // maintain vertical velocity (gravity)
    const currentVelocity = body.linvel()
    const strength = Math.min(Math.sqrt(inputX * inputX + inputZ * inputZ), 1)

    v.targetVel.set(
      v.direction.x * SPEED * strength,
      isFlying.current ? v.direction.y * SPEED : currentVelocity.y,
      v.direction.z * SPEED * strength
    )

    // jumping and flight logic
    const time = state.clock.getElapsedTime()
    if (jump && !jumpPressed.current) {
      if (time - lastJumpTime.current < 0.3) {
        isFlying.current = !isFlying.current
        body.setGravityScale(isFlying.current ? 0 : 1, true)
      }
      lastJumpTime.current = time
      jumpPressed.current = true

      // normal jump
      if (!isFlying.current && Math.abs(currentVelocity.y) < 0.1) {
        v.targetVel.y = JUMP_FORCE
      }
    }
    if (!jump) {
      jumpPressed.current = false
    }

    // additional upward thrust during flight
    if (isFlying.current && jump) {
      v.targetVel.y = SPEED
    }

    // one physics call (critical for FPS)
    body.setLinvel(v.targetVel, true)
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
        friction={0} // zero friction for smooth control
        restitution={0}
        canSleep={false}
      >
        <mesh castShadow scale={[1, 2.5, 1]}>
          <sphereGeometry args={[props.args?.[0] ?? 1]} />
          <meshStandardMaterial color="pink" />
        </mesh>
      </RigidBody>
    </>
  )
}
