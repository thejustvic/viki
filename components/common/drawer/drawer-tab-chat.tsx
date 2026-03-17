import {ChatWrapper} from '@/components/common/drawer-menu'
import {Tabs} from '@/components/daisyui/tabs'
import {useGlobalStore} from '@/components/global-provider/global-store'
import {Tab} from '@/components/global-provider/types'
import {observer} from 'mobx-react-lite'
import {TwTab} from './drawer-tabs'

export const DrawerTabChat = observer(() => {
  const [state, store] = useGlobalStore()
  const active = state.tab === 'chat'

  return (
    <>
      <TwTab
        value="chat"
        onChange={e => store.setTab(e.target.value as Tab)}
        label="Chat"
        groupName="right_drawer"
        checked={active}
      />
      <ChatTabContent />
    </>
  )
})

const ChatTabContent = () => {
  return (
    <Tabs.TabContent>
      <div className="h-[calc(100dvh-72px)]">
        <ChatWrapper />
      </div>
    </Tabs.TabContent>
  )
}
