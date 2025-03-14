import {useSupabase} from '@/utils/supabase-utils/supabase-provider'
import {useEffect, useMemo, useRef, useState} from 'react'
import {Profile, Reactions} from '../types'

export const useUsersWhoReacted = (
  reactions: Reactions
): {users: Profile[]; error: string | null} => {
  const {supabase} = useSupabase()
  const [users, setUsers] = useState<Profile[]>([])
  const [error, setError] = useState<string | null>(null)
  const hasFetched = useRef(false) // Prevents repeated fetching after the first fetch
  const isMounted = useRef(true) // Track mount status without re-triggering effect

  // Get unique userIds to avoid requesting unnecessary data
  const userIds = useMemo(() => Object.keys(reactions || {}), [reactions])

  useEffect(() => {
    // Prevent fetching if no userIds or already fetched
    if (userIds.length === 0 || hasFetched.current) {
      return
    }

    // Set flag to indicate fetching has occurred
    hasFetched.current = true

    // Fetch the users if not already fetched
    const fetchUsers = async (): Promise<void> => {
      try {
        const {data, error} = await supabase
          .from('profiles')
          .select()
          .in('id', userIds)

        // Handle error from supabase
        if (error) {
          throw new Error(error.message || 'Error fetching users')
        }

        setUsers(data || [])
      } catch (err) {
        if (err instanceof Error) {
          console.error('Error fetching users:', err.message)
          setError(
            err.message || 'Failed to fetch users. Please try again later.'
          )
        } else {
          // In case err is not an instance of Error (unexpected errors)
          console.error('Unexpected error fetching users:', err)
          setError('An unexpected error occurred. Please try again later.')
        }
      }
    }

    // Call the fetch function
    void fetchUsers()

    // Cleanup: set the component as unmounted
    return () => {
      isMounted.current = false
    }
  }, [userIds, supabase]) // Don't include isMounted or hasFetched in dependencies

  return {users, error}
}
