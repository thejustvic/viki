import {useChatStore} from '@/components/chat/chat-store'
import {Message, Profile} from '@/components/chat/types'
import {useSupabaseFetch} from '@/hooks/use-supabase-fetch'
import {ObjUtil} from '@/utils/obj-util'
import {
  SupabaseContext,
  useSupabase
} from '@/utils/supabase-utils/supabase-provider'
import {PostgrestBuilder} from '@supabase/postgrest-js'
import {useEffect, useMemo, useRef} from 'react'

const getUsers = (
  supabase: SupabaseContext['supabase'],
  newUserIds: string[]
): PostgrestBuilder<Profile[]> | null => {
  return newUserIds.length
    ? supabase.from('profiles').select().in('id', newUserIds).throwOnError()
    : null
}

const getAllUserIdsByReactions = (messages: Message[]): string[] => {
  const userIds = new Set<string>()

  messages.forEach(message => {
    ObjUtil.forEach(message.reactions, reaction => {
      message.reactions[reaction]?.forEach(userId => userIds.add(userId))
    })
  })

  return Array.from(userIds)
}

export const useUsersWhoReacted = (): void => {
  const {supabase} = useSupabase()
  const [state, store] = useChatStore()
  const fetchedUserIds = useRef(new Set<string>())

  const newUserIds = useMemo(() => {
    if (!state.chat.data?.length) {
      return []
    }

    const allUserIds = getAllUserIdsByReactions(state.chat.data)
    return allUserIds.filter(id => !fetchedUserIds.current.has(id))
  }, [state.chat.data])

  const {data, loading, error} = useSupabaseFetch(
    newUserIds.length ? () => getUsers(supabase, newUserIds) : null,
    [newUserIds]
  )

  useEffect(() => {
    if (data?.length) {
      data.forEach(user => fetchedUserIds.current.add(user.id))
    }
  }, [data])

  useEffect(() => {
    store.setUsersWhoReacted({loading, data, error})
  }, [data, loading, error, store])
}
