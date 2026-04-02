import {observer} from 'mobx-react-lite'
import {useRef} from 'react'
import {useCardInfoStore} from './card-info/card-info-store'
import {CardVisualType} from './types'
import {BaseCharacter} from './visual/ui/base-character'
import {BasicScene} from './visual/ui/base-scene'
import {Snowfall} from './visual/ui/base-snowfall'
import {ConeWithSpheres} from './visual/ui/cone'
import {Tulip} from './visual/ui/tulip'

type Vector2 = {x: number; y: number}

export const CardVisual = () => {
  const moveData = useRef<Vector2>({x: 0, y: 0})
  const lookData = useRef<Vector2>({x: 0, y: 0})

  return (
    <BasicScene moveData={moveData} lookData={lookData}>
      <PhysicsContent />
      <BaseCharacter moveData={moveData} lookData={lookData} />
    </BasicScene>
  )
}

const PhysicsContent = observer(() => {
  const [cardInfoState] = useCardInfoStore()
  const card = cardInfoState.card.data
  const selectedVisual =
    card?.selected_visual as unknown as CardVisualType[number]

  return (
    <>
      {selectedVisual === 'spring' && <Tulip />}
      {selectedVisual === 'winter' && (
        <>
          <ConeWithSpheres />
          <Snowfall />
        </>
      )}
    </>
  )
})
