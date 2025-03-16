import {useTeamStore} from '@/components/team/team-store'
import {useSupabaseFetch} from '@/hooks/use-supabase-fetch'
import {useUpdateSearchParams} from '@/hooks/use-update-search-params'
import {SupabaseContext} from '@/utils/supabase-utils/supabase-provider'
import type {PostgrestBuilder} from '@supabase/postgrest-js'
import {useCallback, useEffect} from 'react'
import {getSearchPost} from './get-search-post'
import {PostsStore, usePostsStore} from './posts-store'
import type {Post} from './types'

// Fetch posts for a given team
const getMyPosts = (
  supabase: SupabaseContext['supabase'],
  currentTeamId: string
): PostgrestBuilder<Post[]> => {
  if (!currentTeamId) {
    throw new Error('Current team ID is required!')
  }

  return supabase.from('posts').select().eq('team_id', currentTeamId)
}

// Check if post exists in current team
export const useCheckPostExistInCurrentTeam = (): void => {
  const [teamState] = useTeamStore()
  const [postState] = usePostsStore()
  const updateSearchParams = useUpdateSearchParams()
  const postId = getSearchPost()

  const postExists = useCallback(() => {
    const post = postState.posts?.data?.find(p => p.id === postId)
    return post ? post.team_id === teamState.currentTeamId : false
  }, [postState.posts?.data, postId, teamState.currentTeamId])

  useEffect(() => {
    if (postState.posts?.data && !postExists()) {
      updateSearchParams('post')
    }
  }, [postExists, updateSearchParams])
}

// Reusable Supabase Listener Hook
const useSupabaseListener = (
  supabase: SupabaseContext['supabase'],
  currentTeamId: string | null,
  store: PostsStore
): void => {
  useEffect(() => {
    if (!currentTeamId) {
      return
    }

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
        {event: 'DELETE', schema: 'public', table: 'posts'},
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
  }, [supabase, store, currentTeamId])
}

// Fetch posts and listen for updates
export const usePostsListener = ({
  supabase,
  store,
  currentTeamId
}: {
  supabase: SupabaseContext['supabase']
  store: PostsStore
  currentTeamId: string | null
}): void => {
  const fetchPosts = useCallback(() => {
    if (!currentTeamId) {
      return null
    }
    return getMyPosts(supabase, currentTeamId)
  }, [currentTeamId, supabase])

  const {data, loading, error} = useSupabaseFetch(fetchPosts, [currentTeamId])

  useEffect(() => {
    store.setPosts({loading, data, error})
  }, [data, loading, error, store])

  useSupabaseListener(supabase, currentTeamId, store)
}
