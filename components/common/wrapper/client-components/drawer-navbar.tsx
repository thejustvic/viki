'use client'

import {useGlobalStore} from '@/components/common/global/global-store'
import {PerfectScrollbar} from '@/components/common/perfect-scrollbar'
import {useGlobalKeyDown} from '@/hooks/use-global-key-down'
import {useMousePosition} from '@/hooks/use-mouse-position'
import {headerHeight} from '@/utils/const'
import {observer} from 'mobx-react-lite'
import {ReactNode, useEffect} from 'react'
import {Drawer} from 'react-daisyui'
import {isMobile} from 'react-device-detect'
import {DrawerMenu} from '../../drawer-menu'
import {Navbar} from '../../navbar'

interface Props {
  children: ReactNode
}

export const DrawerNavbar = observer(({children}: Props) => {
  const [state, store] = useGlobalStore()
  const {x} = useMousePosition()

  const closeDrawer = () => {
    store.setDrawerClosed()
  }

  useGlobalKeyDown({
    escape: () => state.drawerOpen && closeDrawer()
  })

  useEffect(() => {
    if (!state.drawerOpen && !state.drawerOpenByHover && Number(x) < 10) {
      store.setDrawerOpen(true)
    }
    if (state.drawerOpen && state.drawerOpenByHover && Number(x) > 400) {
      store.setDrawerClosed(false)
    }
  }, [x])

  return (
    <Drawer
      mobile={isMobile}
      open={state.drawerOpen}
      onClickOverlay={closeDrawer}
      side={<DrawerMenu />}
    >
      <Navbar />
      <div style={{height: `calc(100% - ${headerHeight})`}}>
        <PerfectScrollbar>{children}</PerfectScrollbar>
      </div>
    </Drawer>
  )
})
