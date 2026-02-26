/* eslint-disable max-lines-per-function */
import {ArrUtil} from '@/utils/arr-util'
import {Cone} from '@react-three/drei'
import {useFrame} from '@react-three/fiber'
import {easing} from 'maath'
import {useEffect, useRef, useState} from 'react'
import {Group} from 'three'
import {Checkbox} from '../../card-checklist/types'
import {CardInfoStore} from '../../card-info/card-info-store'
import {TreeModel} from '../components/tree-model'
import {BaseSphere} from './base-sphere'

type Position = [number, number, number]

const randomRange = (min: number, max: number): number => {
  return Math.random() * (max - min) + min
}

/**
 * helper function to calculate distance between two 3d points
 */
const distanceBetweenPoints = (p1: Position, p2: Position): number => {
  const dx = p1[0] - p2[0]
  const dy = p1[1] - p2[1]
  const dz = p1[2] - p2[2]
  return Math.sqrt(dx * dx + dy * dy + dz * dz)
}

interface SphereData {
  position: Position
  theta: number
}

/**
 * generates random points on the cone's surface using rejection sampling to prevent overlap.
 */
const generateNonOverlappingPoints = ({
  numberOfSpheres: count,
  coneRadius,
  coneHeight,
  minRequiredDistance: minDistance
}: {
  numberOfSpheres: number
  coneRadius: number
  coneHeight: number
  minRequiredDistance: number // minimum center-to-center distance required
}): SphereData[] => {
  const points: SphereData[] = []
  const maxAttemptsPerPoint = 1000 // prevent infinite loops if cone is full
  let attempts = 0

  while (points.length < count && attempts < count * maxAttemptsPerPoint) {
    attempts++

    // 1. generate a candidate random point
    const topThreshold = 0.2 // e.g. 0.2 to remove the top 20% of cone
    const h_frac = (1 - Math.sqrt(Math.random())) * (1 - topThreshold)
    const theta = randomRange(0, Math.PI * 2)
    const sphereY = -coneHeight / 2 + h_frac * coneHeight
    const currentRadius = coneRadius * (1 - h_frac)
    const sphereX = currentRadius * Math.cos(theta)
    const sphereZ = currentRadius * Math.sin(theta)
    const candidatePoint: Position = [sphereX, sphereY, sphereZ]

    // 2. check for overlap with existing points
    let isOverlapping = false
    for (const existingPoint of points) {
      if (
        distanceBetweenPoints(candidatePoint, existingPoint.position) <
        minDistance
      ) {
        isOverlapping = true
        break // overlap found, reject this point
      }
    }

    // 3. if no overlap, accept the point
    if (!isOverlapping) {
      points.push({position: candidatePoint, theta: theta})
      attempts = 0 // reset attempts counter for the *next* point
    }
  }

  if (points.length < count) {
    console.warn(
      `could only place ${points.length} spheres without overlap after maximum attempts.`
    )
  }

  return points
}

