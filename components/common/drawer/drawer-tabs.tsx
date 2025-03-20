import {getSearchPost} from '@/app/posts/components/get-search-post'
import {PostInfo} from '@/app/posts/components/post-info/post-info'
import {CheckAllCheckboxes} from '@/app/posts/components/posts'
import {CheckboxInput} from '@/components/checklist/checkbox/checkbox-input'
import {Checklist} from '@/components/checklist/checklist'
import {Tabs} from '@/components/daisyui/tabs'
import {useGlobalStore} from '@/components/global/global-store'
import {Tab} from '@/components/global/types'
import {PostChecklistProgress} from '@/components/post-checklist/post-checklist-progress'
import {usePostChecklistStore} from '@/components/post-checklist/post-checklist-store'
import {observer} from 'mobx-react-lite'
import {isMobile} from 'react-device-detect'
import tw from 'tailwind-styled-components'
import {Drag} from '../drag'
import {ChatWrapper} from '../drawer-menu'

export const TabsComponent = observer(() => {
  const [state] = useGlobalStore()
  return (
    <div
      className="h-full border border-y-0 border-base-300 bg-base-100"
      style={isMobile ? {} : {width: state.rightDrawerWidth}}
    >
      <Drag drawer="right" />
      <Tabs className="flex justify-between">
        <InfoTab />
        <ChecklistTab />
        {isMobile && <ChatTab />}
      </Tabs>
    </div>
  )
})

const TwTab = tw(Tabs.Tab)`
  flex
  flex-1
`

const InfoTab = observer(() => {
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

const InfoTabContent = () => {
  return (
    <Tabs.TabContent>
      <PostInfo />
    </Tabs.TabContent>
  )
}

const ChecklistTab = observer(() => {
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

const ChecklistTabContent = observer(() => {
  const [state] = usePostChecklistStore()
  const id = String(getSearchPost())
  return (
    <Tabs.TabContent>
      <div className="px-4 my-2 flex gap-1 h-[24px]">
        {state.checklists.data?.get(id)?.length ? (
          <>
            <CheckAllCheckboxes />
            <PostChecklistProgress id={id} />
          </>
        ) : null}
      </div>
      <div className="flex flex-col justify-between flex-1 gap-3 h-[calc(100dvh-81px)]">
        <Checklist />
        <CheckboxInput />
      </div>
    </Tabs.TabContent>
  )
})

const ChatTab = observer(() => {
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
      <div className="flex h-[calc(100dvh-41px)]">
        <ChatWrapper />
      </div>
    </Tabs.TabContent>
  )
}
