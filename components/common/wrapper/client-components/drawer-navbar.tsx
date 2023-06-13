'use client'

import {ModalPost} from '@/app/posts/utils/modal-post/modal-post'
import {PerfectScrollbar} from '@/components/common/perfect-scrollbar'
import {useGlobalStore} from '@/components/global/global-store'
import {useBoolean} from '@/hooks/use-boolean'
import {
  useLeftDrawerOpenState,
  useRightDrawerOpenState
} from '@/hooks/use-drawer-open-state'
import {headerHeight} from '@/utils/const'
import {Util} from '@/utils/util'
import {observer} from 'mobx-react-lite'
import {usePathname, useRouter, useSearchParams} from 'next/navigation'
import {ReactNode, useCallback, useEffect, useState} from 'react'
import {Drawer, Tabs} from 'react-daisyui'
import {isMobile} from 'react-device-detect'
import tw from 'tailwind-styled-components'
import {DrawerMenu} from '../../drawer-menu'
import {Navbar} from '../../navbar'

interface Props {
  children: ReactNode
}

export const DrawerNavbar = observer(({children}: Props) => {
  const [state, store] = useGlobalStore()
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  useLeftDrawerOpenState()
  useRightDrawerOpenState()

  const mobileLeftDrawerOpen = !state.drawerOpenByHover && state.leftDrawerOpen
  const mobileRightDrawerOpen = state.rightDrawerOpen

  const onLeftDrawerClickOverlay = () => {
    store.setLeftDrawerClosed()
  }

  const onRightDrawerClickOverlay = () => {
    store.setRightDrawerClosed()
    const postId = searchParams.get('post')
    if (postId) {
      store.setLastPostId(postId)
      const queryString = Util.deleteQueryParam(searchParams, 'post')
      Util.routerPushQuery(router, queryString, pathname)
    }
  }

  return (
    <Drawer
      open={isMobile ? state.leftDrawerOpen : state.drawerOpenByHover}
      mobile={isMobile || mobileLeftDrawerOpen}
      side={<DrawerMenu />}
      onClickOverlay={onLeftDrawerClickOverlay}
    >
      <Drawer
        end
        open={state.rightDrawerOpen}
        mobile={isMobile || mobileRightDrawerOpen}
        side={<TabsComponent />}
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

const TabsComponent = observer(() => {
  const [tabValue, setTabValue] = useState(0)
  const [globalStore] = useGlobalStore()
  return (
    <div className="border border-base-300">
      <Drag />
      <Tabs
        value={tabValue}
        onChange={setTabValue}
        variant="lifted"
        size="lg"
        style={{width: globalStore.rightDrawerWidth}}
        className="flex justify-between"
      >
        <TwTab value={0}>Tab 1</TwTab>
        <TwTab value={1}>Tab 2</TwTab>
        <TwTab value={2}>Tab 3</TwTab>
      </Tabs>
      {tabValue === 0 && <ModalPost />}
    </div>
  )
})

const TwTab = tw(Tabs.Tab)`
  flex
  flex-1
`

const Drag = observer(() => {
  const mouseDown = useBoolean(false)
  const [state, store] = useGlobalStore()
  const [mouseX, setMouseX] = useState({
    start: 0,
    move: 0,
    startWidth: state.rightDrawerWidth
  })

  useEffect(() => {
    if (!mouseDown.value) {
      return
    }
    const width = mouseX.startWidth + mouseX.move
    if (width > 320 && width < 700) {
      store.setRightDrawerWidth(width)
    }
  }, [mouseX.move])

  const handleMouseDown = (event: React.MouseEvent) => {
    mouseDown.turnOn()
    setMouseX({
      start: event.screenX,
      move: 0,
      startWidth: state.rightDrawerWidth
    })

    const body = document.getElementsByTagName('body')[0]
    body.style.userSelect = 'none'
    body.style.cursor = 'col-resize'
  }

  const handleMouseUp = () => {
    if (!mouseDown.value) {
      return
    }
    mouseDown.turnOff()
    setMouseX({start: 0, move: 0, startWidth: state.rightDrawerWidth})

    const body = document.getElementsByTagName('body')[0]
    body.style.userSelect = 'auto'
    body.style.cursor = 'auto'
  }

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!mouseDown.value) {
        return
      }
      setMouseX(prev => ({...prev, move: mouseX.start - event.screenX}))
    },
    [mouseDown.value]
  )

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleMouseMove, handleMouseUp])

  return (
    <TwDrag onMouseDown={handleMouseDown}>
      <TwDragRow />
    </TwDrag>
  )
})

const TwDrag = tw.div`
  absolute
  -left-2
  top-1/2
  p-2
  cursor-col-resize
`

const TwDragRow = tw.div`
  w-1
  h-6
  bg-slate-300
  rounded-2xl
`
