import {CardChecklistProgress} from '@/components/cards/card-checklist/card-checklist-progress'
import {useCardChecklistStore} from '@/components/cards/card-checklist/card-checklist-store'
import {CardInfo} from '@/components/cards/card-info/card-info'
import {CheckAllCheckboxes} from '@/components/cards/cards'
import {getSearchCard} from '@/components/cards/get-search-card'

import {Checklist} from '@/components/checklist/checklist'
import {Drag} from '@/components/common/drag/drag'
import {ChatWrapper} from '@/components/common/drawer-menu'
import {Tabs} from '@/components/daisyui/tabs'
import {useGlobalStore} from '@/components/global-provider/global-store'
import {Tab} from '@/components/global-provider/types'
import {observer} from 'mobx-react-lite'
import {isMobile} from 'react-device-detect'
import tw from 'tailwind-styled-components'

import {useCardInfoStore} from '@/components/cards/card-info/card-info-store'
import {InputGoogleStyle} from '@/components/checklist/checkbox/Input-google-style'
import dynamic from 'next/dynamic'
import {twJoin} from 'tailwind-merge'
import {Loader} from '../loader'

const CardVisual = dynamic(() => import('@/components/cards/card-visual'), {
  ssr: false,
  loading: () => (
    <Loader className="flex justify-center mt-8 w-full text-violet-400" />
  )
})

export const TabsComponent = observer(() => {
  const [state] = useGlobalStore()
  return (
    <div
      className="h-full border border-y-0 border-base-300 bg-base-100"
      style={isMobile ? {} : {width: state.rightDrawerWidth}}
    >
      <Drag drawer="right" />
      <Tabs className={twJoin('flex justify-between')}>
        <InfoTab />
        <ChecklistTab />
        {isMobile && <ChatTab />}
        <VisualTab />
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

const InfoTabContent = observer(() => {
  return (
    <Tabs.TabContent>
      <CardInfo />
    </Tabs.TabContent>
  )
})

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
  const [state] = useCardChecklistStore()
  const id = String(getSearchCard())
  return (
    <Tabs.TabContent>
      <div className="shadow-sm">
        <div className="flex gap-1 p-4">
          {state.checklists.data?.get(id)?.length ? (
            <>
              <CheckAllCheckboxes />
              <CardChecklistProgress id={id} />
            </>
          ) : null}
        </div>
      </div>
      <div className="h-[calc(100dvh-158px)]">
        <Checklist />
        <InputGoogleStyle />
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

const VisualTab = observer(() => {
  const [state, store] = useGlobalStore()
  const active = state.tab === 'visual'

  return (
    <>
      <TwTab
        value="visual"
        onChange={e => store.setTab(e.target.value as Tab)}
        label="Visual"
        groupName="right_drawer"
        checked={active}
      />
      {active && <VisualTabContent />}
    </>
  )
})

const VisualTabContent = observer(() => {
  const id = String(getSearchCard())
  const [cardChecklistState] = useCardChecklistStore()
  const [cardInfoState] = useCardInfoStore()

  return (
    <Tabs.TabContent className="h-full">
      <div className="flex relative">
        <CardVisual
          checklist={cardChecklistState.checklists.data?.get(id) ?? []}
          cardInfoState={cardInfoState.card}
        />
      </div>
    </Tabs.TabContent>
  )
})
