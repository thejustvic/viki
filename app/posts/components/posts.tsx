'use client'

import {ParallaxCardContainer} from '@/components/common/parallax-card-container'
import {useMemoOne} from '@/hooks/use-memo-one'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {Util} from '@/utils/util'
import {IconTrash} from '@tabler/icons-react'
import {observer} from 'mobx-react-lite'
import {usePathname, useRouter, useSearchParams} from 'next/navigation'
import {Button, Card} from 'react-daisyui'
import tw from 'tailwind-styled-components'
import {AddNewPost} from './add-new-post'
import {ModalCreatePost} from './modal-create-post/modal-create-post'
import {usePostHandlers} from './posts-handlers'
import {PostsContext, PostsStore, usePostsStore} from './posts-store'
import type {Post} from './types'
import {usePostsListener} from './use-posts-listener'

const TwContainer = tw.div`
  flex
  gap-8
  m-8
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
  const {supabase, user} = useSupabase()
  const [state, store] = usePostsStore()
  usePostsListener(user, supabase, store)
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

  return (
    <ParallaxCardContainer
      active={active}
      cardNodeBody={<CardBody post={post} remove={remove} />}
    />
  )
})

interface PostProps {
  post: Post
  remove: () => void
}

const CardBody = ({post, remove}: PostProps) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const onClickHandler = () => {
    const queryString = new URLSearchParams(searchParams)
    queryString.set('post', post.id)
    Util.routerPushQuery(router, queryString, pathname)
  }

  return (
    <>
      <Card.Title tag="h2" className="flex justify-between">
        <Button color="ghost" onClick={onClickHandler}>
          <span className="w-16 truncate">{post.text}</span>
        </Button>
        <Button color="ghost" shape="circle" onClick={remove}>
          <IconTrash />
        </Button>
      </Card.Title>
      <Card.Actions className="justify-center">
        <Button color="primary" fullWidth onClick={onClickHandler}>
          Buy Now
        </Button>
      </Card.Actions>
    </>
  )
}
