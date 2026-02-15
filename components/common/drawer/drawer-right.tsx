import {Drawer} from '@/components/daisyui/drawer'
import {useGlobalStore} from '@/components/global-provider/global-store'
import {useRightDrawerOpenState} from '@/hooks/use-drawer-open-state'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {observer} from 'mobx-react-lite'
import {PropsWithChildren} from 'react'
import {isMobile} from 'react-device-detect'
import {TabsComponent} from './drawer-tabs'
import {DrawerContentWrapper} from './drawer-wrapper'

export const DrawerRight = observer(({children}: PropsWithChildren) => {
  const [state, store] = useGlobalStore()
  const {user} = useSupabase()
  useRightDrawerOpenState()
  // disable swipe
  // const {handleRightSwipe, handleLeftSwipe} = useSwipeableHandlers()
  // const rightSwipeHandlers = useSwipeable({
  //   onSwipedRight: handleRightSwipe,
  //   onSwipedLeft: handleLeftSwipe
  // })

  return (
    <Drawer
      id="right-drawer"
      end
      open={state.rightDrawerOpen}
      mobile={isMobile}
      side={user && state.rightDrawerOpen ? <RightDrawerSide /> : null}
      onClickOverlay={store.setRightDrawerClosed}
      contentClassName="h-dvh"
      // {...rightSwipeHandlers} // disable swipe
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

interface Handlers {
  handleRightSwipe: () => void
  handleLeftSwipe: () => void
}

export const useSwipeableHandlers = (): Handlers => {
  const [state, store] = useGlobalStore()

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
      case 'visual': {
        store.setTab('chat')
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
      case 'chat': {
        store.setTab('visual')
        return
      }
    }
  }

  return {
    handleRightSwipe,
    handleLeftSwipe
  }
}
