'use client'

import {ModalPost} from '@/app/posts/utils/modal-post/modal-post'
import {PerfectScrollbar} from '@/components/common/perfect-scrollbar'
import {useGlobalStore} from '@/components/global/global-store'
import {
  useLeftDrawerOpenState,
  useRightDrawerOpenState
} from '@/hooks/use-drawer-open-state'
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
  const [state] = useGlobalStore()

  useLeftDrawerOpenState()
  useRightDrawerOpenState()

  const mobileLeftDrawerOpen = !state.drawerOpenByHover && state.leftDrawerOpen
  const mobileRightDrawerOpen = state.rightDrawerOpen

  return (
    <Drawer
      open={isMobile ? state.leftDrawerOpen : state.drawerOpenByHover}
      mobile={isMobile || mobileLeftDrawerOpen}
      side={<DrawerMenu />}
    >
      <Drawer
        end
        open={state.rightDrawerOpen}
        mobile={isMobile || mobileRightDrawerOpen}
        side={<ModalPost />}
        contentClassName="overflow-x-hidden"
      >
        <Navbar />
        <div style={{height: `calc(100% - ${headerHeight})`}}>
          <PerfectScrollbar>{children}</PerfectScrollbar>
        </div>
      </Drawer>
    </Drawer>
  )
})
