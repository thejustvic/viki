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
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
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
  const {session} = useSupabase()
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
      side={session ? <DrawerMenu /> : null}
      onClickOverlay={onLeftDrawerClickOverlay}
    >
      <Drawer
        end
        open={state.rightDrawerOpen}
        mobile={isMobile || mobileRightDrawerOpen}
        side={session ? <TabsComponent /> : null}
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
  const [state, store] = useGlobalStore()

  return (
    <div className="border border-base-300">
      <Drag />
      <Tabs
        value={state.tab}
        onChange={store.setTab}
        variant="lifted"
        size="lg"
        style={{width: state.rightDrawerWidth}}
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
    <TwDragWrap onMouseDown={handleMouseDown} $show={mouseDown.value}>
      <DragSvg />
    </TwDragWrap>
  )
})

const TwDragWrap = tw.div<{$show: boolean}>`
  absolute
  left-0
  h-full
  p-0
  pr-2
  w-1
  z-10
  group
  cursor-col-resize
  opacity-0
  hover:opacity-100
  transition-opacity
  ease-in-out
  delay-150
  duration-200
  ${p => p.$show && 'opacity-100'}
`

const DragSvg = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className={`h-2.5 w-2.5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}
    >
      <circle cx="9" cy="12" r="1"></circle>
      <circle cx="9" cy="5" r="1"></circle>
      <circle cx="9" cy="19" r="1"></circle>
      <circle cx="15" cy="12" r="1"></circle>
      <circle cx="15" cy="5" r="1"></circle>
      <circle cx="15" cy="19" r="1"></circle>
    </svg>
  )
}
