import {BooleanHookState} from '@/hooks/use-boolean'
import {PointerLockControls} from '@react-three/drei'
import {Camera, RootState, useFrame, useThree} from '@react-three/fiber'
import {RapierRigidBody, RigidBody} from '@react-three/rapier'
import {RefObject, useMemo, useRef} from 'react'
import {isMobile} from 'react-device-detect'
import {Vector3} from 'three'
import {usePlayerControls} from '../utils/helpers'

const SPEED = 5

interface Vector {
  x: number
  y: number
  z: number
}

type Vector2 = {x: number; y: number}

const useWalking = ({
  moveData,
  v,
  body,
  isFlying,
  camera,
  forward,
  backward,
  left,
  right
}: {
  moveData: RefObject<Vector2>
  v: {
    direction: Vector3
    front: Vector3
    side: Vector3
  }
  body: RapierRigidBody
  isFlying: RefObject<boolean>
  camera: Camera
  forward: boolean
  backward: boolean
  left: boolean
  right: boolean
}) => {
  // if the joystick is at zero, we take the value from the keyboard
  const inputX =
    moveData.current.x !== 0 ? moveData.current.x : Number(left) - Number(right)
  const inputZ =
    moveData.current.y !== 0
      ? -moveData.current.y
      : Number(backward) - Number(forward)

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

  return {currentVelocity}
}

const useJumping = ({
  state,
  isFlying,
  v,
  body,
  currentVelocity,
  lastJumpTime,
  jumpPressed,
  forward,
  backward,
  left,
  right,
  jump
}: {
  state: RootState
  v: {
    direction: Vector3
    front: Vector3
    side: Vector3
  }
  body: RapierRigidBody
  isFlying: RefObject<boolean>
  currentVelocity: Vector
  lastJumpTime: RefObject<number>
  jumpPressed: RefObject<boolean>
  forward: boolean
  backward: boolean
  left: boolean
  right: boolean
  jump: boolean
}) => {
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
    body.setLinvel({x: v.direction.x, y: verticalSpeed, z: v.direction.z}, true)
  } else {
    body.setLinvel(
      {x: v.direction.x, y: currentVelocity.y, z: v.direction.z},
      true
    )
    if (jump && Math.abs(currentVelocity.y) < 0.05) {
      body.setLinvel({x: currentVelocity.x, y: 5, z: currentVelocity.z}, true)
    }
  }
}

export const useCharacterLogic = (
  rigidBodyRef: RefObject<RapierRigidBody | null>,
  isLocked: boolean,
  moveData: RefObject<Vector2>,
  lookData: RefObject<Vector2>
) => {
  const {forward, backward, left, right, jump} = usePlayerControls()
  const {camera} = useThree()
  const isFlying = useRef(false)
  const lastJumpTime = useRef(0)
  const jumpPressed = useRef(false)

  const v = useMemo(
    () => ({
      direction: new Vector3(),
      front: new Vector3(),
      side: new Vector3()
    }),
    []
  )
  useFrame((state, delta) => {
    const body = rigidBodyRef.current
    if (!body) {
      return
    }
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
    const {currentVelocity} = useWalking({
      moveData,
      v,
      body,
      isFlying,
      camera,
      forward,
      backward,
      left,
      right
    })
    useJumping({
      state,
      v,
      body,
      isFlying,
      currentVelocity,
      jumpPressed,
      lastJumpTime,
      forward,
      backward,
      left,
      right,
      jump
    })
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
