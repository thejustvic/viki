import {useSupabaseFetch} from '@/hooks/use-supabase-fetch'
import {SupabaseContext} from '@/utils/supabase-utils/supabase-provider'
import {useCallback, useEffect} from 'react'
import {TeamStore} from './team-store'

const getMemberTeams = (
  supabase: SupabaseContext['supabase'],
  user: SupabaseContext['user']
) => {
  if (!user) {
    throw Error('You must provide a user object!')
  }
  return supabase
    .from('teams')
    .select(
      `
          *,
          team_members!inner (
            email
          )
        `
    )
    .eq('team_members.email', user.email ?? '')
    .throwOnError()
}

export const useMemberTeamsListener = (
  user: SupabaseContext['user'],
  supabase: SupabaseContext['supabase'],
  store: TeamStore
): void => {
  const fetchMemberTeams = useCallback(() => {
    if (!user) {
      return null
    }
    return getMemberTeams(supabase, user)
  }, [user])

  const {data, loading, error} = useSupabaseFetch(fetchMemberTeams, [user])

  useEffect(() => {
    store.setMemberTeams({
      loading,
      data,
      error
    })
  }, [data, loading, error])
}
