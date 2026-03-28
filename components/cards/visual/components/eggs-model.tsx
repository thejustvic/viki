/* eslint-disable max-lines-per-function */

import {useGLTF} from '@react-three/drei'
import type {Mesh, MeshStandardMaterial} from 'three'

export type EggsGLTFResult = {
  nodes: {
    Egg01_Mat01_0: Mesh
    Egg02_Mat02_0: Mesh
    Egg03_Mat03_0: Mesh
    Egg04_Mat04_0: Mesh
    Egg05_Mat05_0: Mesh
    Egg06_Mat06_0: Mesh
    Egg07_Mat07_0: Mesh
    Egg08_Mat08_0: Mesh
    Egg09_Mat09_0: Mesh
    Egg10_Mat10_0: Mesh
  }
  materials: {
    Mat01: MeshStandardMaterial
    Mat02: MeshStandardMaterial
    Mat03: MeshStandardMaterial
    Mat04: MeshStandardMaterial
    Mat05: MeshStandardMaterial
    Mat06: MeshStandardMaterial
    Mat07: MeshStandardMaterial
    Mat08: MeshStandardMaterial
    Mat09: MeshStandardMaterial
    Mat10: MeshStandardMaterial
  }
}

export const useEggModels = (): EggsGLTFResult => {
  const {nodes, materials} = useGLTF(
    '/easter-eggs.glb'
  ) as unknown as EggsGLTFResult

  return {nodes, materials}
}
interface EggsModelProps {
  eggs: EggsGLTFResult
  item: number
}
export const EggsModel = ({item, eggs}: EggsModelProps) => {
  const {nodes, materials} = eggs

  switch (item) {
    case 1: {
      return (
        <mesh
          geometry={nodes.Egg01_Mat01_0.geometry}
          material={materials.Mat01}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0, 0]}
        />
      )
    }
    case 2: {
      return (
        <mesh
          geometry={nodes.Egg02_Mat02_0.geometry}
          material={materials.Mat02}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0, 0]}
        />
      )
    }
    case 3: {
      return (
        <mesh
          geometry={nodes.Egg03_Mat03_0.geometry}
          material={materials.Mat03}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0, 0]}
        />
      )
    }
    case 4: {
      return (
        <mesh
          geometry={nodes.Egg04_Mat04_0.geometry}
          material={materials.Mat04}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0, 0]}
        />
      )
    }
    case 5: {
      return (
        <mesh
          geometry={nodes.Egg05_Mat05_0.geometry}
          material={materials.Mat05}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0, 0]}
        />
      )
    }
    case 6: {
      return (
        <mesh
          geometry={nodes.Egg06_Mat06_0.geometry}
          material={materials.Mat06}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0, 0]}
        />
      )
    }
    case 7: {
      return (
        <mesh
          geometry={nodes.Egg07_Mat07_0.geometry}
          material={materials.Mat07}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0, 0]}
        />
      )
    }
    default: {
      return (
        <mesh
          geometry={nodes.Egg07_Mat07_0.geometry}
          material={materials.Mat07}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0, 0]}
        />
      )
    }
  }
}
