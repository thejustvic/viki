import {getSearchPost} from '@/app/posts/components/get-search-post'
import {Post} from '@/app/posts/components/types'
import {useSupabaseFetch} from '@/hooks/use-supabase-fetch'
import {Tables} from '@/utils/database.types'
import {SupabaseContext} from '@/utils/supabase-utils/supabase-provider'
import {Util} from '@/utils/util'
import type {PostgrestBuilder} from '@supabase/postgrest-js'
import {useEffect, useMemo} from 'react'
import {ChatStore} from './chat-store'
import {Message} from './types'

const getMessages = (
  postId: Post['id'],
  supabase: SupabaseContext['supabase']
): PostgrestBuilder<Tables<'messages'>[]> =>
  supabase
    .from('messages')
    .select()
    .eq('post_id', postId)
    .order('created_at')
    .throwOnError()

export const useChatListener = (
  user: SupabaseContext['user'],
  supabase: SupabaseContext['supabase'],
  store: ChatStore
): void => {
  const postId = getSearchPost()

  // Memoize `getMessages` to prevent unnecessary re-renders
  const fetchMessages = useMemo(
    () => (postId ? () => getMessages(postId, supabase) : null),
    [postId, supabase]
  )

  // Fetch messages using custom hook
  const {data, loading, error} = useSupabaseFetch(fetchMessages, [postId])

  useEffect(() => {
    if (!data) {
      return // Avoid updating store with null data
    }

    const messages = Util.explicitlyCastFromJsonToReactions(data)
    store.setChat({loading, data: messages, error})
  }, [data, loading, error, store])

  useEffect(() => {
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {event: 'INSERT', schema: 'public', table: 'messages'},
        payload => store.handleInsert(payload.new as Message)
      )
      .on(
        'postgres_changes',
        {event: 'DELETE', schema: 'public', table: 'messages'},
        payload => store.handleDelete(payload.old as Message)
      )
      .on(
        'postgres_changes',
        {event: 'UPDATE', schema: 'public', table: 'messages'},
        payload =>
          store.handleUpdate(payload.old as Message, payload.new as Message)
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, store, user, postId])
}
