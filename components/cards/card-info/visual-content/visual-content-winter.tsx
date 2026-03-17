import {Tabs} from '@/components/daisyui/tabs'
import {IconCircle, IconCircleCheck} from '@tabler/icons-react'
import {observer} from 'mobx-react-lite'
import {useCardHandlers} from '../../cards-handlers'
import {getSearchCard} from '../../get-search-card'
import {CardInfoShowData} from '../card-info-show-data'
import {useCardInfoStore} from '../card-info-store'
import {ChooseColorData} from './visual-content'

export const VisualContentWinter = observer(() => {
  const [state] = useCardInfoStore()
  const {updateCardVisual} = useCardHandlers()
  const id = String(getSearchCard())

  if (!state.card.data) {
    return null
  }

  const checked = state?.card?.data?.selected_visual === 'winter'

  return (
    <>
      <Tabs.Tab
        value="winter"
        onChange={({target: {value}}) => {
          void updateCardVisual(value, id)
        }}
        label="winter"
        groupName="tabs-visual"
        checked={checked}
        icon={checked ? IconCircleCheck : IconCircle}
      />
      <Tabs.TabContent className="p-2">
        <WinterContent />
      </Tabs.TabContent>
    </>
  )
})

const WinterContent = () => {
  return <ChooseBaubleColor />
}

const ChooseBaubleColor = observer(() => {
  const [state] = useCardInfoStore()

  return (
    <div className="mt-4 flex flex-col gap-2">
      <CardInfoShowData
        loading={state.card.loading}
        error={state.card.error?.message}
        data={
          <ChooseColorData
            colorCompleted="bauble_color_completed"
            colorNotCompleted="bauble_color_not_completed"
          />
        }
        prefix={'bauble color'}
        className="items-center"
      />
      <CardInfoShowData
        loading={state.card.loading}
        error={state.card.error?.message}
        data={
          <ChooseColorData
            colorCompleted="bauble_text_color_completed"
            colorNotCompleted="bauble_text_color_not_completed"
          />
        }
        prefix={'color of text on bauble'}
        className="items-center"
      />
    </div>
  )
})
