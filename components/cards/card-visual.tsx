import {useBoolean} from '@/hooks/use-boolean'
import {Sky} from '@react-three/drei'
import {Checkbox} from '../checklist/types'
import {CardInfoStore} from './card-info/card-info-store'
import {CardVisualType} from './types'
import {BaseCharacter} from './visual/ui/base-character'
import BaseScene from './visual/ui/base-scene'
import {ConeWithSpheres} from './visual/ui/cone'
import {Tulip} from './visual/ui/tulip'

export default function CardVisual({
  checklist,
  cardInfoState
}: {
  checklist: Checkbox[]
  cardInfoState: CardInfoStore['state']['card']
}) {
  const isLocked = useBoolean(false)
  const selectedVisual = cardInfoState.data
    ?.selected_visual as unknown as CardVisualType[number]

  return (
    <BaseScene isLocked={isLocked} selectedVisual={selectedVisual}>
      {selectedVisual === 'spring' && (
        <Tulip checklist={checklist} cardInfoState={cardInfoState} />
      )}
      {selectedVisual === 'winter' && (
        <ConeWithSpheres checklist={checklist} cardInfoState={cardInfoState} />
      )}

      <Sky sunPosition={[5, 10, 5]} turbidity={0.25} />
      <BaseCharacter position={[0, 0, 0]} args={[0.5]} isLocked={isLocked} />
    </BaseScene>
  )
}
