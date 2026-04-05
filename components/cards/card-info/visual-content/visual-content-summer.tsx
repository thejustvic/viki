import {Tabs} from '@/components/daisyui/tabs'
import {useGlobalStore} from '@/components/global-provider/global-store'
import {IconCircle, IconCircleCheck} from '@tabler/icons-react'
import {observer} from 'mobx-react-lite'
import {useCardHandlers} from '../../cards-handlers'
import {getSearchCard} from '../../get-search-card'
import {useCardInfoStore} from '../card-info-store'

export const VisualContentSummer = observer(() => {
  const [, globalStore] = useGlobalStore()
  const [state] = useCardInfoStore()
  const {updateCardVisual} = useCardHandlers()
  const id = String(getSearchCard())

  if (!state.card.data) {
    return null
  }

  const checked = state?.card?.data?.selected_visual === 'summer'

  return (
    <>
      <Tabs.Tab
        value="summer"
        onChange={({target: {value}}) => {
          void updateCardVisual(value, id)
          globalStore.setPlayerSize('human')
        }}
        label="summer"
        groupName="tabs-visual"
        checked={checked}
        icon={checked ? IconCircleCheck : IconCircle}
      />
      <Tabs.TabContent className="p-2">
        <SummerContent />
      </Tabs.TabContent>
    </>
  )
})

const SummerContent = () => {
  return <div>Ocean</div>
}
