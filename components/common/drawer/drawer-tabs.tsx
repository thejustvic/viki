import {CardChecklistProgress} from '@/components/cards/card-checklist/card-checklist-progress'
import {useCardChecklistStore} from '@/components/cards/card-checklist/card-checklist-store'
import {CardInfo} from '@/components/cards/card-info/card-info'
import {CheckAllCheckboxes} from '@/components/cards/cards'
import {getSearchCard} from '@/components/cards/get-search-card'

import {Checklist} from '@/components/checklist/checklist'
import {DragDrawerSide} from '@/components/common/drag-drawer-side/drag-drawer-side'
import {ChatWrapper} from '@/components/common/drawer-menu'
import {Tabs} from '@/components/daisyui/tabs'
import {useGlobalStore} from '@/components/global-provider/global-store'
import {Tab} from '@/components/global-provider/types'
import {observer} from 'mobx-react-lite'
import {isMobile} from 'react-device-detect'
import tw from 'tailwind-styled-components'

import {useCardInfoStore} from '@/components/cards/card-info/card-info-store'
import {InputGoogleStyle} from '@/components/checklist/checkbox/input-google-style'
import {Button} from '@/components/daisyui/button'
import {IconArrowBarLeft} from '@tabler/icons-react'
import dynamic from 'next/dynamic'
import {twJoin} from 'tailwind-merge'
import {Loader} from '../loader'

const CardVisual = dynamic(() => import('@/components/cards/card-visual'), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center w-full items-center h-[calc(100dvh-70px)]">
      <Loader className="text-violet-400" />
    </div>
  )
})

const CloseRightDrawer = observer(() => {
  const [, store] = useGlobalStore()
  const closeRightDrawer = () => {
    store.setRightDrawerClosed()
  }
  return (
    <div className="flex w-10 items-center text-lg normal-case">
      <Button
        soft
        className="rounded-none rounded-l-md h-10"
        size="xs"
        onClick={closeRightDrawer}
      >
        <IconArrowBarLeft size={16} />
      </Button>
    </div>
  )
})

export const TabsComponent = observer(() => {
  const [state] = useGlobalStore()

  return (
    <div
      className="h-full border border-y-0 border-base-300/50 bg-base-300/30"
      style={isMobile ? {} : {width: state.rightDrawerWidth}}
    >
      <DragDrawerSide drawer="right" />
      <Tabs className={twJoin('flex justify-between')}>
        {isMobile && <CloseRightDrawer />}
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
  const [, store] = useCardChecklistStore()
  const id = String(getSearchCard())
  return (
    <Tabs.TabContent>
      <div className="shadow-sm">
        {store.getAllCheckboxes(id)?.length ? (
          <div className="flex gap-3 py-4 px-3 h-full bg-primary/8">
            <CheckAllCheckboxes />
            <CardChecklistProgress id={id} />
          </div>
        ) : null}
      </div>
      <Checklist />
      <InputGoogleStyle />
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
      <div className="h-[calc(100dvh-68px)]">
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
  const [, cardChecklistStore] = useCardChecklistStore()
  const [cardInfoState] = useCardInfoStore()

  return (
    <Tabs.TabContent>
      <div className="flex relative">
        <CardVisual
          checklist={cardChecklistStore.getAllCheckboxes(id) ?? []}
          cardInfoState={cardInfoState.card}
        />
      </div>
    </Tabs.TabContent>
  )
})
