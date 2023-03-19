import {SupabaseContext} from '@/utils/supabase-utils/supabase-provider'
import {useEffect} from 'react'
import {PostsStore} from './posts-store'
import {Post} from './types'

export const usePostsListener = (
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
              store.handleDelete(payload.old as Post)
            case 'INSERT':
              store.handleInsert(payload.new as Post)
            case 'UPDATE':
              store.handleUpdate(payload.old as Post, payload.new as Post)
          }
          console.info(payload)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, store])
}
