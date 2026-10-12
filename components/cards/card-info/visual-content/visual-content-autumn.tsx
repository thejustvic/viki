import {Tabs} from '@/components/daisyui/tabs'
import {useGlobalStore} from '@/components/global-provider/global-store'
import {IconCircle, IconCircleCheck} from '@tabler/icons-react'
import {observer} from 'mobx-react-lite'
import {useCardHandlers} from '../../cards-handlers'
import {getSearchCard} from '../../get-search-card'
import {CardVisualType} from '../../types'
import {useCardInfoStore} from '../card-info-store'

export const VisualContentAutumn = observer(() => {
  const [{selectedVisualMode}, globalStore] = useGlobalStore()
  const [state] = useCardInfoStore()
  const {updateCardVisual} = useCardHandlers()
  const id = String(getSearchCard())

  if (!state.card.data) {
    return null
  }

  const checked = selectedVisualMode === 'autumn'

  return (
    <>
      <Tabs.Tab
        value="autumn"
        onChange={({target: {value}}) => {
          void updateCardVisual(value, id)
          globalStore.setSelectedVisualMode(value as CardVisualType[number])
          globalStore.setPlayerSize('human')
        }}
        label="autumn"
        groupName="tabs-visual"
        checked={checked}
        icon={checked ? IconCircleCheck : IconCircle}
      />
      <Tabs.TabContent className="p-2">autumn</Tabs.TabContent>
    </>
  )
})
