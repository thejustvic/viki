import {DragDrawerSide} from '@/components/common/drag-drawer-side/drag-drawer-side'
import tw from '@/components/common/tw-styled-components'
import {Button} from '@/components/daisyui/button'
import {Tabs} from '@/components/daisyui/tabs'
import {useGlobalStore} from '@/components/global-provider/global-store'
import {minDrawerWidth} from '@/utils/const'
import {IconArrowBarLeft} from '@tabler/icons-react'
import {observer} from 'mobx-react-lite'
import {useEffect} from 'react'
import {isMobile} from 'react-device-detect'
import {DrawerTabChat} from './drawer-tab-chat'
import {DrawerTabChecklist} from './drawer-tab-checklist'
import {DrawerTabInfo} from './drawer-tab-info'
import {DrawerTabVisual} from './drawer-tab-visual'

const TwTabsWrapper = tw.div`
  h-full
  border
  border-y-0
  border-base-300/50
  bg-base-300/30
`

export const TabsComponent = observer(() => {
  const [state, store] = useGlobalStore()

  useEffect(() => {
    if (isMobile) {
      return
    }
    if (state.rightDrawerWidth >= window.innerWidth) {
      store.setRightDrawerWidth(minDrawerWidth)
    }
  }, [state.rightDrawerWidth])

  return (
    <TwTabsWrapper style={isMobile ? {} : {width: state.rightDrawerWidth}}>
      <DragDrawerSide drawer="right" />
      <Tabs className="flex justify-between">
        {isMobile && <CloseRightDrawer />}
        <DrawerTabInfo />
        <DrawerTabChecklist />
        {isMobile && <DrawerTabChat />}
        <DrawerTabVisual />
      </Tabs>
    </TwTabsWrapper>
  )
})

export const TwTab = tw(Tabs.Tab)`
  flex
  flex-1
`

const TwCloseRightDrawerWrapper = tw.div`
  flex
  w-10
  items-center
  text-lg
  normal-case
`

const TwCloseRightDrawerButton = tw(Button)`
  rounded-none
  rounded-l-md
  h-10
`

const CloseRightDrawer = observer(() => {
  const [, store] = useGlobalStore()
  const closeRightDrawer = () => {
    store.setRightDrawerClosed()
  }
  return (
    <TwCloseRightDrawerWrapper>
      <TwCloseRightDrawerButton soft size="xs" onClick={closeRightDrawer}>
        <IconArrowBarLeft size={16} />
      </TwCloseRightDrawerButton>
    </TwCloseRightDrawerWrapper>
  )
})
