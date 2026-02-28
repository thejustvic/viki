import {BooleanHookState} from '@/hooks/use-boolean'
import {useFrame, useThree} from '@react-three/fiber'
import {RapierRigidBody, RigidBody} from '@react-three/rapier'
import {RefObject, useMemo, useRef} from 'react'
import {Vector3} from 'three'
import {usePlayerControls} from '../utils/helpers'

const SPEED = 5

export const useCharacterLogic = (
  rigidBodyRef: RefObject<RapierRigidBody | null>,
  isLocked: boolean
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

  useFrame(state => {
    const body = rigidBodyRef.current
    if (!body) {
      return
    }
    camera.position.copy(body.translation())
    if (!isLocked) {
      body.setLinvel({x: 0, y: 0, z: 0}, true)
      return
    }
    const currentVelocity = body.linvel()
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
    v.direction
      .subVectors(v.front, v.side)
      .normalize()
      .multiplyScalar(SPEED)
      .applyEuler(camera.rotation)
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
}

export const BaseCharacter = (props: BaseCharacterProps) => {
  const rigidBodyRef = useRef<RapierRigidBody>(null)

  useCharacterLogic(rigidBodyRef, props.isLocked.value)

  const radius = props.args?.[0] ?? 1

  return (
    <RigidBody
      ref={rigidBodyRef}
      lockRotations
      position={props.position ?? [0, 2, 0]}
    >
      <mesh castShadow scale={[1, 2.5, 1]}>
        <sphereGeometry args={[radius]} />
        <meshStandardMaterial color="pink" />
      </mesh>
    </RigidBody>
  )
}
