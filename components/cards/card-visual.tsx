import {observer} from 'mobx-react-lite'
import {useRef} from 'react'
import {useGlobalStore} from '../global-provider/global-store'
import {useCardChecklistStore} from './card-checklist/card-checklist-store'
import {useCardInfoStore} from './card-info/card-info-store'
import {getSearchCard} from './get-search-card'
import {CardVisualType} from './types'
import {BaseCharacter} from './visual/ui/base-character'
import {BasicScene} from './visual/ui/base-scene'
import {ConeWithSpheres} from './visual/ui/cone'
import {Tulip} from './visual/ui/tulip'

type Vector2 = {x: number; y: number}

export const CardVisual = observer(() => {
  const moveData = useRef<Vector2>({x: 0, y: 0})
  const lookData = useRef<Vector2>({x: 0, y: 0})

  return (
    <BasicScene moveData={moveData} lookData={lookData}>
      <PhysicsContent />
      <BaseCharacter moveData={moveData} lookData={lookData} />
    </BasicScene>
  )
})

const PhysicsContent = observer(() => {
  const id = String(getSearchCard())
  const [globalState] = useGlobalStore()
  const [, cardChecklistStore] = useCardChecklistStore()
  const [cardInfoState] = useCardInfoStore()

  const playerSize = globalState.playerSize
  const checklist = cardChecklistStore.getAllCheckboxes(id)
  const card = cardInfoState.card.data

  const eggsCount = globalState.eggsTotalCount

  const selectedVisual =
    card?.selected_visual as unknown as CardVisualType[number]

  return (
    <>
      {selectedVisual === 'spring' && (
        <Tulip
          checklist={checklist}
          card={card}
          playerSize={playerSize}
          eggsCount={eggsCount}
        />
      )}
      {selectedVisual === 'winter' && (
        <ConeWithSpheres checklist={checklist} card={card} />
      )}
    </>
  )
})
