import {Post} from '@/app/posts/components/types'
import {useSupabaseFetch} from '@/hooks/use-supabase-fetch'
import {ObjUtil} from '@/utils/obj-util'
import {SupabaseContext} from '@/utils/supabase-utils/supabase-provider'
import type {PostgrestBuilder} from '@supabase/postgrest-js'
import {useCallback, useEffect} from 'react'
import {PostChecklistStore} from './post-checklist-store'
import {Checkbox} from './types'

const getChecklists = (
  postIds: Post['id'][],
  supabase: SupabaseContext['supabase']
): PostgrestBuilder<Checkbox[]> => {
  return supabase
    .from('checklist')
    .select()
    .in('post_id', postIds)
    .throwOnError()
}

const useSupabaseChecklistListener = (
  supabase: SupabaseContext['supabase'],
  postIds: Post['id'][],
  store: PostChecklistStore
): void => {
  useEffect(() => {
    if (!postIds) {
      return
    }
    const channel = supabase
      .channel('post-checklist')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'checklist'
        },
        payload =>
          store.handleInsert(
            payload.new.post_id as Checkbox['post_id'],
            payload.new as Checkbox
          )
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
          table: 'checklist'
        },
        payload =>
          store.handleUpdate(
            payload.new.post_id as Checkbox['post_id'],
            payload.old as Checkbox,
            payload.new as Checkbox
          )
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, store, postIds])
}

export const usePostChecklistListener = ({
  postIds,
  supabase,
  store
}: {
  postIds: Post['id'][]
  supabase: SupabaseContext['supabase']
  store: PostChecklistStore
}): void => {
  const fetchChecklists = useCallback(() => {
    if (!postIds) {
      return null
    }
    return getChecklists(postIds, supabase)
  }, [postIds, supabase])

  const {data, loading, error} = useSupabaseFetch(fetchChecklists, [postIds])

  useEffect(() => {
    const checkboxes = ObjUtil.groupBy(data ?? [], 'post_id')
    store.setChecklists({loading, data: checkboxes, error})
  }, [data, loading, error, store])

  useSupabaseChecklistListener(supabase, postIds, store)
}
