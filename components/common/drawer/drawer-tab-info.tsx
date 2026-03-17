import {CardInfo} from '@/components/cards/card-info/card-info'
import {Tabs} from '@/components/daisyui/tabs'
import {useGlobalStore} from '@/components/global-provider/global-store'
import {Tab} from '@/components/global-provider/types'
import {observer} from 'mobx-react-lite'
import {TwTab} from './drawer-tabs'

export const DrawerTabInfo = observer(() => {
  const [state, store] = useGlobalStore()
  const active = state.tab === 'info'
  return (
    <>
      <TwTab
        value="info"
        onChange={e => store.setTab(e.target.value as Tab)}
        label="Info"
        groupName="right_drawer"
        checked={active}
      />
      <InfoTabContent />
    </>
  )
})

const InfoTabContent = observer(() => {
  return (
    <Tabs.TabContent>
      <CardInfo />
    </Tabs.TabContent>
  )
})
