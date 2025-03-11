'use client'

import {useCheckboxHandlers} from '@/components/checklist/checkbox/checkbox-handlers'
import {ChecklistProgress} from '@/components/checklist/checklist-progress'
import ChecklistProvider from '@/components/checklist/checklist-provider'
import {useChecklistStore} from '@/components/checklist/checklist-store'
import {ParallaxCardContainer} from '@/components/common/parallax-card-container'
import {Button} from '@/components/daisyui/button'
import {Card} from '@/components/daisyui/card'
import {useTeamStore} from '@/components/team/team-store'
import {useLoggingOff} from '@/hooks/use-logging-off'
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
import {
  useCheckPostExistInCurrentTeam,
  usePostsListener
} from './use-posts-listener'

const TwContainer = tw.div`
  flex
  gap-8
  m-8
  flex-wrap
  justify-center
  md:justify-start
`

export const PostsProvider = observer(({children}: PropsWithChildren) => {
  const store = useMemoOne(() => new PostsStore(), [])
  const {supabase, user} = useSupabase()
  const [state] = useTeamStore()

  usePostsListener({user, supabase, store, currentTeamId: state.currentTeamId})

  return <PostsContext.Provider value={store}>{children}</PostsContext.Provider>
})

export const PostsBase = () => <PostsList />

const PostsList = observer(() => {
  useCheckPostExistInCurrentTeam()
  useLoggingOff()

  return (
    <TwContainer>
      <Posts />
      <AddNewPost />
    </TwContainer>
  )
})

const Posts = observer(() => {
  const [state, store] = usePostsStore()
  const postId = getSearchPost()

  if (state.posts.loading) {
    return Array(3)
      .fill(null)
      .map((_el, inx) => (
        <div key={inx} className="skeleton w-[288px] h-[142px] md:w-[190px]" />
      ))
  }

  if (state.posts.error) {
    return <div className="text-error">{state.posts.error.message}</div>
  }

  return store
    .searchedPosts()
    .map(post => <Post post={post} key={post.id} active={postId === post.id} />)
})

const Post = observer(({post, active}: {post: Post; active: boolean}) => {
  const updateSearchParams = useUpdateSearchParams()
  const {removePost} = usePostHandlers()

  const remove = async () => {
    await removePost(post.id)
    updateSearchParams('post')
  }

  return (
    <ChecklistProvider id={post.id}>
      <ParallaxCardContainer
        active={active}
        cardNodeBody={<CardBody post={post} remove={remove} />}
      />
    </ChecklistProvider>
  )
})

interface PostProps {
  post: Post
  remove: () => void
}

const CardBody = observer(({post, remove}: PostProps) => {
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
          <ChecklistProgress />
        </Button>
      </Card.Actions>
    </>
  )
})

export const CheckAllCheckboxes = observer(() => {
  const [state] = useChecklistStore()
  const {updateAllCheckboxIsCompleted} = useCheckboxHandlers()
  const isAllCompleted = state.progress === 100

  return (
    <div className="tooltip tooltip-info" data-tip="all">
      <input
        type="checkbox"
        checked={isAllCompleted}
        className="checkbox text-success"
        onChange={() =>
          updateAllCheckboxIsCompleted(!isAllCompleted, state.checklist.data)
        }
      />
    </div>
  )
})
