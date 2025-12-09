import {RigidBody} from '@react-three/rapier'

export const Floor = ({color = 'white'}) => {
  // a HUGE static block below the world
  return (
    <RigidBody type="fixed" colliders="cuboid" position={[0, 0, 0]}>
      <mesh receiveShadow>
        <boxGeometry args={[1000, 1, 1000]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </RigidBody>
  )
}
