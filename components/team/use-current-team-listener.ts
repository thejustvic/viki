import {useSupabaseFetch} from '@/hooks/use-supabase-fetch'
import {SupabaseContext} from '@/utils/supabase-utils/supabase-provider'
import {useCallback, useEffect} from 'react'
import {TeamStore} from './team-store'
import {TeamMember} from './types'

// Fetch team and its members
const getTeam = (supabase: SupabaseContext['supabase'], teamId: string) => {
  return supabase
    .from('teams')
    .select('*, team_members(*)')
    .eq('id', teamId)
    .maybeSingle()
    .throwOnError()
}

// Supabase Realtime Listener Hook
const useSupabaseTeamListener = (
  supabase: SupabaseContext['supabase'],
  teamId: string | null | undefined,
  store: TeamStore
): void => {
  useEffect(() => {
    if (!teamId) {
      return
    }

    const channel = supabase
      .channel(`team-members-${teamId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'team_members',
          filter: `team_id=eq.${teamId}`
        },
        payload => store.handleInsertTeamMember(payload.new as TeamMember)
      )
      .on(
        'postgres_changes',
        {event: 'DELETE', schema: 'public', table: 'team_members'},
        payload => store.handleDeleteTeamMember(payload.old as TeamMember)
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'team_members',
          filter: `team_id=eq.${teamId}`
        },
        payload =>
          store.handleUpdateTeamMember(
            payload.old as TeamMember,
            payload.new as TeamMember
          )
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
      store.clear()
    }
  }, [teamId])
}

// Fetch team data and listen for changes
export const useCurrentTeamListener = ({
  user,
  supabase,
  store,
  teamId
}: {
  user: SupabaseContext['user']
  supabase: SupabaseContext['supabase']
  store: TeamStore
  teamId: string | null | undefined
}): void => {
  const fetchTeam = useCallback(() => {
    if (!user) {
      return null
    }
    if (!teamId) {
      return null
    }
    return getTeam(supabase, teamId)
  }, [teamId])

  const {data, loading, error} = useSupabaseFetch(fetchTeam, [teamId])

  useEffect(() => {
    store.setCurrentTeam({loading, data, error})
  }, [data, loading, error])

  useSupabaseTeamListener(supabase, teamId, store)
}
