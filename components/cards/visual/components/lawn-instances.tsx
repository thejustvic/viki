import {Merged, useGLTF} from '@react-three/drei'
import {useMemo} from 'react'
import type {Mesh, MeshStandardMaterial} from 'three'
import type {GLTF} from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    Plane002_grass_0: Mesh
    Plane10002_Soil_0: Mesh
  }
  materials: {
    grass: MeshStandardMaterial
    Soil: MeshStandardMaterial
  }
}

interface Props {
  positions: [x: number, y: number, z: number][]
}

export const LawnInstances = ({positions}: Props) => {
  const {nodes, materials} = useGLTF('/lawn-model.glb') as unknown as GLTFResult

  const instances = useMemo(
    () => ({
      Grass: nodes.Plane002_grass_0,
      Soil: nodes.Plane10002_Soil_0
    }),
    [nodes]
  )

  return (
    <Merged meshes={instances}>
      {(models: any) => (
        <>
          {positions.map((pos, index) => (
            <group key={index} position={pos} scale={0.1}>
              <models.Grass
                material={materials.grass}
                position={[-77.066, 0, 2.362]}
                rotation={[-0.709, -1.512, -0.708]}
                scale={[5.483, 0.667, 5.483]}
              />
              <models.Soil
                receiveShadow={false}
                material={materials.Soil}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={100}
              />
            </group>
          ))}
        </>
      )}
    </Merged>
  )
}
