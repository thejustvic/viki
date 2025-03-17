'use client'

import {usePostsStore} from '@/app/posts/components/posts-store'
import {useMemoOne} from '@/hooks/use-memo-one'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {PropsWithChildren, useMemo} from 'react'
import {PostChecklistContext, PostChecklistStore} from './post-checklist-store'
import {usePostChecklistListener} from './use-post-checklist-listener'

export default function PostChecklistProvider({children}: PropsWithChildren) {
  const {user, supabase} = useSupabase()
  const [state] = usePostsStore()
  const store = useMemoOne(() => new PostChecklistStore(), [user])

  const postIds = useMemo(() => {
    if (!state.posts.data) {
      return []
    }
    return state.posts.data?.map(post => post.id)
  }, [state.posts.data])

  usePostChecklistListener({
    postIds,
    supabase,
    store
  })

  return (
    <PostChecklistContext.Provider value={store}>
      <>{children}</>
    </PostChecklistContext.Provider>
  )
}
