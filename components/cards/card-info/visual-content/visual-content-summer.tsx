import {Tabs} from '@/components/daisyui/tabs'
import {useGlobalStore} from '@/components/global-provider/global-store'
import {IconCircle, IconCircleCheck} from '@tabler/icons-react'
import {observer} from 'mobx-react-lite'
import {useCardHandlers} from '../../cards-handlers'
import {getSearchCard} from '../../get-search-card'
import {CardVisualType} from '../../types'
import {CardInfoShowData} from '../card-info-show-data'
import {useCardInfoStore} from '../card-info-store'
import {ChooseColorData} from './visual-content'

export const VisualContentSummer = observer(() => {
  const [{selectedVisualMode}, globalStore] = useGlobalStore()
  const [state] = useCardInfoStore()
  const {updateCardVisual} = useCardHandlers()
  const id = String(getSearchCard())

  if (!state.card.data) {
    return null
  }

  const checked = selectedVisualMode === 'summer'

  return (
    <>
      <Tabs.Tab
        value="summer"
        onChange={({target: {value}}) => {
          void updateCardVisual(value, id)
          globalStore.setSelectedVisualMode(value as CardVisualType[number])
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
  return <ChooseJellyfishColor />
}

const ChooseJellyfishColor = observer(() => {
  const [state] = useCardInfoStore()

  return (
    <div className="mt-4 flex flex-col gap-2">
      <CardInfoShowData
        loading={state.card.loading}
        error={state.card.error?.message}
        data={
          <ChooseColorData
            colorCompleted="jellyfish_color_completed"
            colorNotCompleted="jellyfish_color_not_completed"
          />
        }
        prefix={'jellyfish color'}
        className="items-center"
      />
    </div>
  )
})
