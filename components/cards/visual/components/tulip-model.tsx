import {useGLTF} from '@react-three/drei'
import type {Mesh, MeshStandardMaterial} from 'three'
import type {GLTF} from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    Object_3: Mesh
    Object_4: Mesh
    Object_5: Mesh
  }
  materials: {
    mFlowerBodyTulip: MeshStandardMaterial
    mFlowerTulip: MeshStandardMaterial
    EnvironmentAmbientLight: MeshStandardMaterial
  }
}

interface Props {
  color: string
}

export const TulipModel = ({color}: Props) => {
  const {nodes, materials} = useGLTF(
    '/tulip_flower.glb'
  ) as unknown as GLTFResult

  return (
    <group>
      <mesh
        geometry={nodes.Object_3.geometry}
        material={materials.mFlowerBodyTulip}
        rotation={[-Math.PI / 2, 0, 0]}
        castShadow
      />
      <mesh
        geometry={nodes.Object_4.geometry}
        rotation={[-Math.PI / 2, 0, 0]}
        material={materials.mFlowerTulip}
        castShadow
      >
        <meshStandardMaterial attach="material" color={color} />
      </mesh>
      {/* <mesh // this is the mesh for a flower pot
        geometry={nodes.Object_5.geometry}
        material={materials.EnvironmentAmbientLight}
        rotation={[-Math.PI / 2, 0, 0]}
      /> */}
    </group>
  )
}
