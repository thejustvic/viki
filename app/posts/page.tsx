import 'server-only'

import ChatProvider from '@/components/chat/chat-provider'
import {Load} from '@/components/common/load'
import {DrawerWrapper} from '@/components/common/wrapper/client-components/drawer-wrapper'
import {Suspense} from 'react'
import {PostsBase, PostsProvider} from './components/posts'

export default async function PostsPage() {
  return (
    <Suspense fallback={<Load center />}>
      <ChatProvider>
        <PostsProvider>
          <DrawerWrapper>
            <PostsBase />
          </DrawerWrapper>
        </PostsProvider>
      </ChatProvider>
    </Suspense>
  )
}
