'use client'

import {ModalPost} from '@/app/posts/utils/modal-post/modal-post'
import {PerfectScrollbar} from '@/components/common/perfect-scrollbar'
import {useGlobalStore} from '@/components/global/global-store'
import {useDrawerOpenState} from '@/hooks/use-drawer-open-state'
import {headerHeight} from '@/utils/const'
import {observer} from 'mobx-react-lite'
import {useSearchParams} from 'next/navigation'
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

  useDrawerOpenState()

  const mobileDrawerOpen = !state.drawerOpenByHover && state.drawerOpen

  const searchParams = useSearchParams()
  const postId = searchParams.get('post')

  return (
    <Drawer
      open={isMobile ? state.drawerOpen : state.drawerOpenByHover}
      mobile={isMobile || mobileDrawerOpen}
      side={<DrawerMenu />}
    >
      <Drawer
        mobile={Boolean(postId)}
        side={Boolean(postId) && <ModalPost />}
        end
      >
        <Navbar />
        <div style={{height: `calc(100% - ${headerHeight})`}}>
          <PerfectScrollbar>{children}</PerfectScrollbar>
        </div>
      </Drawer>
    </Drawer>
  )
})
