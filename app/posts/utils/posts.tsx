'use client'

import {PostContainer} from '@/components/common/post'
import {useMemoOne} from '@/hooks/use-memo-one'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {observer} from 'mobx-react-lite'
import {useSearchParams} from 'next/navigation'
import tw from 'tailwind-styled-components'
import {AddNewPost} from './add-new-post'
import {ModalCreatePost} from './modal-create-post/modal-create-post'
import {usePostHandlers} from './posts-handlers'
import {PostsContext, PostsStore, usePostsStore} from './posts-store'
import {Post} from './types'
import {usePostsListener} from './use-posts-listener'

const TwContainer = tw.div`
  flex
  gap-8
  m-4
  flex-wrap
  justify-center
  md:justify-start
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

const PostsBase = () => (
  <>
    <ModalCreatePost />
    <PostsList />
  </>
)

const PostsList = observer(() => {
  const {supabase, session} = useSupabase()
  const [state, store] = usePostsStore()
  usePostsListener(session, supabase, store)
  const searchParams = useSearchParams()
  const postId = searchParams.get('post')

  return (
    <TwContainer>
      {state.posts.map(post => (
        <Post post={post} key={post.id} active={postId === post.id} />
      ))}
      <AddNewPost />
    </TwContainer>
  )
})

const Post = observer(({post, active}: {post: Post; active: boolean}) => {
  const {removePost} = usePostHandlers()

  const remove = async () => {
    await removePost(post.id)
  }

  return <PostContainer post={post} remove={remove} active={active} />
})
