import {useSupabaseFetch} from '@/hooks/use-supabase-fetch'
import {SupabaseContext} from '@/utils/supabase-utils/supabase-provider'
import type {PostgrestBuilder} from '@supabase/postgrest-js'
import {useEffect} from 'react'
import {TeamStore} from './team-store'
import {Team} from './types'

const getMemberTeams = (
  supabase: SupabaseContext['supabase'],
  user: SupabaseContext['user']
): PostgrestBuilder<Team[]> => {
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
  const {data, loading, error} = useSupabaseFetch(
    user ? () => getMemberTeams(supabase, user) : null,
    [user]
  )

  useEffect(() => {
    store.setMemberTeams({
      loading,
      data,
      error
    })
  }, [data, loading, error])
}
