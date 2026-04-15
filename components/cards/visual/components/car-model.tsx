/* eslint-disable max-lines-per-function */
import {useGLTF} from '@react-three/drei'
import {useFrame, useGraph} from '@react-three/fiber'
import {useEffect, useMemo, useRef} from 'react'
import {Group, Mesh, MeshStandardMaterial} from 'three'
import {GLTF, SkeletonUtils} from 'three-stdlib'
import {ModelCharacteristics} from '../ui/use-character-logic'
import {usePlayerControls} from '../utils/helpers'
import {useMoveForwardCamera} from './model-helpers'

type GLTFResult = GLTF & {
  nodes: {
    Cube006: Mesh
    Cube006_1: Mesh
    Cube006_2: Mesh
    Cube006_3: Mesh
    Cube006_4: Mesh
    Cube006_5: Mesh
    Cube015: Mesh
    Cube015_1: Mesh
    Cube010: Mesh
    Cube010_1: Mesh
    Cube013: Mesh
    Cube013_1: Mesh
    Cube014: Mesh
    Cube014_1: Mesh
  }
  materials: {
    ['body light blue']: MeshStandardMaterial
    ['body black']: MeshStandardMaterial
    windows: MeshStandardMaterial
    ['body grey']: MeshStandardMaterial
    headlights: MeshStandardMaterial
    ['rear lights']: MeshStandardMaterial
    tires: MeshStandardMaterial
    wheels: MeshStandardMaterial
  }
}

interface CarModelProps {
  characteristics: ModelCharacteristics
}
export const CarModel = ({characteristics}: CarModelProps) => {
  const group = useRef<Group>(null)
  const {scene} = useGLTF('/car.glb')
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene])
  const {nodes, materials} = useGraph(clone) as unknown as GLTFResult

  const controls = usePlayerControls({
    is3DSceneLocked: characteristics.is3DSceneLocked
  })

  useMoveForwardCamera(group, characteristics)

  useEffect(() => {
    // changing the rotation order for the front wheels
    if (wheelFL_Group.current) {
      wheelFL_Group.current.rotation.reorder('YXZ')
    }
    if (wheelFR_Group.current) {
      wheelFR_Group.current.rotation.reorder('YXZ')
    }
  }, [])

  const wheelFL_Group = useRef<Group>(null)
  const wheelFR_Group = useRef<Group>(null)
  const wheelRL_Group = useRef<Group>(null)
  const wheelRR_Group = useRef<Group>(null)

  useFrame((_state, delta) => {
    const isMoving =
      controls.forward || controls.backward || controls.left || controls.right

    // wheel rotation
    if (isMoving) {
      const speed = characteristics.speed
      const direction = 1
      const rotationAmount = speed * delta * direction

      const allWheels = [
        wheelFL_Group,
        wheelFR_Group,
        wheelRL_Group,
        wheelRR_Group
      ]
      allWheels.forEach(ref => {
        if (ref.current) {
          ref.current.rotation.x += rotationAmount
        }
      })
    }
  })

  return (
    <group ref={group} dispose={null} scale={0.3}>
      <group position={[0, 1.8, -0.1]}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube006.geometry}
          material={materials['body light blue']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube006_1.geometry}
          material={materials['body black']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube006_2.geometry}
          material={materials.windows}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube006_3.geometry}
          material={materials['body grey']}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube006_4.geometry}
          material={materials.headlights}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube006_5.geometry}
          material={materials['rear lights']}
        />
      </group>
      <group ref={wheelFL_Group} position={[-1.725, 0.858, 1.745]}>
        {/** front left */}
        <mesh
          geometry={nodes.Cube010.geometry}
          material={materials.tires}
          castShadow
          receiveShadow
        />
        <mesh
          geometry={nodes.Cube010_1.geometry}
          material={materials.wheels}
          castShadow
          receiveShadow
        />
      </group>
      <group ref={wheelFR_Group} position={[1.725, 0.858, 1.745]}>
        {/** front right */}
        <mesh
          geometry={nodes.Cube014.geometry}
          material={materials.tires}
          castShadow
          receiveShadow
        />
        <mesh
          geometry={nodes.Cube014_1.geometry}
          material={materials.wheels}
          castShadow
          receiveShadow
        />
      </group>
      <group ref={wheelRL_Group} position={[1.724, 0.858, -1.455]}>
        {/** back left */}
        <mesh
          geometry={nodes.Cube015.geometry}
          material={materials.tires}
          castShadow
          receiveShadow
        />
        <mesh
          geometry={nodes.Cube015_1.geometry}
          material={materials.wheels}
          castShadow
          receiveShadow
        />
      </group>
      <group ref={wheelRR_Group} position={[-1.722, 0.858, -1.455]}>
        {/** back right */}
        <mesh
          geometry={nodes.Cube013.geometry}
          material={materials.tires}
          castShadow
          receiveShadow
        />
        <mesh
          geometry={nodes.Cube013_1.geometry}
          material={materials.wheels}
          castShadow
          receiveShadow
        />
      </group>
    </group>
  )
}
