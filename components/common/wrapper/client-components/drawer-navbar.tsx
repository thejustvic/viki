'use client'

import {PerfectScrollbar} from '@/components/common/perfect-scrollbar'
import {useGlobalStore} from '@/components/global/global-store'
import {useDrawerOpenState} from '@/hooks/use-drawer-open-state'
import {headerHeight} from '@/utils/const'
import {observer} from 'mobx-react-lite'
import {ReactNode, useEffect, useRef} from 'react'
import {Drawer} from 'react-daisyui'
import {isMobile} from 'react-device-detect'
import {DrawerMenu} from '../../drawer-menu'
import {Navbar} from '../../navbar'

interface Props {
  children: ReactNode
}

export const DrawerNavbar = observer(({children}: Props) => {
  const [state, store] = useGlobalStore()
  const ref = useRef<HTMLDivElement>(null)

  useDrawerOpenState()

  useEffect(() => {
    const height = `
      height: calc(100vh - ${headerHeight}); /* fallback for Firefox, IE and etc. */
      height: calc(100svh - ${headerHeight});
    `
    ref.current?.setAttribute('style', height)
  }, [])

  const closeDrawer = () => {
    store.setDrawerClosed()
  }

  const mobileDrawerOpen = !state.drawerOpenByHover && state.drawerOpen

  return (
    <Drawer
      open={isMobile ? state.drawerOpen : state.drawerOpenByHover}
      mobile={isMobile || mobileDrawerOpen}
      onClickOverlay={closeDrawer}
      side={<DrawerMenu />}
    >
      <Navbar />
      <div ref={ref} style={{height: `calc(100% - ${headerHeight})`}}>
        <PerfectScrollbar>{children}</PerfectScrollbar>
      </div>
    </Drawer>
  )
})
