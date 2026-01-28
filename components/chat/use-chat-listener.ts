import {getSearchCard} from '@/components/cards/get-search-card'
import {Card} from '@/components/cards/types'
import {useSupabaseFetch} from '@/hooks/use-supabase-fetch'
import {SupabaseContext} from '@/utils/supabase-utils/supabase-provider'
import {Util} from '@/utils/util'
import {useCallback, useEffect} from 'react'
import {ChatStore} from './chat-store'
import {Message} from './types'

const getMessages = (
  cardId: Card['id'],
  supabase: SupabaseContext['supabase']
) =>
  supabase
    .from('messages')
    .select()
    .eq('card_id', cardId)
    .order('created_at')
    .throwOnError()

// Reusable Supabase Listener Hook
const useSupabaseChatListener = (
  supabase: SupabaseContext['supabase'],
  cardId: Card['id'] | null,
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
  }, [supabase, store, cardId])
}

export const useChatListener = (
  user: SupabaseContext['user'],
  supabase: SupabaseContext['supabase'],
  store: ChatStore
): void => {
  const cardId = getSearchCard()

  const fetchMessages = useCallback(() => {
    if (!user) {
      return null
    }
    if (!cardId) {
      return null
    }
    return getMessages(cardId, supabase)
  }, [cardId, user])

  // Fetch messages using custom hook
  const {data, loading, error} = useSupabaseFetch(fetchMessages, [cardId])

  useEffect(() => {
    const messages = Util.explicitlyCastFromJsonToReactions(data)
    store.setChat({loading, data: messages, error})
  }, [data, loading, error, store])

  useSupabaseChatListener(supabase, cardId, store)
}
