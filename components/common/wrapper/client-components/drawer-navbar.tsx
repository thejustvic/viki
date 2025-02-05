'use client'

import {ModalPost} from '@/app/posts/components/modal-post/modal-post'
import {Button} from '@/components/daisyui/button'
import {Drawer} from '@/components/daisyui/drawer'
import {Tabs} from '@/components/daisyui/tabs'
import {useGlobalStore} from '@/components/global/global-store'
import {Tab} from '@/components/global/types'
import {
  useLeftDrawerOpenState,
  useRightDrawerOpenState
} from '@/hooks/use-drawer-open-state'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {observer} from 'mobx-react-lite'
import {ReactNode} from 'react'
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

  return (
    <Drawer
      id="left-drawer"
      open={leftDrawerOpen()}
      mobile={isMobile || state.drawerOpenByHover}
      side={
        user ? (
          <DrawerWrapper>
            <DrawerMenu />
          </DrawerWrapper>
        ) : null
      }
      onClickOverlay={onLeftDrawerClickOverlay}
    >
      <Drawer
        id="right-drawer"
        end
        open={state.rightDrawerOpen}
        mobile={isMobile}
        side={
          user ? (
            <DrawerWrapper>
              <TabsComponent />
            </DrawerWrapper>
          ) : null
        }
        onClickOverlay={onRightDrawerClickOverlay}
      >
        <Navbar />
        {children}
      </Drawer>
    </Drawer>
  )
})

const TwDrawerWrapper = tw.div`
  flex
  flex-col
  h-full
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
      <Tabs className="flex justify-between">
        <TwTab
          value="info"
          onChange={e => store.setTab(e.target.value as Tab)}
          label="Tab 1"
          groupName="right_drawer"
          active={state.tab === 'info'}
        />
        <Tabs.TabContent>
          <ModalPost />
        </Tabs.TabContent>

        <TwTab
          value="chat"
          onChange={e => store.setTab(e.target.value as Tab)}
          label="Tab 2"
          groupName="right_drawer"
          active={state.tab === 'chat'}
        />
        <TwTab
          value="empty"
          onChange={e => store.setTab(e.target.value as Tab)}
          label="Tab 3"
          groupName="right_drawer"
          active={state.tab === 'empty'}
        />
      </Tabs>
    </div>
  )
})

const TwTab = tw(Tabs.Tab)`
  flex
  flex-1
`
