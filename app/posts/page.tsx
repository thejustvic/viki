import 'server-only'

import ChatProvider from '@/components/chat/chat-provider'
import {Load} from '@/components/common/load'
import {DrawerWrapper} from '@/components/common/wrapper/client-components/drawer-wrapper'
import {getServerChat} from '@/utils/supabase-utils/get-server-chat'
import {createClient} from '@/utils/supabase-utils/supabase-server'
import {Suspense} from 'react'
import {PostsBase, PostsProvider} from './components/posts'

interface Props {
  searchParams: Promise<{[key: string]: string | string[] | undefined}>
}

const fetchData = async () => {
  const supabase = await createClient()
  const {data} = await supabase.from('posts').select('*')
  return data
}

export default async function PostsPage({searchParams}: Props) {
  const serverPosts = await fetchData()
  const params = await searchParams
  const postId = (params?.post as string) || ''
  const serverChat = await getServerChat(postId)

  return (
    <Suspense fallback={<Load center />}>
      <ChatProvider serverChat={serverChat || []}>
        <PostsProvider serverPosts={serverPosts || []}>
          <DrawerWrapper>
            <PostsBase />
          </DrawerWrapper>
        </PostsProvider>
      </ChatProvider>
    </Suspense>
  )
}
