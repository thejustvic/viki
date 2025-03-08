'use client'

import {getSearchPost} from '@/app/posts/components/get-search-post'
import {PostInfo} from '@/app/posts/components/post-info/post-info'
import {CheckAllCheckboxes} from '@/app/posts/components/posts'
import {CheckboxInput} from '@/components/checklist/checkbox/checkbox-input'
import {Checklist} from '@/components/checklist/checklist'
import {ChecklistProgress} from '@/components/checklist/checklist-progress'
import ChecklistProvider from '@/components/checklist/checklist-provider'
import {useChecklistStore} from '@/components/checklist/checklist-store'
import {Drawer} from '@/components/daisyui/drawer'
import {Tabs} from '@/components/daisyui/tabs'
import {useGlobalStore} from '@/components/global/global-store'
import {Tab} from '@/components/global/types'
import {
  useLeftDrawerOpenState,
  useRightDrawerOpenState
} from '@/hooks/use-drawer-open-state'
import {headerHeight} from '@/utils/const'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {observer} from 'mobx-react-lite'
import {ReactNode} from 'react'
import {isMobile} from 'react-device-detect'
import {useSwipeable} from 'react-swipeable'
import tw from 'tailwind-styled-components'
import {Drag} from '../../drag'
import {ChatWrapper, DrawerMenu} from '../../drawer-menu'
import {Navbar} from '../../navbar/client-components/navbar'
import {PerfectScrollbar} from '../../perfect-scrollbar'

interface Props {
  children: ReactNode
}

export const DrawerWrapper = observer(({children}: Props) => {
  const [state, store] = useGlobalStore()
  const {user} = useSupabase()

  useLeftDrawerOpenState()
  useRightDrawerOpenState()

  const onLeftDrawerClickOverlay = () => {
    store.setLeftDrawerClosed()
  }

  const onRightDrawerClickOverlay = () => {
    store.setRightDrawerClosed()
  }

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

  const leftSwipeHandlers = useSwipeable({
    onSwipedLeft: () => store.setLeftDrawerClosed()
  })

  const rightSwipeHandlers = useSwipeable({
    onSwipedRight: () => store.setRightDrawerClosed()
  })

  return (
    <Drawer
      id="left-drawer"
      open={leftDrawerOpen()}
      mobile={isMobile || state.drawerOpenByHover}
      side={
        user ? (
          <DrawerContentWrapper>
            <DrawerMenu />
          </DrawerContentWrapper>
        ) : null
      }
      onClickOverlay={onLeftDrawerClickOverlay}
      contentClassName="h-screen"
      {...leftSwipeHandlers}
    >
      <Drawer
        id="right-drawer"
        end
        open={state.rightDrawerOpen}
        mobile={isMobile}
        side={
          user ? (
            <DrawerContentWrapper>
              <ChecklistProvider id={getSearchPost() || ''}>
                <TabsComponent />
              </ChecklistProvider>
            </DrawerContentWrapper>
          ) : null
        }
        onClickOverlay={onRightDrawerClickOverlay}
        contentClassName="h-screen"
        {...rightSwipeHandlers}
      >
        <div style={{height: `calc(100% - ${headerHeight})`}}>
          <Navbar />
          <PerfectScrollbar>{children}</PerfectScrollbar>
        </div>
      </Drawer>
    </Drawer>
  )
})

const TwDrawerWrapper = tw.div`
  flex
  flex-col
  h-full
  w-full
`

// needed for fast width style change in inner component
const DrawerContentWrapper = ({children}: React.PropsWithChildren) => {
  return <TwDrawerWrapper>{children}</TwDrawerWrapper>
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
  return (
    <>
      <TwTab
        value="info"
        onChange={e => store.setTab(e.target.value as Tab)}
        label="Info"
        groupName="right_drawer"
        active={state.tab === 'info'}
      />
      <Tabs.TabContent>
        <PostInfo />
      </Tabs.TabContent>
    </>
  )
})

const ChecklistTab = observer(() => {
  const [checklistState] = useChecklistStore()
  const [state, store] = useGlobalStore()
  return (
    <>
      <TwTab
        value="checklist"
        onChange={e => store.setTab(e.target.value as Tab)}
        label="Checklist"
        groupName="right_drawer"
        active={state.tab === 'checklist'}
      />
      <Tabs.TabContent>
        <div className="px-4 my-2 flex gap-1 h-[24px]">
          {checklistState.checklist.data?.length ? (
            <CheckAllCheckboxes />
          ) : null}
          <ChecklistProgress />
        </div>
        <div className="flex flex-col justify-between flex-1 gap-3 h-[calc(100vh-81px)]">
          <Checklist />
          <CheckboxInput />
        </div>
      </Tabs.TabContent>
    </>
  )
})

const ChatTab = observer(() => {
  const [state, store] = useGlobalStore()

  return (
    <>
      <TwTab
        value="chat"
        onChange={e => store.setTab(e.target.value as Tab)}
        label="Chat"
        groupName="right_drawer"
        active={state.tab === 'chat'}
      />
      <Tabs.TabContent>
        <div className="flex h-[calc(100vh-41px)]">
          <ChatWrapper />
        </div>
      </Tabs.TabContent>
    </>
  )
})
