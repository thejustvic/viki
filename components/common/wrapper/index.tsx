import 'server-only'

import {ReactNode} from 'react'
import {DrawerNavbar} from './client-components/drawer-navbar'

interface Props {
  children: ReactNode
}

export default function Wrapper({children}: Props) {
  return <DrawerNavbar>{children}</DrawerNavbar>
}
