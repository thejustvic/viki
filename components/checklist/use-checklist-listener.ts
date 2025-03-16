import {Post} from '@/app/posts/components/types'
import {useSupabaseFetch} from '@/hooks/use-supabase-fetch'
import {SupabaseContext} from '@/utils/supabase-utils/supabase-provider'
import type {PostgrestBuilder} from '@supabase/postgrest-js'
import {useCallback, useEffect} from 'react'
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

// Reusable Supabase Listener Hook
const useSupabaseChecklistListener = (
  supabase: SupabaseContext['supabase'],
  postId: Post['id'],
  store: ChecklistStore
): void => {
  useEffect(() => {
    if (!postId) {
      return
    }

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
        payload => store.handleInsert(payload.new as Checkbox)
      )
      .on(
        'postgres_changes',
        {event: 'DELETE', schema: 'public', table: 'checklist'},
        payload => store.handleDelete(payload.old as Checkbox)
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'checklist',
          filter: `post_id=eq.${postId}`
        },
        payload =>
          store.handleUpdate(payload.old as Checkbox, payload.new as Checkbox)
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, store, postId])
}

// Fetch checklist and listen for updates
export const useChecklistListener = ({
  postId,
  supabase,
  store
}: {
  postId: Post['id']
  supabase: SupabaseContext['supabase']
  store: ChecklistStore
}): void => {
  // Memoize the fetch function so it doesn't get recreated unnecessarily
  const fetchChecklist = useCallback(() => {
    if (!postId) {
      return null
    }
    return getChecklist(postId, supabase)
  }, [postId, supabase])

  // Fetch checklist data using the useSupabaseFetch hook
  const {data, loading, error} = useSupabaseFetch(fetchChecklist, [postId])

  useEffect(() => {
    // Avoid updating the store if it's still loading
    if (!loading) {
      store.setChecklist({loading, data, error})
    }
  }, [data, loading, error, store])

  // Reuse the listener for changes in the checklist
  useSupabaseChecklistListener(supabase, postId, store)
}
