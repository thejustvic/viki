import {Post} from '@/app/posts/components/types'
import {useSupabaseFetch} from '@/hooks/use-supabase-fetch'
import {SupabaseContext} from '@/utils/supabase-utils/supabase-provider'
import type {PostgrestBuilder} from '@supabase/postgrest-js'
import {useEffect} from 'react'
import {ChecklistStore} from './checklist-store'
import {Checkbox} from './types'

const getChecklist = (
  postId: Post['id'],
  supabase: SupabaseContext['supabase']
): PostgrestBuilder<Checkbox[]> => {
  return supabase
    .from('checklist')
    .select()
    .eq('post_id', postId)
    .order('created_at')
    .throwOnError()
}

export const useChecklistListener = (
  postId: Post['id'],
  user: SupabaseContext['user'],
  supabase: SupabaseContext['supabase'],
  store: ChecklistStore
): void => {
  const {data, loading, error} = useSupabaseFetch(
    postId ? () => getChecklist(postId, supabase) : null,
    [postId]
  )

  useEffect(() => {
    store.setChecklist({
      loading,
      data,
      error
    })
  }, [data, loading, error, postId])

  useEffect(() => {
    const uuid = crypto.randomUUID()
    const channel = supabase
      .channel(uuid)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'checklist',
          filter: `post_id=eq.${postId}`
        },
        payload => {
          store.handleInsert(payload.new as Checkbox)
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'checklist'
        },
        payload => {
          store.handleDelete(payload.old as Checkbox)
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'checklist',
          filter: `post_id=eq.${postId}`
        },
        payload => {
          store.handleUpdate(payload.old as Checkbox, payload.new as Checkbox)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, store, user, postId])
}
