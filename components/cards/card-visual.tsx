import {useBoolean} from '@/hooks/use-boolean'
import {Sky} from '@react-three/drei'
import {useRef} from 'react'
import {isMobile} from 'react-device-detect'
import {Checkbox} from '../checklist/types'
import {CardInfoStore} from './card-info/card-info-store'
import {CardVisualType, PlayerSizeType} from './types'
import {BaseCharacter} from './visual/ui/base-character'
import BaseScene from './visual/ui/base-scene'
import {ConeWithSpheres} from './visual/ui/cone'
import {Tulip} from './visual/ui/tulip'

type Vector2 = {x: number; y: number}

export default function CardVisual({
  playerSize,
  checklist,
  cardInfoState
}: {
  playerSize: PlayerSizeType[number]
  checklist: Checkbox[]
  cardInfoState: CardInfoStore['state']['card']
}) {
  const isLocked = useBoolean(isMobile ? false : true)
  const selectedVisual = cardInfoState.data
    ?.selected_visual as unknown as CardVisualType[number]

  const moveData = useRef<Vector2>({x: 0, y: 0})
  const lookData = useRef<Vector2>({x: 0, y: 0})

  return (
    <BaseScene
      isLocked={isLocked}
      selectedVisual={selectedVisual}
      moveData={moveData}
      lookData={lookData}
    >
      {selectedVisual === 'spring' && (
        <Tulip
          checklist={checklist}
          cardInfoState={cardInfoState}
          playerSize={playerSize}
        />
      )}
      {selectedVisual === 'winter' && (
        <ConeWithSpheres checklist={checklist} cardInfoState={cardInfoState} />
      )}

      <Sky sunPosition={[5, 10, 5]} turbidity={0.25} />
      <BaseCharacter
        position={[0, 0, 0]}
        args={[0.5]}
        isLocked={isLocked}
        moveData={moveData}
        lookData={lookData}
      />
    </BaseScene>
  )
}
