import {
  MaybeSession,
  SupabaseContext
} from '@/utils/supabase-utils/supabase-provider'
import {useEffect} from 'react'
import {PostsStore} from './posts-store'
import {Post} from './types'

export const usePostsListener = (
  session: MaybeSession,
  supabase: SupabaseContext['supabase'],
  store: PostsStore
) => {
  useEffect(() => {
    const channel = supabase
      .channel('*')
      .on(
        'postgres_changes',
        {event: '*', schema: 'public', table: 'posts'},
        payload => {
          switch (payload.eventType) {
            case 'DELETE':
              return store.handleDelete(payload.old as Post)
            case 'INSERT':
              return store.handleInsert(payload.new as Post)
            case 'UPDATE':
              return store.handleUpdate(
                payload.old as Post,
                payload.new as Post
              )
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, store, session])
}
