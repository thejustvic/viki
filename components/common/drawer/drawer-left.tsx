import {DrawerMenu} from '@/components/common/drawer-menu'
import {DrawerContentWrapper} from '@/components/common/drawer/drawer-wrapper'
import {Drawer} from '@/components/daisyui/drawer'
import {useGlobalStore} from '@/components/global-provider/global-store'
import {useLeftDrawerOpenState} from '@/hooks/use-drawer-open-state'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {observer} from 'mobx-react-lite'
import {PropsWithChildren} from 'react'
import {isMobile} from 'react-device-detect'

export const DrawerLeft = observer(({children}: PropsWithChildren) => {
  useLeftDrawerOpenState()
  const [state, store] = useGlobalStore()
  const {user} = useSupabase()

  const onLeftDrawerClickOverlay = () => {
    store.setLeftDrawerClosed()
  }

  // disable swipe
  // const leftSwipeHandlers = useSwipeable({
  //   onSwipedLeft: () => store.setLeftDrawerClosed()
  // })

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

  if (isMobile) {
    return children
  }

  return (
    <Drawer
      id="left-drawer"
      open={leftDrawerOpen()}
      mobile={state.drawerOpenByHover}
      side={user && state.leftDrawerOpen ? <LeftDrawerSide /> : null}
      onClickOverlay={onLeftDrawerClickOverlay}
      contentClassName="h-dvh"
      // {...leftSwipeHandlers} // disable swipe
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
