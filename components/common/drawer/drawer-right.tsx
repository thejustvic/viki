import {Drawer} from '@/components/daisyui/drawer'
import {useGlobalStore} from '@/components/global/global-store'
import {useRightDrawerOpenState} from '@/hooks/use-drawer-open-state'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {observer} from 'mobx-react-lite'
import {PropsWithChildren} from 'react'
import {isMobile} from 'react-device-detect'
import {useSwipeable} from 'react-swipeable'
import {TabsComponent} from './drawer-tabs'
import {DrawerContentWrapper} from './drawer-wrapper'

export const DrawerRight = observer(({children}: PropsWithChildren) => {
  const [state, store] = useGlobalStore()
  const {user} = useSupabase()
  const {handleRightSwipe, handleLeftSwipe} = useSwipeableHandlers()

  useRightDrawerOpenState()

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
      onClickOverlay={store.setRightDrawerClosed}
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

  return {
    handleRightSwipe,
    handleLeftSwipe
  }
}
