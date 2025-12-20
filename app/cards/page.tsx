import 'server-only'

import {CardChecklistProvider} from '@/components/cards/card-checklist/card-checklist-provider'
import {CardInfoProvider} from '@/components/cards/card-info/card-info'
import {CardsBase, CardsProvider} from '@/components/cards/cards'
import ChatProvider from '@/components/chat/chat-provider'
import {DrawerWrapper} from '@/components/common/drawer/drawer-wrapper'
import {Load} from '@/components/common/load'
import {Suspense} from 'react'

export default async function CardsPage() {
  return (
    <Suspense fallback={<Load center />}>
      <ChatProvider>
        <CardsProvider>
          <CardInfoProvider>
            <CardChecklistProvider>
              <DrawerWrapper>
                <CardsBase />
              </DrawerWrapper>
            </CardChecklistProvider>
          </CardInfoProvider>
        </CardsProvider>
      </ChatProvider>
    </Suspense>
  )
}
