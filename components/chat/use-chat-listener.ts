import {SupabaseContext} from '@/utils/supabase-utils/supabase-provider'
import {useEffect} from 'react'
import {ChatStore} from './chat-store'
import {Message} from './types'

export const useChatListener = (
  session: SupabaseContext['session'],
  supabase: SupabaseContext['supabase'],
  store: ChatStore
): void => {
  useEffect(() => {
    const channel = supabase
      .channel('chat')
      .on(
        'postgres_changes',
        {event: 'INSERT', schema: 'public', table: 'chat'},
        payload => store.handleInsert(payload.new as Message)
      )
      .on(
        'postgres_changes',
        {event: 'DELETE', schema: 'public', table: 'chat'},
        payload => store.handleDelete(payload.old as Message)
      )
      .on(
        'postgres_changes',
        {event: 'UPDATE', schema: 'public', table: 'chat'},
        payload =>
          store.handleUpdate(payload.old as Message, payload.new as Message)
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, store, session])
}