export const ConeWithSpheres = ({
  checklist,
  cardInfoState
}: {
  checklist: Checkbox[]
  cardInfoState: CardInfoStore['state']['card']
}) => {
  const treeRef = useRef<Group>(null)
  const [spherePositions, updateSpherePositions] = useState<SphereData[]>([])
  const [shouldShrink, updateShouldShrink] = useState(false)
  const [cardData, updateCardData] = useState<{
    card: CardInfoStore['state']['card']['data']
    checklist: Checkbox[]
  }>({
    card: cardInfoState.data,
    checklist: checklist
  })

  const baseHeight = 2.5
  const baseRadius = 1
  const baseScale = 0.15
  const referenceCount = 15
  const scaleFactor = Math.sqrt(
    Math.max(referenceCount, checklist.length) / referenceCount
  )
  const coneHeight = baseHeight * scaleFactor
  const coneRadius = baseRadius * scaleFactor
  const dynamicTreeScale = baseScale * scaleFactor
  const baseTreeScale = 0.15
  const treeGroundY = 0.5
  const scaleDiff = dynamicTreeScale - baseTreeScale
  const dynamicTreeY = treeGroundY - scaleDiff
  const coneGroundY = 1.2
  // Since the object grows from the center, raise its center by half the height
  const dynamicConeY = coneGroundY + scaleDiff + coneHeight / 2
  const sphereRadius = 0.15
  const minRequiredDistance = sphereRadius * 3

  useEffect(() => {
    if (!cardData) {
      return
    }
    let isCancelled = false

    const runSequence = async () => {
      const notEqualButSameLength =
        ArrUtil.areListsNotEqual(checklist, cardData.checklist) &&
        checklist.length === cardData.checklist.length

      if (!notEqualButSameLength) {
        //shrink spheres
        updateShouldShrink(true)
        //wait
        await new Promise(res => setTimeout(res, 500))
        if (isCancelled) {
          return
        }
      }
      //updates
      updateCardData({
        card: cardInfoState.data,
        checklist: checklist
      })
      if (!notEqualButSameLength) {
        const newData = generateNonOverlappingPoints({
          numberOfSpheres: checklist.length ?? 0,
          coneRadius,
          coneHeight,
          minRequiredDistance
        })
        updateSpherePositions(newData)
        //grow spheres
        updateShouldShrink(false)
      }
    }
    void runSequence()

    return () => {
      isCancelled = true
    }
  }, [
    cardInfoState.data,
    checklist,
    coneRadius,
    coneHeight,
    minRequiredDistance
  ])

  useFrame((_state, delta) => {
    if (treeRef.current) {
      easing.damp3(
        treeRef.current.scale,
        [dynamicTreeScale, dynamicTreeScale, dynamicTreeScale],
        0.25,
        delta
      )
      easing.damp(treeRef.current.position, 'y', dynamicTreeY, 0.25, delta)
    }
  })

  return (
    <>
      <group position={[0, dynamicConeY, -10]}>
        {/* the cone is at relative to the parent group */}
        <Cone args={[coneRadius, coneHeight, 32] as const}>
          {/* change opacity to see the cone*/}
          <meshStandardMaterial color="hotpink" transparent opacity={0} />
        </Cone>
        <Spheres
          radius={sphereRadius}
          cardData={cardData.card}
          spherePositions={spherePositions}
          checklist={cardData.checklist}
          shouldShrink={shouldShrink}
        />
      </group>
      <group ref={treeRef} position={[0, treeGroundY, -10]} scale={baseScale}>
        <TreeModel />
      </group>
    </>
  )
}

const Spheres = ({
  radius,
  cardData,
  shouldShrink,
  spherePositions,
  checklist
}: {
  radius: number
  cardData: CardInfoStore['state']['card']['data']
  shouldShrink: boolean
  spherePositions: SphereData[]
  checklist: Checkbox[]
}) => {
  const sphereBgColorCompleted = cardData?.bauble_color_completed ?? '#00ff00'
  const sphereBgColorNotCompleted =
    cardData?.bauble_color_not_completed ?? '#ff0000'

  const sphereTextColorCompleted =
    cardData?.bauble_text_color_completed ?? '#ffffff'
  const sphereTextColorNotCompleted =
    cardData?.bauble_text_color_not_completed ?? '#ffffff'

  return spherePositions.map((data, index) => {
    const {position, theta} = data
    const offsetX = theta / (2 * Math.PI)

    const checkbox = checklist?.[index]
    const isCompleted = checkbox?.is_completed
    const text = checkbox?.title ?? ''

    return (
      <BaseSphere
        key={index}
        radius={radius}
        shouldShrink={shouldShrink}
        position={position}
        text={text}
        checkbox={checkbox}
        sphereColor={
          isCompleted ? sphereBgColorCompleted : sphereBgColorNotCompleted
        }
        textColor={
          isCompleted ? sphereTextColorCompleted : sphereTextColorNotCompleted
        }
        textOffsetX={offsetX}
      />
    )
  })
}
