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

  useEffect(() => {
    const channel = supabase
      .channel('team')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'teams',
          filter: `owner_id=eq.${user?.id}`
        },
        payload => store.handleInsertTeam(payload.new as Team)
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'teams'
        },
        payload => store.handleDeleteTeam(payload.old as Team)
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'teams',
          filter: `owner_id=eq.${user?.id}`
        },
        payload =>
          store.handleUpdateTeam(payload.old as Team, payload.new as Team)
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, store, user])
}
