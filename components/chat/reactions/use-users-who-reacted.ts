import {useSupabaseFetch} from '@/hooks/use-supabase-fetch'
import {ObjUtil} from '@/utils/obj-util'
import {
  SupabaseContext,
  useSupabase
} from '@/utils/supabase-utils/supabase-provider'
import {PostgrestBuilder} from '@supabase/postgrest-js'
import {useCallback, useEffect, useMemo, useRef} from 'react'
import {useChatStore} from '../chat-store'
import {Message, Profile} from '../types'

const getUsers = (
  supabase: SupabaseContext['supabase'],
  newUserIds: string[]
): PostgrestBuilder<Profile[]> => {
  return supabase.from('profiles').select().in('id', newUserIds).throwOnError()
}

const getAllUserIdsByReactions = (messages: Message[]): string[] => {
  const userIds = new Set<string>()

  messages.forEach(message => {
    ObjUtil.forEach(message.reactions, reaction => {
      message.reactions[reaction]?.forEach(userId => {
        userIds.add(userId)
      })
    })
  })

  return Array.from(userIds)
}

export const useUsersWhoReacted = (): void => {
  const {supabase} = useSupabase()
  const [state, store] = useChatStore()
  const fetchedUserIds = useRef(new Set<string>())

  // Get unique userIds to avoid requesting unnecessary data
  const userIds = useMemo(() => {
    if (!state.chat.data) {
      return null
    }
    return getAllUserIdsByReactions(state.chat.data)
  }, [state.chat.data])

  const fetchUsers = useCallback(() => {
    if (!userIds) {
      return null
    }

    if (!userIds || userIds.length === 0) {
      return null
    }
    const newUserIds = userIds.filter(id => !fetchedUserIds.current.has(id))
    if (newUserIds.length === 0) {
      return null
    }
    return getUsers(supabase, newUserIds)
  }, [supabase, userIds])

  const {data, loading, error} = useSupabaseFetch(fetchUsers, [userIds])

  useEffect(() => {
    store.setUsersWhoReacted({loading, data, error})
  }, [data, loading, error, store])
}
