import {RigidBody} from '@react-three/rapier'

export const Floor = ({color = 'white'}) => {
  return (
    <RigidBody type="fixed" colliders="cuboid" position={[0, -0.01, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </RigidBody>
  )
}
