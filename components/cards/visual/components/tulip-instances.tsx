/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
import {useCheckboxHandlers} from '@/components/checklist/checkbox/checkbox-handlers'
import {Checkbox} from '@/components/checklist/types'
import {useGlobalStore} from '@/components/global-provider/global-store'
import {Center, Merged, RoundedBox, Text3D, useGLTF} from '@react-three/drei'
import {useFrame} from '@react-three/fiber'
import {easing} from 'maath'
import {observer} from 'mobx-react-lite'
import {useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react'
import {
  DoubleSide,
  Shape,
  type Group,
  type Mesh,
  type MeshStandardMaterial
} from 'three'
import type {GLTF} from 'three-stdlib'
import {Card, GameModeType} from '../../types'
import type {PositionType} from '../ui/tulip'
import {EggsGLTFResult, EggsModel, useEggModels} from './eggs-model'

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
  positions: PositionType[]
  card: Card | null
  checklist: Checkbox[] | undefined
  shouldShrink: boolean
  isLocked: boolean
  eggsCount: number
}

export const TulipInstances = observer(
  ({positions, checklist, card, shouldShrink, isLocked, eggsCount}: Props) => {
    const [state, store] = useGlobalStore()
    const {nodes, materials} = useGLTF(
      '/tulip_flower.glb'
    ) as unknown as GLTFResult
    const [eggs, setEggs] = useState<boolean[]>(() =>
      new Array(eggsCount).fill(false)
    )

    useEffect(() => {
      const count = eggs.length - eggs.filter(Boolean).length
      store.setEggsLeftToCollect(count)
    }, [eggs])

    const toggleEgg = (index: number) => {
      setEggs(prev => prev.map((item, i) => (i === index ? !item : item)))
    }

    const instances = useMemo(
      () => ({
        FlowerBody: nodes.Object_3,
        FlowerTulip: nodes.Object_4,
        FlowerPot: nodes.Object_5
      }),
      [nodes]
    )

    const eggsModels = useEggModels()

    return (
      <Merged meshes={instances} frustumCulled={false}>
        {(models: any) => (
          <>
            {positions.map((position, index) => {
              const eggState = eggs[index]
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
                  text={text}
                  checkbox={checkbox}
                  materials={materials}
                  models={models}
                  shouldShrink={shouldShrink}
                  isLocked={isLocked}
                  eggState={eggState}
                  toggleEgg={() => toggleEgg(index)}
                  eggsModels={eggsModels}
                  gameMode={state.gameMode}
                />
              )
            })}
          </>
        )}
      </Merged>
    )
  }
)

interface TulipProps {
  gameMode: GameModeType[number]
  eggState: boolean
  toggleEgg: () => void
  eggsModels: EggsGLTFResult
  position: PositionType
  materials: {
    mFlowerBodyTulip: MeshStandardMaterial
    mFlowerTulip: MeshStandardMaterial
    EnvironmentAmbientLight: MeshStandardMaterial
  }
  models: any
  shouldShrink: boolean
  checkbox: Checkbox | undefined
  color: string
  plateColor: string
  plateTextColor: string
  text: string
  isLocked: boolean
}

const useCustomTulipMaterial = (material: MeshStandardMaterial) => {
  useLayoutEffect(() => {
    if (material) {
      material.alphaMap = material.map // texture is now responsible for transparency of details
      material.map = null // removing the gradient color map

      // setting the "visual transmission" of color:
      material.metalness = 0.1 // 0 - not metal
      material.roughness = 0.5 // 1 - matte (standard for mesh)

      material.needsUpdate = true
    }
  }, [material])
}

