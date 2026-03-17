import {CardChecklistProgress} from '@/components/cards/card-checklist/card-checklist-progress'
import {useCardChecklistStore} from '@/components/cards/card-checklist/card-checklist-store'
import {CheckAllCheckboxes} from '@/components/cards/cards'
import {getSearchCard} from '@/components/cards/get-search-card'
import {InputGoogleStyle} from '@/components/checklist/checkbox/input-google-style'
import {Checklist} from '@/components/checklist/checklist'
import tw from '@/components/common/tw-styled-components'
import {Tabs} from '@/components/daisyui/tabs'
import {useGlobalStore} from '@/components/global-provider/global-store'
import {Tab} from '@/components/global-provider/types'
import {observer} from 'mobx-react-lite'
import {TwTab} from './drawer-tabs'

export const DrawerTabChecklist = observer(() => {
  const [state, store] = useGlobalStore()
  const active = state.tab === 'checklist'
  return (
    <>
      <TwTab
        value="checklist"
        onChange={e => store.setTab(e.target.value as Tab)}
        label="Checklist"
        groupName="right_drawer"
        checked={active}
      />
      <ChecklistTabContent />
    </>
  )
})

const TwChecklistProgress = tw.div`
  flex
  gap-3
  py-4
  px-3
  h-full
  bg-primary/8
`

const ChecklistTabContent = observer(() => {
  const [, store] = useCardChecklistStore()
  const id = String(getSearchCard())
  return (
    <Tabs.TabContent>
      <div className="shadow-sm">
        {store.getAllCheckboxes(id)?.length ? (
          <TwChecklistProgress>
            <CheckAllCheckboxes />
            <CardChecklistProgress id={id} />
          </TwChecklistProgress>
        ) : null}
      </div>
      <Checklist />
      <InputGoogleStyle />
    </Tabs.TabContent>
  )
})
