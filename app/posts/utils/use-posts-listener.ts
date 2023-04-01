import {SupabaseContext} from '@/utils/supabase-utils/supabase-provider'
import {useEffect} from 'react'
import {PostsStore} from './posts-store'
import {Post} from './types'

export const usePostsListener = (
  session: SupabaseContext['session'],
  supabase: SupabaseContext['supabase'],
  store: PostsStore
): void => {
  useEffect(() => {
    const channel = supabase
      .channel('posts')
      .on(
        'postgres_changes',
        {event: 'INSERT', schema: 'public', table: 'posts'},
        payload => store.handleInsert(payload.new as Post)
      )
      .on(
        'postgres_changes',
        {event: 'DELETE', schema: 'public', table: 'posts'},
        payload => store.handleDelete(payload.old as Post)
      )
      .on(
        'postgres_changes',
        {event: 'UPDATE', schema: 'public', table: 'posts'},
        payload => store.handleUpdate(payload.old as Post, payload.new as Post)
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, store, session])
}
