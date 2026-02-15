import {useBoolean} from '@/hooks/use-boolean'
import {Sky} from '@react-three/drei'
import {useEffect} from 'react'
import {Checkbox} from '../checklist/types'
import {CardInfoStore} from './card-info/card-info-store'
import {TreeModel} from './visual/components/tree-model'
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
  useEffect(() => {
    if (cardInfoState.data === null) {
      return
    }

    localStorage.setItem(
      'sphere-bg-color-completed',
      cardInfoState.data.bauble_color_completed || ''
    )
    localStorage.setItem(
      'sphere-bg-color-not-completed',
      cardInfoState.data.bauble_color_not_completed || ''
    )

    localStorage.setItem(
      'sphere-text-color-completed',
      cardInfoState.data.bauble_text_color_completed || ''
    )
    localStorage.setItem(
      'sphere-text-color-not-completed',
      cardInfoState.data.bauble_text_color_not_completed || ''
    )
  }, [cardInfoState])

  return (
    <BaseScene isLocked={isLocked}>
      <ConeWithSpheres
        active={cardInfoState?.data !== null}
        checklist={checklist}
      />

      <TreeModel position={[0, -1, -10]} scale={0.3} />

      <BaseBox position={[5, 1, -8]} args={[1, 1, 1]} color="green" />
      <BaseBox position={[5, 1, -6]} args={[1, 2, 1]} color="red" />
      <BaseBox position={[5, 1, -4]} args={[1, 3, 1]} color="orange" />

      <BaseCharacter position={[-0.2, 1, 1]} args={[0.5]} isLocked={isLocked} />

      <Sky sunPosition={[5, 10, 5]} turbidity={0.25} />
    </BaseScene>
  )
}
