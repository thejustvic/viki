'use client'

import {useBoolean} from '@/hooks/use-boolean'
import {ReactNode} from 'react'
import {Drawer} from 'react-daisyui'
import {default as DrawerContent} from '../../drawer'
import Navbar from '../../navbar'

interface Props {
  children: ReactNode
}

export const DrawerNavbar = ({children}: Props) => {
  const drawerOpen = useBoolean(false)

  return (
    <Drawer
      open={drawerOpen.value}
      onClickOverlay={drawerOpen.turnOff}
      side={<DrawerContent toggleDrawer={drawerOpen.toggle} />}
    >
      <Navbar toggleMenu={drawerOpen.toggle} />
      <div className="overflow-y-scroll scrollbar-sm md:scrollbar">
        {children}
      </div>
    </Drawer>
  )
}
