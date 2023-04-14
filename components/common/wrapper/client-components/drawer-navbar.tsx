'use client'

import {PerfectScrollbar} from '@/components/common/perfect-scrollbar'
import {useGlobalStore} from '@/components/global/global-store'
import {useDrawerOpenState} from '@/hooks/use-drawer-open-state'
import {useGlobalKeyDown} from '@/hooks/use-global-key-down'
import {headerHeight} from '@/utils/const'
import {observer} from 'mobx-react-lite'
import {ReactNode} from 'react'
import {Drawer} from 'react-daisyui'
import {isMobile} from 'react-device-detect'
import {DrawerMenu} from '../../drawer-menu'
import {Navbar} from '../../navbar'

interface Props {
  children: ReactNode
}

export const DrawerNavbar = observer(({children}: Props) => {
  const [state, store] = useGlobalStore()

  const closeDrawer = () => {
    store.setDrawerClosed()
  }

  useDrawerOpenState()
  useGlobalKeyDown({
    escape: () => state.drawerOpen && closeDrawer()
  })

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
