import {getSearchPost} from '@/app/posts/components/get-search-post'
import {Post} from '@/app/posts/components/types'
import {useSupabaseFetch} from '@/hooks/use-supabase-fetch'
import {Tables} from '@/utils/database.types'
import {SupabaseContext} from '@/utils/supabase-utils/supabase-provider'
import {Util} from '@/utils/util'
import type {PostgrestBuilder} from '@supabase/postgrest-js'
import {useCallback, useEffect} from 'react'
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

// Reusable Supabase Listener Hook
const useSupabaseChatListener = (
  supabase: SupabaseContext['supabase'],
  postId: Post['id'] | null,
  store: ChatStore
): void => {
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
  }, [supabase, store, postId])
}

export const useChatListener = (
  supabase: SupabaseContext['supabase'],
  store: ChatStore
): void => {
  const postId = getSearchPost()

  const fetchMessages = useCallback(() => {
    if (!postId) {
      return null
    }
    return getMessages(postId, supabase)
  }, [postId, supabase])

  // Fetch messages using custom hook
  const {data, loading, error} = useSupabaseFetch(fetchMessages, [postId])

  useEffect(() => {
    const messages = Util.explicitlyCastFromJsonToReactions(data)
    store.setChat({loading, data: messages, error})
  }, [data, loading, error, store])

  useSupabaseChatListener(supabase, postId, store)
}
