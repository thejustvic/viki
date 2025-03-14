import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {useEffect, useMemo, useRef, useState} from 'react'
import {Profile, Reactions} from '../types'

export const useUsersWhoReacted = (
  reactions: Reactions
): {users: Profile[]; error: string | null} => {
  const {supabase} = useSupabase()
  const [users, setUsers] = useState<Profile[]>([])
  const [error, setError] = useState<string | null>(null)
  const hasFetched = useRef(false) // Prevents repeated fetching

  // Get unique userIds to avoid requesting unnecessary data
  const userIds = useMemo(() => Object.keys(reactions || {}), [reactions])

  useEffect(() => {
    if (userIds.length === 0 || hasFetched.current) {
      return
    }

    hasFetched.current = true // Set flag to avoid repeated fetch

    let isMounted = true // Flag to prevent state update after component unmount

    const fetchUsers = async (): Promise<void> => {
      try {
        const {data, error} = await supabase
          .from('profiles')
          .select()
          .in('id', userIds)

        if (error) {
          throw error
        }
        if (isMounted) {
          setUsers(data || [])
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching users:', err)
          setError('Failed to fetch users')
        }
      }
    }

    void fetchUsers()

    return () => {
      isMounted = false // Prevent state update after unmount
    }
  }, [userIds, supabase])

  return {users, error}
}
