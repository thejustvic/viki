import {useTeamStore} from '@/components/team/team-store'
import {useSupabaseFetch} from '@/hooks/use-supabase-fetch'
import {useUpdateSearchParams} from '@/hooks/use-update-search-params'
import {SupabaseContext} from '@/utils/supabase-utils/supabase-provider'
import type {PostgrestBuilder} from '@supabase/postgrest-js'
import {useEffect} from 'react'
import {getSearchPost} from './get-search-post'
import {PostsStore, usePostsStore} from './posts-store'
import type {Post} from './types'

const getMyPosts = (
  user: SupabaseContext['user'],
  supabase: SupabaseContext['supabase'],
  currentTeamId: string | null
): PostgrestBuilder<Post[]> => {
  if (!user) {
    throw Error('You must provide a user object!')
  }
  if (!currentTeamId) {
    throw Error('You must provide a current team Id!')
  }

  return supabase.from('posts').select().eq('team_id', currentTeamId)
}

export const useCheckPostExistInCurrentTeam = (): void => {
  const [teamState] = useTeamStore()
  const [postState] = usePostsStore()
  const updateSearchParams = useUpdateSearchParams()
  const postId = getSearchPost()

  const checkIfPostExistInCurrentTeam = (): boolean => {
    const post = postState?.posts?.data?.find(post => post.id === postId)
    return teamState.currentTeamId === post?.team_id
  }

  useEffect(() => {
    if (!postState?.posts?.data) {
      return
    }
    if (!checkIfPostExistInCurrentTeam()) {
      updateSearchParams('post')
    }
  }, [postState?.posts?.data])
}

export const usePostsListener = ({
  user,
  supabase,
  store,
  currentTeamId
}: {
  user: SupabaseContext['user']
  supabase: SupabaseContext['supabase']
  store: PostsStore
  currentTeamId: string | null
}): void => {
  const {data, loading, error} = useSupabaseFetch(
    currentTeamId ? () => getMyPosts(user, supabase, currentTeamId) : null,
    [user, currentTeamId]
  )

  useEffect(() => {
    store.setPosts({
      loading,
      data,
      error
    })
  }, [data, loading, error])

  useEffect(() => {
    const channel = supabase
      .channel('posts')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'posts',
          filter: `team_id=eq.${currentTeamId}`
        },
        payload => store.handleInsert(payload.new as Post)
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'posts'
        },
        payload => store.handleDelete(payload.old as Post)
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'posts',
          filter: `team_id=eq.${currentTeamId}`
        },
        payload => store.handleUpdate(payload.old as Post, payload.new as Post)
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, store, user, currentTeamId])
}
