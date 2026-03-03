/* eslint-disable max-lines-per-function */

import {useCheckboxHandlers} from '@/components/checklist/checkbox/checkbox-handlers'
import {Checkbox} from '@/components/checklist/types'
import {Merged, Plane, useGLTF} from '@react-three/drei'
import {useFrame} from '@react-three/fiber'
import {easing} from 'maath'
import {useEffect, useMemo, useRef} from 'react'
import {
  type CanvasTexture,
  type Group,
  type Mesh,
  type MeshStandardMaterial
} from 'three'
import type {GLTF} from 'three-stdlib'
import {Card} from '../../types'
import {createTextTexture} from '../utils/create-text-texture'

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
  card: Card | null
  checklist: Checkbox[]
  shouldShrink: boolean
}

export const TulipInstances = ({
  positions,
  card,
  checklist,
  shouldShrink
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
            const text = checkbox?.title ?? ''
            return (
              <Tulip
                key={index}
                position={position}
                color={
                  isCompleted
                    ? (card?.tulip_color_completed ?? '')
                    : (card?.tulip_color_not_completed ?? '')
                }
                plateColor={
                  isCompleted
                    ? (card?.tulip_plate_color_completed ?? '')
                    : (card?.tulip_plate_color_not_completed ?? '')
                }
                plateTextColor={
                  isCompleted
                    ? (card?.tulip_plate_text_color_completed ?? '')
                    : (card?.tulip_plate_text_color_not_completed ?? '')
                }
                checkbox={checkbox}
                materials={materials}
                models={models}
                shouldShrink={shouldShrink}
                text={text}
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
  plateColor: string
  plateTextColor: string
  materials: {
    mFlowerBodyTulip: MeshStandardMaterial
    mFlowerTulip: MeshStandardMaterial
    EnvironmentAmbientLight: MeshStandardMaterial
  }
  models: any
  shouldShrink: boolean
  checkbox: Checkbox
  text: string
}

const Tulip = ({
  position,
  color,
  plateColor,
  plateTextColor,
  materials,
  models,
  shouldShrink,
  checkbox,
  text
}: TulipProps) => {
  const groupRef = useRef<Group>(null)
  const {updateCheckboxIsCompleted} = useCheckboxHandlers()

  useEffect(() => {
    if (materials.mFlowerTulip) {
      materials.mFlowerTulip.map = null

      materials.mFlowerTulip.metalness = 0.7 // 0 - not metal
      materials.mFlowerTulip.roughness = 0.7 // 1 - matte (standard for mesh)

      materials.mFlowerTulip.needsUpdate = true
    }
  }, [materials])

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

  const texture: CanvasTexture = useMemo(() => {
    return createTextTexture({
      text,
      color: plateTextColor,
      bgColor: plateColor,
      fontSize: 48,
      maxWidth: 440
    })
  }, [text, plateTextColor, plateColor])

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
      <Plane args={[2, 2]} position={[0, 8, 2]}>
        <meshStandardMaterial
          map={texture} // The texture now contains the background color and text color
          metalness={0.5}
          roughness={0.5}
          // color property MUST be absent if using a textured map for the main color
        />
      </Plane>
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
