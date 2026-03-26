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

export const CardVisual = ({
  playerSize,
  checklist,
  card,
  isThirdPersonView
}: {
  playerSize: PlayerSizeType[number]
  checklist: Checkbox[] | undefined
  card: Card | null
  isThirdPersonView: boolean
}) => {
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
        <Tulip
          checklist={checklist}
          card={card}
          playerSize={playerSize}
          isLocked={isLocked.value}
        />
      )}
      {selectedVisual === 'winter' && (
        <ConeWithSpheres checklist={checklist} card={card} />
      )}
      <BaseCharacter
        isLocked={isLocked}
        moveData={moveData}
        lookData={lookData}
        isThirdPersonView={isThirdPersonView}
      />
    </BasicScene>
  )
}
