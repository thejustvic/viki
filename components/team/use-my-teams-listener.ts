import {useSupabaseFetch} from '@/hooks/use-supabase-fetch'
import {SupabaseContext} from '@/utils/supabase-utils/supabase-provider'
import type {PostgrestBuilder} from '@supabase/postgrest-js'
import {useEffect} from 'react'
import {TeamStore} from './team-store'
import {Team} from './types'

const getMyTeams = (
  user: SupabaseContext['user'],
  supabase: SupabaseContext['supabase']
): PostgrestBuilder<Team[]> => {
  if (!user) {
    throw Error('You must provide a user object!')
  }
  return supabase.from('teams').select().eq('owner_id', user.id).throwOnError()
}

export const useMyTeamsListener = (
  user: SupabaseContext['user'],
  supabase: SupabaseContext['supabase'],
  store: TeamStore
): void => {
  const {data, loading, error} = useSupabaseFetch(
    user ? () => getMyTeams(user, supabase) : null,
    [user]
  )

  useEffect(() => {
    store.setMyTeams({
      loading,
      data,
      error
    })
  }, [data, loading, error])
}
