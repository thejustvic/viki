'use client'

import {useBoolean} from '@/hooks/use-boolean'
import {ReactNode} from 'react'
import {Drawer} from 'react-daisyui'
import tw from 'tailwind-styled-components'
import {DrawerMenu} from '../../drawer-menu'
import {Navbar} from '../../navbar'

const TwChildren = tw.div`
  overflow-y-scroll
  scrollbar-sm
  md:scrollbar
`

interface Props {
  children: ReactNode
}

export const DrawerNavbar = ({children}: Props) => {
  const drawerOpen = useBoolean(false)

  return (
    <Drawer
      open={drawerOpen.value}
      onClickOverlay={drawerOpen.turnOff}
      side={<DrawerMenu toggleDrawer={drawerOpen.toggle} />}
    >
      <Navbar toggleMenu={drawerOpen.toggle} />
      <TwChildren>{children}</TwChildren>
    </Drawer>
  )
}
