'use client'

import {ModalPost} from '@/app/posts/utils/modal-post/modal-post'
import {PerfectScrollbar} from '@/components/common/perfect-scrollbar'
import {useGlobalStore} from '@/components/global/global-store'
import {
  useLeftDrawerOpenState,
  useRightDrawerOpenState
} from '@/hooks/use-drawer-open-state'
import {headerHeight} from '@/utils/const'
import {Util} from '@/utils/util'
import {observer} from 'mobx-react-lite'
import {usePathname, useRouter, useSearchParams} from 'next/navigation'
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
        side={<ModalPost />}
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
