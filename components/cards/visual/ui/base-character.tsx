import {useFrame, useThree} from '@react-three/fiber'
import {BallCollider, RapierRigidBody, RigidBody} from '@react-three/rapier'
import {useRef} from 'react'
import * as THREE from 'three'
import {usePlayerControls} from '../utils/helpers'

const SPEED = 5

interface BaseCharacterProps {
  position?: [number, number, number]
  args?: [number] // sphere geometry args expects a single radius number
}

const BaseCharacter = (props: BaseCharacterProps) => {
  const direction = new THREE.Vector3()
  const frontVector = new THREE.Vector3()
  const sideVector = new THREE.Vector3()

  const {camera} = useThree()
  const rigidBodyRef = useRef<RapierRigidBody>(null)

  const {forward, backward, left, right, jump} = usePlayerControls()

  useFrame(() => {
    const body = rigidBodyRef.current
    if (!body) return

    const currentVelocity = body.linvel()

    // 1. Move the camera to the player's position
    const playerPosition = body.translation()
    // Use the player's position to set the camera position
    camera.position.set(playerPosition.x, playerPosition.y, playerPosition.z)

    // 2. Calculate movement direction based on keyboard input and camera orientation
    frontVector.set(0, 0, Number(backward) - Number(forward))
    sideVector.set(Number(left) - Number(right), 0, 0)

    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      .multiplyScalar(SPEED)
      .applyEuler(camera.rotation)

    // 3. Apply the calculated velocity to the character, maintaining Y velocity (gravity/jumping)
    body.setLinvel(
      {x: direction.x, y: currentVelocity.y, z: direction.z},
      true // wake up the body
    )

    // 4. Handle Jumping
    if (jump && Math.abs(currentVelocity.y) < 0.05) {
      body.setLinvel(
        {x: currentVelocity.x, y: 5, z: currentVelocity.z},
        true // wake up the body
      )
    }
  })

  const radius = props.args?.[0] ?? 1

  const initialPosition = props.position || [0, radius + 0.1, 0] // Ensure it spawns slightly above Y=0

  return (
    <RigidBody
      ref={rigidBodyRef}
      colliders={false} // manually define collider below
      mass={1}
      type="dynamic"
      position={initialPosition}
      lockRotations // common for character controllers to prevent tipping over
    >
      <mesh castShadow>
        <sphereGeometry args={[radius]} />
        <meshStandardMaterial color="#FFFF00" />
      </mesh>

      <BallCollider args={[radius]} />
    </RigidBody>
  )
}

export default BaseCharacter
