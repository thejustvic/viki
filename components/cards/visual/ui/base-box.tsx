import {CuboidCollider, RapierRigidBody, RigidBody} from '@react-three/rapier'
import {useRef} from 'react'

interface BaseBoxProps {
  position: [number, number, number]
  args?: [number, number, number] // box geometry arguments [width, height, depth]
  color?: string
  // If you were passing other standard mesh props like scale or rotation,
  // you would list them explicitly here too.
}

const BaseBox = ({
  args = [1, 1, 1],
  color = 'gray',
  ...props
}: BaseBoxProps) => {
  const rigidBodyRef = useRef<RapierRigidBody>(null)

  // Extract dimensions for the CuboidCollider from the args prop
  // Fallbacks handle cases where args might be undefined if defaults weren't used
  const [width, height, depth] = args || [1, 1, 1]
  // Rapier colliders expect half-extents (half the width/height/depth)
  const halfExtents: [number, number, number] = [
    width / 2,
    height / 2,
    depth / 2
  ]

  return (
    <RigidBody
      ref={rigidBodyRef}
      type="fixed"
      colliders={false}
      position={props.position}
      onCollisionEnter={e => {
        console.log('Collision started:', e)
      }}
    >
      <mesh castShadow>
        <boxGeometry args={args} />
        <meshStandardMaterial color={color} />
      </mesh>

      <CuboidCollider args={halfExtents} />
    </RigidBody>
  )
}

export default BaseBox
