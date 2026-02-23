/* eslint-disable max-lines-per-function */
import {Cone} from '@react-three/drei'
import {useEffect, useState} from 'react'
import {Checkbox} from '../../card-checklist/types'
import {CardInfoStore} from '../../card-info/card-info-store'
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
    const h_frac = Math.random()
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

  // log in dev only
  if (process.env.NODE_ENV !== 'production') {
    if (points.length < count) {
      // eslint-disable-next-line no-console
      console.warn(
        `could only place ${points.length} spheres without overlap after maximum attempts.`
      )
    }
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
  const [spherePositions, updateSpherePositions] = useState<SphereData[]>([])
  const [shouldShrink, updateShouldShrink] = useState(false)
  const [cardData, updateCardData] = useState<{
    card: CardInfoStore['state']['card']['data']
    checklist: Checkbox[]
  }>({
    card: cardInfoState.data,
    checklist: checklist
  })

  // define core dimensions for calculations
  const coneHeight = 6.4
  const coneRadius = 2
  const sphereRadius = 0.2

  // the minimum distance between centers must be at least twice the sphere radius
  const minRequiredDistance = sphereRadius * 2.1

  useEffect(() => {
    if (!cardData) {
      return
    }
    let isCancelled = false

    const runSequence = async () => {
      //shrink spheres
      updateShouldShrink(true)

      //wait
      await new Promise(res => setTimeout(res, 500))
      if (isCancelled) {
        return
      }

      //update positions
      updateCardData({
        card: cardInfoState.data,
        checklist: checklist
      })
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

    runSequence()

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

  // define the position for the whole group in the scene
  const groupScenePosition: Position = [0.3, 4.2, -9.8]

  return (
    <group position={groupScenePosition}>
      {/* the cone is at relative to the parent group */}
      {/* 'as const' is used on args to satisfy TS tuple requirements */}
      <Cone args={[coneRadius, coneHeight, 32] as const}>
        {/* change opacity to see the cone*/}
        <meshStandardMaterial color="hotpink" transparent opacity={0} />
      </Cone>
      <Spheres
        cardData={cardData.card}
        spherePositions={spherePositions}
        checklist={cardData.checklist}
        shouldShrink={shouldShrink}
      />
    </group>
  )
}

const Spheres = ({
  cardData,
  shouldShrink,
  spherePositions,
  checklist
}: {
  cardData: CardInfoStore['state']['card']['data']
  shouldShrink: boolean
  spherePositions: SphereData[]
  checklist: Checkbox[]
}) => {
  const sphereBgColorCompleted = cardData?.bauble_color_completed || '#00ff00'
  const sphereBgColorNotCompleted =
    cardData?.bauble_color_not_completed || '#ff0000'

  const sphereTextColorCompleted =
    cardData?.bauble_text_color_completed || '#ffffff'
  const sphereTextColorNotCompleted =
    cardData?.bauble_text_color_not_completed || '#ffffff'

  return spherePositions.map((data, index) => {
    const {position, theta} = data
    const offsetX = theta / (2 * Math.PI)

    const checkbox = checklist?.[index]
    const isCompleted = checkbox?.is_completed
    const text = checkbox?.title || ''

    return (
      <BaseSphere
        key={index}
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
