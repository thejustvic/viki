import 'server-only'

import ChatProvider from '@/components/chat/chat-provider'
import {DrawerWrapper} from '@/components/common/drawer/drawer-wrapper'
import {Load} from '@/components/common/load'
import {PostChecklistProvider} from '@/components/post-checklist/post-checklist-provider'
import {Suspense} from 'react'
import {PostsBase, PostsProvider} from './components/posts'

export default async function PostsPage() {
  return (
    <Suspense fallback={<Load center />}>
      <ChatProvider>
        <PostsProvider>
          <PostChecklistProvider>
            <DrawerWrapper>
              <PostsBase />
            </DrawerWrapper>
          </PostChecklistProvider>
        </PostsProvider>
      </ChatProvider>
    </Suspense>
  )
}
