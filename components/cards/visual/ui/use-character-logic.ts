/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
import {useFrame, useThree} from '@react-three/fiber'
import type {RapierRigidBody} from '@react-three/rapier'
import {RefObject, useMemo, useRef, useState} from 'react'
import {isMobile} from 'react-device-detect'
import {Euler, Vector3} from 'three'
import {usePlayerControls} from '../utils/helpers'

const JUMP_PREP_DURATION = 0.2 // 200ms time for jump-start animation
const DOUBLE_CLICK_WINDOW = 0.25 // 250ms time between the first and second click
const THRUST_DELAY = 0.25 // 250ms delay before activating up thrust
const GROUNDED_THRESHOLD = 0.1 // vertical speed threshold for ground

// side camera view
const CAMERA_OFFSET = new Vector3(1, 0, 4) // x: sideways, y: up, z: back

// temporary variables outside the renderer to avoid Garbage Collection
const _tempVec = new Vector3()
const _tempEuler = new Euler()

interface CharacterLogicProps {
  rigidBodyRef: RefObject<RapierRigidBody | null>
  movement: {
    moveData: RefObject<{x: number; y: number}>
    lookData: RefObject<{x: number; y: number}>
  }
  characteristics: {
    isLocked: boolean
    smoothnessFactor: number
    isThirdPersonView: boolean
    speed: number
    headPoint: number
    jumpForce: number
  }
}
export interface ModelCharacteristics {
  isLocked: boolean
  isFlying: boolean
  isJumping: boolean
  isFalling: boolean
  isPreparingJump: boolean
  justDropped: boolean
}
export const useCharacterLogic = (
  props: CharacterLogicProps
): ModelCharacteristics => {
  const {rigidBodyRef, movement, characteristics} = props
  const {moveData, lookData} = movement
  const {
    isLocked,
    smoothnessFactor,
    isThirdPersonView,
    speed,
    headPoint,
    jumpForce
  } = characteristics
  const controls = usePlayerControls() // { forward, backward, left, right, jump }
  const {camera} = useThree()

  const [isPreparingJump, setIsPreparingJump] = useState(false)

  // animation states
  const [isJumping, setIsJumping] = useState(false)
  const [isFalling, setIsFalling] = useState(false)

  const isFlying = useRef(false)
  const wasFlying = useRef(false) // flight status in the last frame
  const lastJumpTime = useRef(0)
  const jumpPressed = useRef(false)
  const jumpTargetTime = useRef<number | null>(null)

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

    const flyingNow = isFlying.current

    const time = state.clock.getElapsedTime()

    // 'flight mode' exit detection
    if (wasFlying.current && !flyingNow) {
      const vel = body.linvel()
      body.setLinvel({x: vel.x * 0.5, y: -2, z: vel.z * 0.5}, true)
    }

    // 'flight mode' entry detection
    if (!wasFlying.current && flyingNow) {
      body.setLinvel({x: 0, y: 0, z: 0}, true)
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
        // for desktop: use a constant multiplier for smoothness
        const sensitivity = 0.1
        _tempEuler.y -= lookData.current.x * sensitivity
        _tempEuler.x -= lookData.current.y * sensitivity

        // decay mouse only
        const lookDecay = Math.exp(-smoothnessFactor * delta)
        lookData.current.x *= lookDecay
        lookData.current.y *= lookDecay
      }
      const angleView = isThirdPersonView ? 0.15 : Math.PI / 2
      // limit gaze up/down so you don't "fall over"
      _tempEuler.x = Math.max(-Math.PI / 2, Math.min(angleView, _tempEuler.x))

      // apply changes to the camera
      camera.quaternion.setFromEuler(_tempEuler)
    }

    // camera synchronization
    const bodyPos = body.translation()

    // determine the "headPoint" point (center of the body + upward movement)
    // y + headPoint: this offset raises the camera from the center of the capsule to the top. if the camera is too low, increase headPoint
    _tempVec.set(bodyPos.x, bodyPos.y + headPoint, bodyPos.z)

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
    const {forward, backward, left, right} = controls
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

    // get the direction relative to the camera with save normalization
    v.direction.subVectors(v.front, v.side)
    if (v.direction.lengthSq() > 0) {
      v.direction.normalize().applyQuaternion(camera.quaternion)
    }

    // reset Y so that looking up/down does not affect horizontal speed
    if (!isFlying.current) {
      v.direction.y = 0
      if (v.direction.lengthSq() > 0) {
        v.direction.normalize()
      }
    }

    // re-normalize, because after removing Y the length of the vector has changed
    v.direction.normalize()

    // jumping and flight logic
    const currentVelocity = body.linvel()
    const strength = Math.min(Math.sqrt(inputX * inputX + inputZ * inputZ), 1)

    const vy = currentVelocity.y
    const grounded = Math.abs(vy) < GROUNDED_THRESHOLD
    const {jump} = controls

    // jumping verification
    if (jump && !jumpPressed.current) {
      jumpPressed.current = true
      const timeSinceLastJump = time - lastJumpTime.current

      // double jump verification
      if (timeSinceLastJump > 0.01 && timeSinceLastJump < DOUBLE_CLICK_WINDOW) {
        isFlying.current = !isFlying.current
        body.setGravityScale(isFlying.current ? 0 : 1, true)

        if (isFlying.current) {
          body.setLinvel(
            {x: currentVelocity.x, y: 0, z: currentVelocity.z},
            true
          )
        }

        jumpTargetTime.current = null
        setIsPreparingJump(false)
        lastJumpTime.current = 0
      } else {
        // this is the first jump
        lastJumpTime.current = time

        if (grounded && !isFlying.current) {
          jumpTargetTime.current = time + JUMP_PREP_DURATION
          setIsPreparingJump(true)
        }
      }
    }

    if (!jump) {
      jumpPressed.current = false
    }

    // calculation of vertical velocity
    let targetY = isFlying.current ? v.direction.y * speed * strength : vy

    // thrust
    if (
      isFlying.current &&
      jump &&
      time - lastJumpTime.current > THRUST_DELAY
    ) {
      targetY = speed
    }

    // logic of preparing for the jump
    if (jumpTargetTime.current !== null) {
      if (time >= jumpTargetTime.current) {
        targetY = jumpForce
        jumpTargetTime.current = null
        setIsPreparingJump(false)
        setIsJumping(true)
      } else {
        targetY = 0
      }
    }

    // application of speed
    v.targetVel.set(
      v.direction.x * speed * strength,
      targetY,
      v.direction.z * speed * strength
    )

    body.setLinvel(v.targetVel, true)

    // animation state updates
    if (!isFlying.current && jumpTargetTime.current === null) {
      const jumping = vy > 0.5
      const falling = vy < -0.5
      if (isJumping !== jumping) {
        setIsJumping(jumping)
      }
      if (isFalling !== falling) {
        setIsFalling(falling)
      }
    } else {
      if (isJumping) {
        setIsJumping(false)
      }
      if (isFalling) {
        setIsFalling(false)
      }
    }

    // update the ref for detection in the next frame
    wasFlying.current = isFlying.current
  })

  return {
    isLocked,
    isFlying: isFlying.current,
    isJumping,
    isFalling,
    isPreparingJump,
    justDropped: wasFlying.current && !isFlying.current
  }
}
