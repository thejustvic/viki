import {useCheckboxHandlers} from '@/components/checklist/checkbox/checkbox-handlers'
import {Checkbox} from '@/components/checklist/types'
import {Merged, useGLTF} from '@react-three/drei'
import {useFrame} from '@react-three/fiber'
import {easing} from 'maath'
import {useMemo, useRef} from 'react'
import type {Group, Mesh, MeshStandardMaterial} from 'three'
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
  positions: [x: number, y: number, z: number][]
  checklist: Checkbox[]
  shouldShrink: boolean
  colorCompleted: string
  colorNotCompleted: string
}

export const TulipInstances = ({
  positions,
  checklist,
  shouldShrink,
  colorCompleted,
  colorNotCompleted
}: Props) => {
  const {nodes, materials} = useGLTF(
    '/tulip_flower.glb'
  ) as unknown as GLTFResult

  const instances = useMemo(
    () => ({
      FlowerBody: nodes.Object_3,
      FlowerTulip: nodes.Object_4,
      FlowerPot: nodes.Object_5
    }),
    [nodes]
  )

  return (
    <Merged meshes={instances} frustumCulled={false}>
      {(models: any) => (
        <>
          {positions.map((position, index) => {
            const checkbox = checklist?.[index]
            const isCompleted = checkbox?.is_completed
            return (
              <Tulip
                key={index}
                position={position}
                color={isCompleted ? colorCompleted : colorNotCompleted}
                checkbox={checkbox}
                materials={materials}
                models={models}
                shouldShrink={shouldShrink}
              />
            )
          })}
        </>
      )}
    </Merged>
  )
}

interface TulipProps {
  position: [x: number, y: number, z: number]
  color: string
  materials: {
    mFlowerBodyTulip: MeshStandardMaterial
    mFlowerTulip: MeshStandardMaterial
    EnvironmentAmbientLight: MeshStandardMaterial
  }
  models: any
  shouldShrink: boolean
  checkbox: Checkbox
}

const Tulip = ({
  position,
  color,
  materials,
  models,
  shouldShrink,
  checkbox
}: TulipProps) => {
  const groupRef = useRef<Group>(null)
  const {updateCheckboxIsCompleted} = useCheckboxHandlers()

  useFrame((_state, delta) => {
    if (!groupRef.current) {
      return
    }

    const targetScale = shouldShrink ? 0 : 1

    easing.damp3(
      groupRef.current.scale,
      [targetScale, targetScale, targetScale],
      0.25,
      delta
    )
  })

  return (
    <group
      scale={0}
      ref={groupRef}
      position={position}
      onClick={event => {
        // prevent click from bleeding through to objects behind
        event.stopPropagation()
        if (checkbox) {
          updateCheckboxIsCompleted(!checkbox.is_completed, checkbox.id)
        }
      }}
    >
      <models.FlowerBody
        material={materials.mFlowerBodyTulip}
        rotation={[-Math.PI / 2, 0, 0]}
        castShadow
      />
      <models.FlowerTulip
        rotation={[-Math.PI / 2, 0, 0]}
        material={materials.mFlowerTulip}
        color={color}
        castShadow
      />
      {/* 
          <models.FlowerPot // this is the model for a flower pot
            material={materials.EnvironmentAmbientLight}
            rotation={[-Math.PI / 2, 0, 0]}
            castShadow
          /> 
      */}
    </group>
  )
}
