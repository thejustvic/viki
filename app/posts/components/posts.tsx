'use client'

import {ParallaxCardContainer} from '@/components/common/parallax-card-container'
import {Button} from '@/components/daisyui/button'
import {Card} from '@/components/daisyui/card'
import {useMemoOne} from '@/hooks/use-memo-one'
import {useUpdateSearchParams} from '@/hooks/use-update-search-params'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {IconTrash} from '@tabler/icons-react'
import {observer} from 'mobx-react-lite'
import {PropsWithChildren} from 'react'
import tw from 'tailwind-styled-components'
import {AddNewPost} from './add-new-post'
import {getSearchPost} from './get-search-post'
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

interface Props extends PropsWithChildren {
  serverPosts: Post[]
}

export const PostsProvider = ({serverPosts, children}: Props) => {
  const store = useMemoOne(() => new PostsStore(serverPosts), [])

  return <PostsContext.Provider value={store}>{children}</PostsContext.Provider>
}

export const PostsBase = () => <PostsList />

const PostsList = observer(() => {
  const {supabase, user} = useSupabase()
  const [state, store] = usePostsStore()
  const postId = getSearchPost()

  usePostsListener(user, supabase, store)

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
  const updateSearchParams = useUpdateSearchParams()
  const {removePost} = usePostHandlers()

  const remove = async () => {
    await removePost(post.id)
    updateSearchParams('post')
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
  const updateSearchParams = useUpdateSearchParams()

  const onClickHandler = () => {
    updateSearchParams('post', post.id)
  }

  return (
    <>
      <Card.Title tag="h2" className="flex justify-between">
        <Button color="ghost" className="p-0" onClick={onClickHandler}>
          <span className="w-16 truncate">{post.text}</span>
        </Button>
        <Button color="ghost" shape="circle" onClick={remove}>
          <IconTrash />
        </Button>
      </Card.Title>
      <Card.Actions className="justify-center">
        <Button color="primary" className="w-full" onClick={onClickHandler}>
          Buy Now
        </Button>
      </Card.Actions>
    </>
  )
}
