/* eslint-disable max-lines-per-function */
import {useCheckboxHandlers} from '@/components/checklist/checkbox/checkbox-handlers'
import {ArrUtil} from '@/utils/arr-util'
import {Circle} from '@react-three/drei'
import {useFrame} from '@react-three/fiber'
import {easing} from 'maath'
import {useEffect, useRef, useState} from 'react'
import {Group} from 'three'
import {Checkbox} from '../../card-checklist/types'
import {CardInfoStore} from '../../card-info/card-info-store'
import {TulipModel} from '../components/tulip-model'

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
  const [tulipPositions, updateTulipPositions] = useState<Point[]>([])
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

  const tulipRadius = 2
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
        updateTulipPositions(newData)
        //grow
        updateShouldShrink(false)
      }
    }
    void runSequence()

    return () => {
      isCancelled = true
    }
  }, [cardInfoState.data, checklist, fieldRadius, minRequiredDistance])

  useFrame((_state, delta) => {
    if (fieldRef.current === null) {
      return
    }
    const targetScale = shouldShrink ? 0.2 : 1
    easing.damp3(
      fieldRef.current.scale,
      [targetScale, targetScale, targetScale],
      0.25,
      delta
    )
  })

  return (
    <group scale={0.1} position={[0, 0.5, -7]}>
      <group ref={fieldRef}>
        <Circle
          args={[fieldRadius + 10, 64]}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.5, 0]}
          receiveShadow
        >
          <meshStandardMaterial color="#2d5a27" />
        </Circle>
      </group>
      <Tulips
        cardData={cardData.card}
        tulipPositions={tulipPositions}
        checklist={cardData.checklist}
        shouldShrink={shouldShrink}
      />
    </group>
  )
}

const Tulips = ({
  cardData,
  tulipPositions,
  checklist,
  shouldShrink
}: {
  cardData: CardInfoStore['state']['card']['data']
  shouldShrink: boolean
  tulipPositions: Point[]
  checklist: Checkbox[]
}) => {
  const colorCompleted = cardData?.bauble_color_completed ?? '#00ff00'
  const colorNotCompleted = cardData?.bauble_color_not_completed ?? '#ff0000'

  return tulipPositions.map((point, index) => {
    const checkbox = checklist?.[index]
    const isCompleted = checkbox?.is_completed

    return (
      <TulipComponent
        key={index}
        shouldShrink={shouldShrink}
        checkbox={checkbox}
        point={point}
        color={isCompleted ? colorCompleted : colorNotCompleted}
      />
    )
  })
}

const TulipComponent = ({
  color,
  shouldShrink,
  checkbox,
  point
}: {
  color: string
  shouldShrink: boolean
  checkbox?: Checkbox
  point: Point
}) => {
  const groupRef = useRef<Group>(null)
  const {updateCheckboxIsCompleted} = useCheckboxHandlers()

  useFrame((_state, delta) => {
    if (groupRef.current === null) {
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
      ref={groupRef}
      onClick={event => {
        // prevent click from bleeding through to objects behind
        event.stopPropagation()
        if (checkbox) {
          updateCheckboxIsCompleted(!checkbox.is_completed, checkbox.id)
        }
      }}
      position={[point.x, -0.7, point.z]}
      scale={0}
    >
      <TulipModel color={color} />
    </group>
  )
}
