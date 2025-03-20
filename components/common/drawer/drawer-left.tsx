import {Drawer} from '@/components/daisyui/drawer'
import {useGlobalStore} from '@/components/global/global-store'
import {useLeftDrawerOpenState} from '@/hooks/use-drawer-open-state'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {observer} from 'mobx-react-lite'
import {PropsWithChildren} from 'react'
import {isMobile} from 'react-device-detect'
import {useSwipeable} from 'react-swipeable'
import {DrawerMenu} from '../drawer-menu'
import {DrawerContentWrapper} from './drawer-wrapper'

export const DrawerLeft = observer(({children}: PropsWithChildren) => {
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
