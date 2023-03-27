'use client'

import {PostContainer} from '@/common/post'
import {useMemoOne} from '@/hooks/use-memo-one'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {observer} from 'mobx-react-lite'
import tw from 'tailwind-styled-components'
import {AddNew} from '../add-new'
import {PostsContext, PostsStore, usePostsStore} from './posts-store'
import {Post} from './types'
import {usePostsListener} from './use-posts-listener'

const TwContainer = tw.div`
  flex
  gap-8
  m-8
  flex-wrap
`

interface Props {
  serverPosts: Post[]
}

export const Posts = ({serverPosts}: Props) => {
  const store = useMemoOne(() => new PostsStore(serverPosts), [])

  return (
    <PostsContext.Provider value={store}>
      <PostsBase />
    </PostsContext.Provider>
  )
}

const PostsBase = observer(() => {
  const {supabase} = useSupabase()
  const [state, store] = usePostsStore()
  usePostsListener(supabase, store)

  return (
    <TwContainer>
      {state.posts.map(post => (
        <Post post={post} key={post.id} />
      ))}
      <AddNew />
    </TwContainer>
  )
})

const Post = observer(({post}: {post: Post}) => {
  const {supabase} = useSupabase()
  const remove = async () => {
    await supabase.from('posts').delete().eq('id', post.id)
  }
  return <PostContainer title={post.text} remove={remove} />
})
