import tw from '@/components/common/tw-styled-components'
import {useGlobalStore} from '@/components/global-provider/global-store'
import {ArrUtil} from '@/utils/arr-util'
import {Html} from '@react-three/drei'
import {useFrame} from '@react-three/fiber'
import {easing} from 'maath'
import {observer} from 'mobx-react-lite'
import {
  Dispatch,
  SetStateAction,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import {Group} from 'three'
import {useCardChecklistStore} from '../../card-checklist/card-checklist-store'
import {Checkbox} from '../../card-checklist/types'
import {useCardInfoStore} from '../../card-info/card-info-store'
import {getSearchCard} from '../../get-search-card'
import {Card, PlayerSizeType} from '../../types'
import {LawnInstances} from '../components/lawn-instances'
import {TulipInstances} from '../components/tulip-instances'

interface Point {
  x: number
  z: number
}

export type PositionType = [x: number, y: number, z: number]

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

      // check the distance to all existing points
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

const getLawnPosition = (fieldRadius: number) => {
  const positions: PositionType[] = []
  const squareSize = 20 - 0.25 // -0.25 for a little overlap each other

  const gridSteps = Math.ceil((fieldRadius * 2) / squareSize)
  const offset = (gridSteps * squareSize) / 2

  for (let i = 0; i <= gridSteps; i++) {
    for (let j = 0; j <= gridSteps; j++) {
      positions.push([i * squareSize - offset, 0, j * squareSize - offset])
    }
  }

  return positions
}

const calcPositions = (newData: Point[]) => {
  const positions: PositionType[] = []

  newData.forEach(point => {
    positions.push([point.x, -1.3, point.z])
  })
  return positions
}

const getBaseConstants = (checklist: Checkbox[] | undefined) => {
  const baseRadius = 10
  const referenceCount = 4
  const scaleFactor = Math.sqrt(
    Math.max(referenceCount, checklist?.length ?? 0) / referenceCount
  )
  const fieldRadius = baseRadius * scaleFactor

  const tulipRadius = 3
  const minRequiredDistance = tulipRadius * 2

  return {
    baseRadius,
    referenceCount,
    scaleFactor,
    fieldRadius,
    minRequiredDistance
  }
}

const useMainSequence = ({
  updatePositions,
  updateShouldShrink,
  updateCardData,
  checklist,
  cardData,
  card,
  minRequiredDistance,
  fieldRadius
}: {
  card: Card | null
  checklist: Checkbox[] | undefined
  minRequiredDistance: number
  fieldRadius: number
  updatePositions: Dispatch<SetStateAction<PositionType[]>>
  updateShouldShrink: Dispatch<SetStateAction<boolean>>
  cardData: {
    card: Card | null
    checklist: Checkbox[] | undefined
  }
  updateCardData: Dispatch<
    SetStateAction<{
      card: Card | null
      checklist: Checkbox[] | undefined
    }>
  >
}) => {
  useEffect(() => {
    if (!cardData) {
      return
    }
    let isCancelled = false

    const runSequence = async () => {
      const notEqualButSameLength =
        ArrUtil.areListsNotEqual(checklist ?? [], cardData.checklist ?? []) &&
        checklist?.length === cardData.checklist?.length
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
        card: card,
        checklist: checklist
      })
      if (!notEqualButSameLength) {
        const newData = generateNonOverlappingPoints({
          numberOfTulips: checklist?.length ?? 0,
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
  }, [card, checklist, fieldRadius, minRequiredDistance])
}

interface CardDataProps {
  card: Card | null
  checklist: Checkbox[] | undefined
}

export interface PositionsProps {
  position: PositionType
  text: string
  color: string
  plateColor: string
  plateTextColor: string
}

export const Tulip = observer(() => {
  const id = String(getSearchCard())
  const [globalState] = useGlobalStore()
  const [, cardChecklistStore] = useCardChecklistStore()
  const [cardInfoState] = useCardInfoStore()

  const playerSize = globalState.playerSize
  const checklist = cardChecklistStore.getAllCheckboxes(id)
  const card = cardInfoState.card.data
  const eggsCount = globalState.eggsTotalCount

  const fieldRef = useRef<Group>(null)
  const {fieldRadius, minRequiredDistance} = getBaseConstants(checklist)
  const [positions, updatePositions] = useState<PositionType[]>([])
  const [shouldShrink, updateShouldShrink] = useState(false)
  const [cardData, updateCardData] = useState<CardDataProps>({
    card: card,
    checklist: checklist
  })
  const scale = useMemo(() => getScale(playerSize), [playerSize])
  const lawnPositions = useMemo(
    () => getLawnPosition(fieldRadius),
    [fieldRadius]
  )
  useMainSequence({
    updatePositions,
    updateShouldShrink,
    updateCardData,
    checklist,
    cardData,
    card,
    minRequiredDistance,
    fieldRadius
  })
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
    <group scale={scale} position={[0, 0, -3]}>
      <group ref={fieldRef} scale={0.5}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 10, 0]}>
          <planeGeometry args={[fieldRadius * 2, fieldRadius * 2]} />
          <meshStandardMaterial color="#2d5a27" transparent opacity={0} />
        </mesh>
        <LawnInstances positions={lawnPositions} />
      </group>
      <Suspense fallback={<LoadingTulips />}>
        <TulipInstances
          checklist={cardData.checklist}
          positions={positions}
          shouldShrink={shouldShrink}
          card={cardData.card}
          eggsCount={eggsCount}
        />
      </Suspense>
    </group>
  )
})

const TwWrapper = tw.div`
  text-2xl
  text-white
  bold
  -ml-14
  pb-10
  truncate
`

const LoadingTulips = () => {
  return (
    <Html>
      <TwWrapper>loading tulips...</TwWrapper>
    </Html>
  )
}

const getScale = (playerSize: PlayerSizeType[number]) => {
  const human = 0.2
  const bunny = 0.6
  switch (playerSize) {
    case 'human': {
      return human
    }
    case 'bunny': {
      return bunny
    }
    default: {
      return human
    }
  }
}
