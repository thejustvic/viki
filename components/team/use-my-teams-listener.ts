import {useSupabaseFetch} from '@/hooks/use-supabase-fetch'
import {SupabaseContext} from '@/utils/supabase-utils/supabase-provider'
import {User} from '@supabase/supabase-js'
import {useCallback, useEffect} from 'react'
import {TeamStore} from './team-store'
import {Team} from './types'

const getMyTeams = (
  user: SupabaseContext['user'],
  supabase: SupabaseContext['supabase']
) => {
  if (!user) {
    throw Error('You must provide a user object!')
  }
  return supabase.from('teams').select().eq('owner_id', user.id).throwOnError()
}

export const useMyTeamsListener = ({
  user,
  supabase,
  store,
  currentTeamId
}: {
  user: SupabaseContext['user']
  supabase: SupabaseContext['supabase']
  store: TeamStore
  currentTeamId: string | null
}): void => {
  const fetchMyTeams = useCallback(() => {
    if (!user) {
      return null
    }
    return getMyTeams(user, supabase)
  }, [currentTeamId])

  const {data, loading, error} = useSupabaseFetch(fetchMyTeams, [currentTeamId])

  useEffect(() => {
    store.setMyTeams({
      loading,
      data,
      error
    })
  }, [data, loading, error])

  useSupabaseMyTeamsListener(supabase, user, store)
}

const useSupabaseMyTeamsListener = (
  supabase: SupabaseContext['supabase'],
  user: User | null,
  store: TeamStore
): void => {
  useEffect(() => {
    const userId = user?.id
    const channel = supabase
      .channel('team')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'teams',
          filter: `owner_id=eq.${userId}`
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
          filter: `owner_id=eq.${userId}`
        },
        payload =>
          store.handleUpdateTeam(payload.old as Team, payload.new as Team)
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])
}
