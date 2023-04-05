'use client'

import {useGlobalStore} from '@/common/global/global-store'
import {OverlayScrollbar} from '@/common/scrollbar/overlay-scrollbar'
import {PerfectScrollbar} from '@/common/scrollbar/perfect-scrollbar'
import {useBoolean} from '@/hooks/use-boolean'
import {useGlobalKeyDown} from '@/hooks/use-global-key-down'
import {observer} from 'mobx-react-lite'
import {ReactNode} from 'react'
import {Drawer} from 'react-daisyui'
import {DrawerMenu} from '../../drawer-menu'
import {Navbar} from '../../navbar'

interface Props {
  children: ReactNode
}

export const DrawerNavbar = observer(({children}: Props) => {
  const [state] = useGlobalStore()
  const drawerOpen = useBoolean(false)

  useGlobalKeyDown({
    escape: () => drawerOpen.value && drawerOpen.turnOff()
  })

  return (
    <Drawer
      open={drawerOpen.value}
      onClickOverlay={drawerOpen.turnOff}
      side={<DrawerMenu toggleDrawer={drawerOpen.toggle} />}
    >
      <Navbar toggleMenu={drawerOpen.toggle} />
      {state.scrollbar === 'overlayscrollbars' && (
        <OverlayScrollbar>{children}</OverlayScrollbar>
      )}
      {state.scrollbar === 'perfectscrollbar' && (
        <PerfectScrollbar>{children}</PerfectScrollbar>
      )}
    </Drawer>
  )
})
