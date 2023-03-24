'use client'

import {PostContainer} from '@/common/post'
import {useRemoveHash} from '@/hooks/use-remove-hash'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {observer} from 'mobx-react-lite'
import {useState} from 'react'
import tw from 'tailwind-styled-components'
import {PostsContext, PostsStore, usePostsStore} from './posts-store'
import {Post} from './types'
import {usePostsListener} from './use-posts-listener'

const TwContainer = tw.div`
  flex
  gap-8
  m-8
`

interface Props {
  serverPosts: Post[]
}

export default observer(({serverPosts}: Props) => {
  const {supabase} = useSupabase()
  const [store] = useState(() => new PostsStore(serverPosts))

  useRemoveHash()
  usePostsListener(supabase, store)

  return (
    <PostsContext.Provider value={store}>
      <Posts />
    </PostsContext.Provider>
  )
})

const Posts = observer(() => {
  const [state] = usePostsStore()
  return (
    <TwContainer>
      {state.posts.map(post => {
        return <Post post={post} key={post.id} />
      })}
    </TwContainer>
  )
})

const Post = observer(({post}: {post: Post}) => {
  return <PostContainer title={post.text} />
})
