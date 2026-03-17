'use client'

import {Navbar} from '@/components/common/navbar/navbar'
import {SimpleScrollbar} from '@/components/common/simple-scrollbar'
import {headerHeight} from '@/utils/const'
import {observer} from 'mobx-react-lite'
import dynamic from 'next/dynamic'
import {ReactNode} from 'react'
import {isMobile} from 'react-device-detect'
import tw from '../tw-styled-components'

const DrawerLeftClient = dynamic(
  () =>
    import('@/components/common/drawer/drawer-left').then(mod =>
      Promise.resolve(mod.DrawerLeft)
    ),
  {
    ssr: false
  }
)

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
    <DrawerLeftClient>
      <DrawerRightClient>
        <Navbar />
        <div
          className="bg-base-300/20"
          style={{height: `calc(100% - ${headerHeight}px)`}}
        >
          <SimpleScrollbar>{children}</SimpleScrollbar>
        </div>
      </DrawerRightClient>
    </DrawerLeftClient>
  )
})

interface ITwDrawerContentWrapper {
  $isMobile: boolean
}
const TwDrawerContentWrapper = tw.div<ITwDrawerContentWrapper>`
  ${({$isMobile}) => $isMobile && 'w-full'}
  flex
  flex-col
  h-full
`

// needed for fast width style change in inner component
export const DrawerContentWrapper = ({children}: React.PropsWithChildren) => {
  return (
    <TwDrawerContentWrapper $isMobile={isMobile}>
      {children}
    </TwDrawerContentWrapper>
  )
}
