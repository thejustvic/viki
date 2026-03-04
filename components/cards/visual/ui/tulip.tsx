/* eslint-disable max-lines-per-function */
import {ArrUtil} from '@/utils/arr-util'
import {useFrame} from '@react-three/fiber'
import {easing} from 'maath'
import {useEffect, useMemo, useRef, useState} from 'react'
import {Group} from 'three'
import {Checkbox} from '../../card-checklist/types'
import {CardInfoStore} from '../../card-info/card-info-store'
import {Card} from '../../types'
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

      const newPoint: Point = {
        x: (Math.random() * 2 - 1) * fieldRadius,
        z: (Math.random() * 2 - 1) * fieldRadius
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
    card: Card | null
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
      positions.push([point.x, -1, point.z])
    })
    return positions
  }

  const lawnPositions = useMemo(() => {
    const positions: [x: number, y: number, z: number][] = []
    const squareSize = 20 - 0.25 // -0.25 for little overlap each other

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
    <group scale={1} position={[0, 0, -3]}>
      <group ref={fieldRef} scale={0.5}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 10, 0]}>
          <planeGeometry args={[fieldRadius * 2, fieldRadius * 2]} />
          <meshStandardMaterial color="#2d5a27" transparent opacity={0} />
        </mesh>
        <LawnInstances positions={lawnPositions} />
      </group>
      <TulipInstances
        card={cardData.card}
        checklist={cardData.checklist}
        positions={positions}
        shouldShrink={shouldShrink}
      />
    </group>
  )
}
