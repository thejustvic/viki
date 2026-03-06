import 'server-only'

import {CardsList} from '@/components/cards/cards-list'
import {DrawerWrapper} from '@/components/common/drawer/drawer-wrapper'
import {Load} from '@/components/common/load'
import {Suspense} from 'react'

export default async function CardsPage() {
  return (
    <Suspense fallback={<Load center />}>
      <DrawerWrapper>
        <CardsList />
      </DrawerWrapper>
    </Suspense>
  )
}
