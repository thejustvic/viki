import {useBoolean} from '@/hooks/use-boolean'
import {useRef} from 'react'
import {isMobile} from 'react-device-detect'
import {Checkbox} from '../checklist/types'
import {Card, CardVisualType, PlayerSizeType} from './types'
import {BaseCharacter} from './visual/ui/base-character'
import {BasicScene} from './visual/ui/base-scene'
import {ConeWithSpheres} from './visual/ui/cone'
import {Tulip} from './visual/ui/tulip'

type Vector2 = {x: number; y: number}

export default function CardVisual({
  playerSize,
  checklist,
  card
}: {
  playerSize: PlayerSizeType[number]
  checklist: Checkbox[] | undefined
  card: Card | null
}) {
  const isLocked = useBoolean(isMobile ? false : true)
  const selectedVisual =
    card?.selected_visual as unknown as CardVisualType[number]

  const moveData = useRef<Vector2>({x: 0, y: 0})
  const lookData = useRef<Vector2>({x: 0, y: 0})

  return (
    <BasicScene
      isLocked={isLocked}
      selectedVisual={selectedVisual}
      moveData={moveData}
      lookData={lookData}
    >
      {selectedVisual === 'spring' && (
        <Tulip checklist={checklist} card={card} playerSize={playerSize} />
      )}
      {selectedVisual === 'winter' && (
        <ConeWithSpheres checklist={checklist} card={card} />
      )}
      <BaseCharacter
        position={[0, 0, 0]}
        args={[0.5]}
        isLocked={isLocked}
        moveData={moveData}
        lookData={lookData}
      />
    </BasicScene>
  )
}
