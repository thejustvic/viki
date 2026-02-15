'use client'

import {DrawerLeft} from '@/components/common/drawer/drawer-left'
import {DrawerRight} from '@/components/common/drawer/drawer-right'
import {Navbar} from '@/components/common/navbar/navbar'
import {PerfectScrollbar} from '@/components/common/perfect-scrollbar'
import {headerHeight} from '@/utils/const'
import {observer} from 'mobx-react-lite'
import {ReactNode} from 'react'
import {isMobile} from 'react-device-detect'
import {twJoin} from 'tailwind-merge'

interface Props {
  children: ReactNode
}

export const DrawerWrapper = observer(({children}: Props) => {
  return (
    <DrawerLeft>
      <DrawerRight>
        <Navbar />
        <PerfectScrollbar
          className="h-dvh bg-base-300/20"
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
