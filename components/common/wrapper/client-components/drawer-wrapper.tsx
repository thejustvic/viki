'use client'

import {getSearchPost} from '@/app/posts/components/get-search-post'
import {PostInfo} from '@/app/posts/components/post-info/post-info'
import {CheckAllCheckboxes} from '@/app/posts/components/posts'
import {CheckboxInput} from '@/components/checklist/checkbox/checkbox-input'
import {Checklist} from '@/components/checklist/checklist'

import {Drawer} from '@/components/daisyui/drawer'
import {Tabs} from '@/components/daisyui/tabs'
import {useGlobalStore} from '@/components/global/global-store'
import {Tab} from '@/components/global/types'
import {PostChecklistProgress} from '@/components/post-checklist/post-checklist-progress'
import {usePostChecklistStore} from '@/components/post-checklist/post-checklist-store'
import {
  useLeftDrawerOpenState,
  useRightDrawerOpenState
} from '@/hooks/use-drawer-open-state'
import {headerHeight} from '@/utils/const'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {observer} from 'mobx-react-lite'
import {PropsWithChildren, ReactNode} from 'react'
import {isMobile} from 'react-device-detect'
import {useSwipeable} from 'react-swipeable'
import {twJoin} from 'tailwind-merge'
import tw from 'tailwind-styled-components'
import {Drag} from '../../drag'
import {ChatWrapper, DrawerMenu} from '../../drawer-menu'
import {Navbar} from '../../navbar/client-components/navbar'
import {PerfectScrollbar} from '../../perfect-scrollbar'

interface Props {
  children: ReactNode
}

export const DrawerWrapper = observer(({children}: Props) => {
  return (
    <LeftDrawer>
      <RightDrawer>
        <Navbar />
        <PerfectScrollbar
          className="h-dvh"
          style={{height: `calc(100% - ${headerHeight})`}}
        >
          {children}
        </PerfectScrollbar>
      </RightDrawer>
    </LeftDrawer>
  )
})

const LeftDrawer = observer(({children}: PropsWithChildren) => {
  useLeftDrawerOpenState()
  const [state, store] = useGlobalStore()
  const {user} = useSupabase()

  const onLeftDrawerClickOverlay = () => {
    store.setLeftDrawerClosed()
  }

  const leftSwipeHandlers = useSwipeable({
    onSwipedLeft: () => store.setLeftDrawerClosed()
  })

  const leftDrawerOpen = () => {
    if (user) {
      if (state.drawerOpenByHover) {
        return true
      }
      if (!state.drawerOpenByHover) {
        return state.leftDrawerOpen
      } else {
        return false
      }
    } else {
      return false
    }
  }

  return (
    <Drawer
      id="left-drawer"
      open={leftDrawerOpen()}
      mobile={isMobile || state.drawerOpenByHover}
      side={user ? <LeftDrawerSide /> : null}
      onClickOverlay={onLeftDrawerClickOverlay}
      contentClassName="h-dvh"
      {...leftSwipeHandlers}
    >
      {children}
    </Drawer>
  )
})

const LeftDrawerSide = () => {
  return (
    <DrawerContentWrapper>
      <DrawerMenu />
    </DrawerContentWrapper>
  )
}

const RightDrawer = observer(({children}: PropsWithChildren) => {
  useRightDrawerOpenState()
  const [state, store] = useGlobalStore()
  const {user} = useSupabase()

  const onRightDrawerClickOverlay = () => {
    store.setRightDrawerClosed()
  }

  const handleRightSwipe = () => {
    switch (state.tab) {
      case 'info': {
        store.setRightDrawerClosed()
        return
      }
      case 'checklist': {
        store.setTab('info')
        return
      }
      case 'chat': {
        store.setTab('checklist')
        return
      }
    }
  }

  const handleLeftSwipe = () => {
    switch (state.tab) {
      case 'info': {
        store.setTab('checklist')
        return
      }
      case 'checklist': {
        store.setTab('chat')
        return
      }
    }
  }

  const rightSwipeHandlers = useSwipeable({
    onSwipedRight: handleRightSwipe,
    onSwipedLeft: handleLeftSwipe
  })

  return (
    <Drawer
      id="right-drawer"
      end
      open={state.rightDrawerOpen}
      mobile={isMobile}
      side={user ? <RightDrawerSide /> : null}
      onClickOverlay={onRightDrawerClickOverlay}
      contentClassName="h-dvh"
      {...rightSwipeHandlers}
    >
      {children}
    </Drawer>
  )
})

const RightDrawerSide = () => {
  return (
    <DrawerContentWrapper>
      <TabsComponent />
    </DrawerContentWrapper>
  )
}

// needed for fast width style change in inner component
const DrawerContentWrapper = ({children}: React.PropsWithChildren) => {
  return (
    <div className={twJoin('flex flex-col h-full', isMobile && 'w-full')}>
      {children}
    </div>
  )
}

const TabsComponent = observer(() => {
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