const Tulip = ({
  gameMode,
  eggState,
  toggleEgg,
  eggsModels,
  position,
  materials,
  models,
  shouldShrink,
  checkbox,
  color,
  plateColor,
  plateTextColor,
  text,
  isLocked
}: TulipProps) => {
  useCustomTulipMaterial(materials.mFlowerTulip)
  const {updateCheckboxIsCompleted} = useCheckboxHandlers()
  const groupRef = useRef<Group>(null)
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
        if (isLocked) {
          return
        }
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
      <TextWithBg
        text={text}
        plateTextColor={plateTextColor}
        plateBgColor={plateColor}
      />
      {eggState !== undefined && gameMode === 'egg-collecting' && (
        <Egg
          isLocked={isLocked}
          eggState={eggState}
          toggleEgg={toggleEgg}
          eggsModels={eggsModels}
        />
      )}
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

const getRandom = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min

interface EggProps {
  isLocked: boolean
  eggState: boolean
  toggleEgg: () => void
  eggsModels: EggsGLTFResult
}

const Egg = ({isLocked, eggState, toggleEgg, eggsModels}: EggProps) => {
  const itemNumber = getRandom(1, 7)
  const leftPosition: PositionType = [-1.3, 2, 0.7]
  const rightPosition: PositionType = [1.3, 2, 0.7]
  const randomPosition = Math.random() > 0.5 ? leftPosition : rightPosition
  if (eggState) {
    return
  }
  return (
    <mesh
      onClick={event => {
        if (isLocked) {
          return
        }
        // prevent click from bleeding through to objects behind
        event.stopPropagation()
        toggleEgg()
      }}
    >
      <group scale={0.6} position={randomPosition}>
        <EggsModel item={itemNumber} eggs={eggsModels} />
      </group>
    </mesh>
  )
}

interface TextWithBgProps {
  text: string
  plateTextColor: string
  plateBgColor: string
}

const TextWithBg = ({text, plateTextColor, plateBgColor}: TextWithBgProps) => {
  const wrappedText = useMemo(() => wrapText(text, 24), [text])

  const envelopeShape = useMemo(() => {
    const shape = new Shape()
    const width = 4 // width as in RoundedBox
    const height = 1.2 // valve height (distance from top to spout)

    shape.moveTo(-width / 2, 0) // upper left corner
    shape.lineTo(width / 2, 0) // upper right corner
    shape.lineTo(0, -height) // triangle nose (center bottom)
    shape.lineTo(-width / 2, 0) // closing
    return shape
  }, [])

  const heartShape = useMemo(() => {
    const shape = new Shape()
    const x = 0,
      y = 0
    // draw a heart using Bezier curves
    shape.moveTo(x, y)
    shape.bezierCurveTo(x - 0.2, y + 0.2, x - 0.5, y, x, y - 0.5)
    shape.bezierCurveTo(x + 0.5, y, x + 0.2, y + 0.2, x, y)
    return shape
  }, [])

  return (
    <group scale={1} position={[0, 2.5, 2]} rotation={[-Math.PI / 6, 0, 0]}>
      {/* <Text fontSize={0.3} anchorX="center" anchorY="middle">
          {wrappedText}
          <meshStandardMaterial color={plateTextColor} />
        </Text> */}
      <Center key={wrappedText}>
        <Text3D
          font={'/OpenSans_Regular.json'}
          size={0.2}
          height={0.02}
          bevelEnabled
          bevelSize={0.01}
          bevelThickness={0.01}
          curveSegments={1}
          bevelSegments={1}
        >
          {wrappedText}
          <meshStandardMaterial color={plateTextColor} />
        </Text3D>
      </Center>
      <RoundedBox args={[4, 2, 0.02]} radius={0.02} position={[0, 0, -0.3]}>
        <meshStandardMaterial color={plateBgColor} />
      </RoundedBox>
      <mesh position={[0, 1, -0.28]}>
        <shapeGeometry args={[envelopeShape]} />
        <meshStandardMaterial
          color={plateBgColor}
          side={DoubleSide}
          emissive={plateBgColor}
          emissiveIntensity={-0.5}
        />
      </mesh>
      <mesh position={[1.5, -0.3, -0.26]} scale={1}>
        <shapeGeometry args={[heartShape]} />
        <meshStandardMaterial color="#ff6beb" />
      </mesh>
    </group>
  )
}

export const wrapText = (str: string, width: number): string => {
  const words = str.replace(/\n/g, ' ').split(' ')
  const lines: string[] = []
  let currentLine = ''

  for (const word of words) {
    // if the word itself is longer than the limit, we cut it forcibly
    if (word.length > width) {
      // add what managed to collect to the current line
      if (currentLine) {
        lines.push(currentLine.trim())
      }

      // split a long word into parts by width
      const wordChunks = word.match(new RegExp(`.{1,${width}}`, 'g')) ?? []

      // add all parts except the last one to separate lines
      const lastChunk = wordChunks.pop()
      lines.push(...wordChunks)
      currentLine = lastChunk + ' ' // the last piece becomes the beginning of a new line
      continue
    }

    // check if the word fits in the current line (+1 for a space)
    if ((currentLine + word).length <= width) {
      currentLine += word + ' '
    } else {
      // if it doesn't fit - close the line and start a new one
      lines.push(currentLine.trim())
      currentLine = word + ' '
    }
  }

  if (currentLine) {
    lines.push(currentLine.trim())
  }

  // limit to 4 lines with ellipsis
  if (lines.length > 4) {
    let lastLine = lines[3]
    // if the string is too long to add "...", trim it a bit
    if (lastLine.length > width - 3) {
      lastLine = lastLine.slice(0, width - 3)
    }
    return [...lines.slice(0, 3), lastLine + '...'].join('\n')
  }

  return lines.join('\n')
}
