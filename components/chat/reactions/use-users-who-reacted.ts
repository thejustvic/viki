import {ObjUtil} from '@/utils/obj-util'
import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {useEffect, useMemo, useRef} from 'react'
import {useChatStore} from '../chat-store'
import {Message} from '../types'

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
  const isFetching = useRef(false)

  // Get unique userIds to avoid requesting unnecessary data
  const userIds = useMemo(() => {
    if (!state.chat.data) {
      return null
    }
    return getAllUserIdsByReactions(state.chat.data)
  }, [state.chat.data])

  useEffect(() => {
    if (!userIds || userIds.length === 0 || isFetching.current) {
      return
    }

    // Filter out already fetched userIds
    const newUserIds = userIds.filter(id => !fetchedUserIds.current.has(id))

    if (newUserIds.length === 0) {
      return
    }

    isFetching.current = true

    // Fetch the users if not already fetched
    const fetchUsers = async (): Promise<void> => {
      try {
        const {data, error} = await supabase
          .from('profiles')
          .select()
          .in('id', newUserIds)

        // Handle error from supabase
        if (error) {
          throw new Error(error.message || 'Error fetching users')
        }

        store.setUsersWhoReacted(data || [])
      } catch (err) {
        if (err instanceof Error) {
          console.error('Error fetching users:', err.message)
        } else {
          // In case err is not an instance of Error (unexpected errors)
          console.error('Unexpected error fetching users:', err)
        }
      } finally {
        isFetching.current = false
      }
    }

    // Call the fetch function
    void fetchUsers()
  }, [userIds, supabase, store]) // Don't include isMounted or hasFetched in dependencies
}
