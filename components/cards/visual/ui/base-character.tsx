/* eslint-disable max-lines-per-function */
import {BooleanHookState} from '@/hooks/use-boolean'
import {PointerLockControls} from '@react-three/drei'
import {useFrame, useThree} from '@react-three/fiber'
import type {RapierRigidBody} from '@react-three/rapier'
import {CapsuleCollider, RigidBody} from '@react-three/rapier'
import {RefObject, useLayoutEffect, useMemo, useRef} from 'react'
import {isMobile} from 'react-device-detect'
import type {Mesh} from 'three'
import {Euler, Vector3} from 'three'
import {usePlayerControls} from '../utils/helpers'
import {Vector2} from './joystick'

const SPEED = 4
const JUMP_FORCE = 2

const isThirdPersonView = false

const CAMERA_OFFSET = new Vector3(0, 1, 4) // x: sideways, y: up, z: back

// 25 in the lerp formula is the stiffness coefficient of the camera-character connection
// for a softer camera (like in GTA), try reducing the number to 10-15. if want sharp shooter control, increase to 40-50
// 15 for TPS softness
const smoothnessFactor = isThirdPersonView ? 15 : 25

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

      if (isMobile) {
        // mobile joystick: works as velocity
        // factor of 2-3 is usually better for a joystick
        _tempEuler.y -= lookData.current.x * 2 * delta
        _tempEuler.x -= lookData.current.y * 2 * delta
      } else {
        // desktop mouse: works like offset (delta)
        _tempEuler.y -= lookData.current.x * 1.5 * delta
        _tempEuler.x -= lookData.current.y * 1.5 * delta

        // decay mouse only
        const lookDecay = Math.exp(-smoothnessFactor * delta)
        lookData.current.x *= lookDecay
        lookData.current.y *= lookDecay

        if (Math.abs(lookData.current.x) < 0.0001) {
          lookData.current.x = 0
        }
        if (Math.abs(lookData.current.y) < 0.0001) {
          lookData.current.y = 0
        }
      }

      // limit gaze up/down so you don't "fall over"
      _tempEuler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, _tempEuler.x))

      // apply changes to the camera
      camera.quaternion.setFromEuler(_tempEuler)
    }

    // camera synchronization
    const bodyPos = body.translation()

    // determine the "head" point (center of the body + upward movement)
    // y + 0.55: this offset raises the camera from the center of the capsule to the top. if the camera is too low, increase to 0.6
    _tempVec.set(bodyPos.x, bodyPos.y + 0.55, bodyPos.z)

    // smooth camera tracking (lerp)
    if (isThirdPersonView) {
      const offset = new Vector3()
        .copy(CAMERA_OFFSET)
        .applyQuaternion(camera.quaternion)
      const targetCameraPos = new Vector3().addVectors(_tempVec, offset)
      if (camera.position.distanceToSquared(targetCameraPos) > 100) {
        camera.position.copy(targetCameraPos)
      } else {
        // exponential smoothing (smoothness factor)
        camera.position.lerp(
          targetCameraPos,
          1 - Math.exp(-smoothnessFactor * delta)
        )
      }
    } else {
      // if the position difference is huge (e.g. teleport), copy instantly
      if (camera.position.distanceToSquared(_tempVec) > 100) {
        camera.position.copy(_tempVec)
      } else {
        // exponential smoothing (smoothness factor)
        camera.position.lerp(_tempVec, 1 - Math.exp(-smoothnessFactor * delta))
      }
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
  moveData: RefObject<Vector2>
  lookData: RefObject<Vector2>
}

export const BaseCharacter = (props: BaseCharacterProps) => {
  const meshRef = useRef<Mesh>(null)
  const rigidBodyRef = useRef<RapierRigidBody>(null)

  useLayoutEffect(() => {
    if (meshRef.current) {
      meshRef.current.visible = isThirdPersonView
    }
  }, [isThirdPersonView])

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
        position={[0, 0, 0]}
        colliders={false}
        lockRotations
      >
        {/* physics collider: perfectly matches the shape of the capsule */}
        {/* args: [half height of cylindrical part, radius] */}
        <CapsuleCollider args={[0.35, 0.25]} />

        {/* visual: using capsuleGeometry */}
        <mesh ref={meshRef} position={[0, 0, 0]} castShadow>
          {/* args: [radius, cylinder height, rounding segments, side segments] */}
          <capsuleGeometry args={[0.25, 0.6, 4, 16]} />
          <meshStandardMaterial color="pink" />
        </mesh>
      </RigidBody>
    </>
  )
}
