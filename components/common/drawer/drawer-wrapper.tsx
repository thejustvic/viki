'use client'

import {DrawerLeft} from '@/components/common/drawer/drawer-left'
import {Navbar} from '@/components/common/navbar/navbar'
import {SimpleScrollbar} from '@/components/common/simple-scrollbar'
import {headerHeight} from '@/utils/const'
import {observer} from 'mobx-react-lite'
import dynamic from 'next/dynamic'
import {ReactNode} from 'react'
import {isMobile} from 'react-device-detect'
import {twJoin} from 'tailwind-merge'

const DrawerRightClient = dynamic(
  () =>
    import('@/components/common/drawer/drawer-right').then(mod =>
      Promise.resolve(mod.DrawerRight)
    ),
  {
    ssr: false
  }
)

interface Props {
  children: ReactNode
}

export const DrawerWrapper = observer(({children}: Props) => {
  return (
    <DrawerLeft>
      <DrawerRightClient>
        <Navbar />
        <div
          className="bg-base-300/20"
          style={{height: `calc(100% - ${headerHeight})`}}
        >
          <SimpleScrollbar>{children}</SimpleScrollbar>
        </div>
      </DrawerRightClient>
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
