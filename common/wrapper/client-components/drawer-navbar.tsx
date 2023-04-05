'use client'

import {PerfectScrollbar} from '@/common/perfect-scrollbar'
import {useBoolean} from '@/hooks/use-boolean'
import {useGlobalKeyDown} from '@/hooks/use-global-key-down'
import {headerHeight} from '@/utils/consts'
import {ReactNode} from 'react'
import {Drawer} from 'react-daisyui'
import {DrawerMenu} from '../../drawer-menu'
import {Navbar} from '../../navbar'

interface Props {
  children: ReactNode
}

export const DrawerNavbar = ({children}: Props) => {
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
      <div style={{height: `calc(100% - ${headerHeight})`}}>
        <PerfectScrollbar>{children}</PerfectScrollbar>
      </div>
    </Drawer>
  )
}
