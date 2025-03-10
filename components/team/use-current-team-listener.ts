import {useSupabaseFetch} from '@/hooks/use-supabase-fetch'
import {SupabaseContext} from '@/utils/supabase-utils/supabase-provider'
import type {PostgrestBuilder} from '@supabase/postgrest-js'
import {useEffect} from 'react'
import {TeamStore} from './team-store'
import {TeamMember, TeamWithMembers} from './types'

const getTeam = (
  user: SupabaseContext['user'],
  supabase: SupabaseContext['supabase'],
  teamId: string
): PostgrestBuilder<TeamWithMembers | null> => {
  if (!user) {
    throw Error('You must provide a user object!')
  }
  return supabase
    .from('teams')
    .select('*, team_members(*)')
    .eq('id', teamId)
    .maybeSingle()
    .throwOnError()
}

export const useCurrentTeamListener = ({
  user,
  supabase,
  store,
  teamId
}: {
  user: SupabaseContext['user']
  supabase: SupabaseContext['supabase']
  store: TeamStore
  teamId: string
}): void => {
  const {data, loading, error} = useSupabaseFetch(
    teamId ? () => getTeam(user, supabase, teamId) : null,
    [teamId]
  )

  useEffect(() => {
    store.setCurrentTeam({
      loading,
      data,
      error
    })
  }, [data, loading, error])

  useEffect(() => {
    const channel = supabase
      .channel('teamMembers')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'team_members',
          filter: `team_id=eq.${teamId}`
        },
        payload => store.handleInsert(payload.new as TeamMember)
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'team_members'
        },
        payload => store.handleDelete(payload.old as TeamMember)
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
          store.handleUpdate(
            payload.old as TeamMember,
            payload.new as TeamMember
          )
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, store, user, teamId])
}
