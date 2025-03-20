'use client'

import {headerHeight} from '@/utils/const'
import {observer} from 'mobx-react-lite'
import {ReactNode} from 'react'
import {isMobile} from 'react-device-detect'
import {twJoin} from 'tailwind-merge'
import {Navbar} from '../navbar/client-components/navbar'
import {PerfectScrollbar} from '../perfect-scrollbar'
import {DrawerLeft} from './drawer-left'
import {DrawerRight} from './drawer-right'

interface Props {
  children: ReactNode
}

export const DrawerWrapper = observer(({children}: Props) => {
  return (
    <DrawerLeft>
      <DrawerRight>
        <Navbar />
        <PerfectScrollbar
          className="h-dvh"
          style={{height: `calc(100% - ${headerHeight})`}}
        >
          {children}
        </PerfectScrollbar>
      </DrawerRight>
    </DrawerLeft>
  )
})

// needed for fast width style change in inner component
export const DrawerContentWrapper = ({children}: React.PropsWithChildren) => {
  return (
    <div className={twJoin('flex flex-col h-full', isMobile && 'w-full')}>
      {children}
    </div>
  )
}
