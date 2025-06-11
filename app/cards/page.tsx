import 'server-only'

import {CardChecklistProvider} from '@/components/cards/card-checklist/card-checklist-provider'
import {CardsBase, CardsProvider} from '@/components/cards/cards'
import ChatProvider from '@/components/chat/chat-provider'
import {DrawerWrapper} from '@/components/common/drawer/drawer-wrapper'

export default async function CardsPage() {
  return (
    <ChatProvider>
      <CardsProvider>
        <CardChecklistProvider>
          <DrawerWrapper>
            <CardsBase />
          </DrawerWrapper>
        </CardChecklistProvider>
      </CardsProvider>
    </ChatProvider>
  )
}
