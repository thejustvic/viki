'use client'

import {ModalPost} from '@/app/posts/utils/modal-post/modal-post'
import {PerfectScrollbar} from '@/components/common/perfect-scrollbar'
import {useGlobalStore} from '@/components/global/global-store'
import {
  useLeftDrawerOpenState,
  useRightDrawerOpenState
} from '@/hooks/use-drawer-open-state'
import {headerHeight} from '@/utils/const'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {observer} from 'mobx-react-lite'
import {ReactNode} from 'react'
import {Button, Drawer, Tabs} from 'react-daisyui'
import {isMobile} from 'react-device-detect'
import tw from 'tailwind-styled-components'
import {Drag} from '../../drag'
import {DrawerMenu} from '../../drawer-menu'
import {Navbar} from '../../navbar'

interface Props {
  children: ReactNode
}

export const DrawerNavbar = observer(({children}: Props) => {
  const [state, store] = useGlobalStore()
  const {session} = useSupabase()

  useLeftDrawerOpenState()
  useRightDrawerOpenState()

  const mobileLeftDrawerOpen = !state.drawerOpenByHover && state.leftDrawerOpen
  const mobileRightDrawerOpen = state.rightDrawerOpen

  const onLeftDrawerClickOverlay = () => {
    store.setLeftDrawerClosed()
  }

  const onRightDrawerClickOverlay = () => {
    store.setRightDrawerClosed()
  }

  const leftDrawerOpen = () => {
    if (session) {
      return isMobile ? state.leftDrawerOpen : state.drawerOpenByHover
    } else {
      return false
    }
  }

  return (
    <Drawer
      open={leftDrawerOpen()}
      mobile={isMobile || mobileLeftDrawerOpen}
      side={
        session ? (
          <DrawerWrapper>
            <DrawerMenu />
          </DrawerWrapper>
        ) : null
      }
      contentClassName="overflow-x-hidden"
      onClickOverlay={onLeftDrawerClickOverlay}
    >
      <Drawer
        end
        open={state.rightDrawerOpen}
        mobile={isMobile || mobileRightDrawerOpen}
        side={
          session ? (
            <DrawerWrapper>
              <TabsComponent />
            </DrawerWrapper>
          ) : null
        }
        contentClassName="overflow-x-hidden"
        onClickOverlay={onRightDrawerClickOverlay}
      >
        <Navbar />
        <div style={{height: `calc(100% - ${headerHeight})`}}>
          <PerfectScrollbar>{children}</PerfectScrollbar>
        </div>
      </Drawer>
    </Drawer>
  )
})

const TwDrawerWrapper = tw.div`
  flex
  flex-col
`

// needed for fast width style change in inner component
const DrawerWrapper = ({children}: React.PropsWithChildren) => {
  return <TwDrawerWrapper>{children}</TwDrawerWrapper>
}

const TabsComponent = observer(() => {
  const [state, store] = useGlobalStore()

  const closeDrawer = () => {
    store.setRightDrawerClosed()
  }

  return (
    <div
      className="h-full border border-y-0 border-base-300 bg-base-100"
      style={{width: state.rightDrawerWidth}}
    >
      <Drag drawer="right" />
      <div>
        <Button color="ghost" className="w-full text-xl" onClick={closeDrawer}>
          hobby
        </Button>
      </div>
      <Tabs
        value={state.tab}
        onChange={store.setTab}
        variant="lifted"
        size="lg"
        className="flex justify-between"
      >
        <TwTab value={'info'}>Tab 1</TwTab>
        <TwTab value={'chat'}>Tab 2</TwTab>
        <TwTab value={'empty'}>Tab 3</TwTab>
      </Tabs>
      {state.tab === 'info' && <ModalPost />}
    </div>
  )
})

const TwTab = tw(Tabs.Tab)`
  flex
  flex-1
`
