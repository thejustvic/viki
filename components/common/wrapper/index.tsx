import 'server-only'

import {ReactNode} from 'react'
import {DrawerWrapper} from './client-components/drawer-wrapper'

interface Props {
  children: ReactNode
}

export default function Wrapper({children}: Props) {
  return <DrawerWrapper>{children}</DrawerWrapper>
}
