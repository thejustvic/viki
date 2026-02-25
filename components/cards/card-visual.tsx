import {useBoolean} from '@/hooks/use-boolean'
import {Sky} from '@react-three/drei'
import {Checkbox} from '../checklist/types'
import {CardInfoStore} from './card-info/card-info-store'
import BaseBox from './visual/ui/base-box'
import {BaseCharacter} from './visual/ui/base-character'
import BaseScene from './visual/ui/base-scene'
import {ConeWithSpheres} from './visual/ui/cone'

export default function CardVisual({
  checklist,
  cardInfoState
}: {
  checklist: Checkbox[]
  cardInfoState: CardInfoStore['state']['card']
}) {
  const isLocked = useBoolean(false)

  return (
    <BaseScene isLocked={isLocked}>
      <ConeWithSpheres checklist={checklist} cardInfoState={cardInfoState} />

      <BaseBox position={[5, 1, -8]} args={[1, 1, 1]} color="green" />
      <BaseBox position={[5, 1, -6]} args={[1, 2, 1]} color="red" />
      <BaseBox position={[5, 1, -4]} args={[1, 3, 1]} color="orange" />

      <BaseCharacter
        position={[-0.2, 1, -4]}
        args={[0.5]}
        isLocked={isLocked}
      />

      <Sky sunPosition={[5, 10, 5]} turbidity={0.25} />
    </BaseScene>
  )
}
