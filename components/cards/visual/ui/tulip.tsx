/* eslint-disable max-lines-per-function */
import {ArrUtil} from '@/utils/arr-util'
import {Circle} from '@react-three/drei'
import {useFrame} from '@react-three/fiber'
import {easing} from 'maath'
import {useEffect, useMemo, useRef, useState} from 'react'
import {Group} from 'three'
import {Checkbox} from '../../card-checklist/types'
import {CardInfoStore} from '../../card-info/card-info-store'
import {LawnInstances} from '../components/lawn-instances'
import {TulipInstances} from '../components/tulip-instances'

interface Point {
  x: number
  z: number
}

const generateNonOverlappingPoints = ({
  numberOfTulips,
  fieldRadius,
  minRequiredDistance
}: {
  numberOfTulips: number
  fieldRadius: number
  minRequiredDistance: number
}): Point[] => {
  const points: Point[] = []
  const maxAttempts = 1000 // protection against infinite loop if there is not enough space

  for (let i = 0; i < numberOfTulips; i++) {
    let found = false
    let attempts = 0

    while (!found && attempts < maxAttempts) {
      attempts++

      // 1. generate a random point within a circle (Polar coordinates)
      const angle = Math.random() * Math.PI * 2
      // using sqrt to distribute evenly in a circle
      const radius = Math.sqrt(Math.random()) * fieldRadius

      const newPoint: Point = {
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius
      }

      // 2. check the distance to all existing points
      const isOverlapping = points.some(p => {
        const dx = p.x - newPoint.x
        const dz = p.z - newPoint.z
        const distance = Math.sqrt(dx * dx + dz * dz)
        return distance < minRequiredDistance
      })

      if (!isOverlapping) {
        points.push(newPoint)
        found = true
      }
    }
  }

  return points
}

export const Tulip = ({
  checklist,
  cardInfoState
}: {
  checklist: Checkbox[]
  cardInfoState: CardInfoStore['state']['card']
}) => {
  const fieldRef = useRef<Group>(null)
  const [positions, updatePositions] = useState<
    [x: number, y: number, z: number][]
  >([])
  const [shouldShrink, updateShouldShrink] = useState(false)
  const [cardData, updateCardData] = useState<{
    card: CardInfoStore['state']['card']['data']
    checklist: Checkbox[]
  }>({
    card: cardInfoState.data,
    checklist: checklist
  })

  const baseRadius = 10
  const referenceCount = 4
  const scaleFactor = Math.sqrt(
    Math.max(referenceCount, checklist.length) / referenceCount
  )
  const fieldRadius = baseRadius * scaleFactor

  const tulipRadius = 3
  const minRequiredDistance = tulipRadius * 2

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
        //shrink
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
          numberOfTulips: checklist.length ?? 0,
          fieldRadius,
          minRequiredDistance
        })

        const positions = calcPositions(newData)
        updatePositions(positions)

        //grow
        updateShouldShrink(false)
      }
    }
    void runSequence()

    return () => {
      isCancelled = true
    }
  }, [cardInfoState.data, checklist, fieldRadius, minRequiredDistance])

  const calcPositions = (newData: Point[]) => {
    const positions: [x: number, y: number, z: number][] = []

    newData.forEach(point => {
      positions.push([point.x, 0, point.z])
    })
    return positions
  }

  const lawnPositions = useMemo(() => {
    const positions: [x: number, y: number, z: number][] = []
    const squareSize = 20 - 0.25 // -0.25 for little overlap each other

    // fill a square area that is guaranteed to be larger than a circle
    const gridSteps = Math.ceil((fieldRadius * 2) / squareSize)
    const offset = (gridSteps * squareSize) / 2

    for (let i = 0; i <= gridSteps; i++) {
      for (let j = 0; j <= gridSteps; j++) {
        positions.push([i * squareSize - offset, 0, j * squareSize - offset])
      }
    }

    return positions
  }, [fieldRadius])

  useFrame((_state, delta) => {
    if (fieldRef.current === null) {
      return
    }
    const targetScale = shouldShrink ? 0.5 : 1
    easing.damp3(
      fieldRef.current.scale,
      [targetScale, targetScale, targetScale],
      0.25,
      delta
    )
  })

  return (
    <group scale={0.1} position={[0, 0, -3]}>
      <group ref={fieldRef} scale={0.5}>
        <Circle
          args={[fieldRadius, 64]}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 2, 0]}
          receiveShadow
        >
          <meshStandardMaterial color="#2d5a27" transparent opacity={0} />
        </Circle>
        <LawnInstances positions={lawnPositions} />
      </group>
      <TulipInstances
        checklist={cardData.checklist}
        positions={positions}
        shouldShrink={shouldShrink}
        colorCompleted={cardData?.card?.bauble_color_completed ?? '#00ff00'}
        colorNotCompleted={
          cardData?.card?.bauble_color_not_completed ?? '#ff0000'
        }
      />
    </group>
  )
}
